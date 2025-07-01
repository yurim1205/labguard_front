import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperimentStartBtn from '../button/experimentStartBtn';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '../../store/useAuthStore';
import close from '../../assets/img/close.png';

const NewExperimentModal = ({ onClose, onTitleSubmit }) => {
  const [experiment_title, setExperimentTitle] = useState(''); // 실험 제목 상태
  const [selectedManual, setSelectedManual] = useState(''); // 매뉴얼 선택 상태
  const [manuals, setManuals] = useState([]); // 실제 매뉴얼 데이터
  const [loading, setLoading] = useState(false);
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id || currentUser?.user_id || null;
  const navigate = useNavigate();

  // 매뉴얼 목록 가져오기
  useEffect(() => {
    const fetchManuals = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/manuals/', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setManuals(data.manuals || data || []);
        } else if (response.status === 401) {
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else {
          console.error('📋 실험 모달 - 매뉴얼 목록 조회 실패:', response.status);
        }
      } catch (error) {
        console.error('📋 실험 모달 - 매뉴얼 목록 조회 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchManuals();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!experiment_title.trim() || !selectedManual) {
      alert('실험 제목과 매뉴얼을 모두 입력해주세요.');
      return;
    }

    // 사용자 ID 확인
    if (!currentUserId) {
      alert('로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }
  
    try {
      const requestData = {
        title: experiment_title,
        manual_id: String(selectedManual),
        user_id: parseInt(currentUserId), // 정수형으로 변환
        experiment_date: new Date().toISOString().slice(0, 10),
      };
      
      console.log('실험 생성 요청 데이터:', requestData);
      
      const response = await fetch('/api/experiment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('실험 생성 실패 상세:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          errorData: errorData
        });
        
        // 404 에러인 경우 추가 디버깅
        if (response.status === 404) {
          console.error('404 에러 - API 엔드포인트를 찾을 수 없습니다.');
          console.error('확인사항:');
          console.error('1. 백엔드 서버가 실행되고 있는지 확인');
          console.error('2. experiment_router가 올바르게 등록되어 있는지 확인');
          console.error('3. POST /api/experiment 엔드포인트가 구현되어 있는지 확인');
        }
        
        throw new Error(`실험 생성 실패: ${response.status} - ${errorData}`);
      }
  
      const data = await response.json();
      console.log('실험 생성 응답:', data);
      
      const experiment_id = data.experiment_id;
  
      const selectedManualData = manuals.find(
        (manual) => manual.manual_id === parseInt(selectedManual)
      );





//////////////////////브리핑//////////////////////


      // 브리핑 생성 API 호출
      console.log('🎯 브리핑 생성 중...');
      let briefingData = null;
      
      try {
        const briefingResponse = await fetch('/api/briefing/generate', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            manual_id: selectedManual,
            user_id: currentUserId
          }),
        });

        if (briefingResponse.ok) {
          briefingData = await briefingResponse.json();
          console.log('🎯 브리핑 생성 성공:', briefingData);
        } else {
          console.error('🎯 브리핑 생성 실패:', briefingResponse.status);
        }
      } catch (briefingError) {
        console.error('🎯 브리핑 생성 에러:', briefingError);
      }
  


      //////////////////////브리핑 끝//////////////////////
      // 백엔드에서 반환받은 세션 ID로 실험 채팅 페이지로 이동
      console.log('실험 채팅 페이지로 이동:', {
        experiment_id,
        experiment_title,
        manual: selectedManualData || selectedManual,
        briefing: briefingData,
      });
      
      // 라우팅 경로를 experiment_id 기반으로 변경
      navigate(`/ExperimentChat/experiment/${experiment_id}`, {
        state: {
          experiment_id,
          experiment_title,
          manual: selectedManualData || selectedManual,
          // 브리핑 데이터 추가 - play_url을 audio_url로 전달
          summary: briefingData?.summary || '',
          audio_url: briefingData?.play_url || null,
        },
      });
  
      onClose(); // 모달 닫기
    } catch (error) {
      console.error('실험 생성 오류:', error);
      alert('실험 생성 중 오류가 발생했습니다.');
    }
  };
  
  return (
    <div
    className="fixed inset-0 z-[99999] bg-[#C4C2C2] bg-opacity-5 backdrop-blur-sm"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.05)', // 5% 투명도
      backdropFilter: 'blur(4px)', // blur 적용
      zIndex: 99999
    }}
    onClick={onClose}
  >
  
      {/* 모달 */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFFFF] rounded-[24px] p-10 shadow-lg border border-[#E6EEFF]"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px',
          height: '420px',
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
      >
                <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-[24px] h-[24px] flex items-center justify-center"
        >
          <img src={close} alt="close" className="w-[16px] h-[16px]" />
        </button>
        <h2 className="text-[20px] font-extrabold text-center mb-0 font-[500]">
          새 실험 생성
        </h2>
        <p className="text-[14px] text-[#5F6E9C] text-center mb-8">
          실험을 시작하기 전에 환경을 세팅해주세요.
        </p>

        <div className="mb-10 flex flex-col items-center justify-center">
          {/* 실험 제목 */}
          <div className="mb-6 w-[280px] max-w-md mt-[20px]">
            <label className="block text-[16px] font-bold text-[#1C1C59] mb-2 text-center">
              실험 제목
            </label>
            <input
              type="text"
              placeholder="실험 제목을 입력해주세요."
              value={experiment_title}
              onChange={(e) => setExperimentTitle(e.target.value)}
              className="w-full border border-gray-400 rounded px-4 py-2 text-sm h-[28px]"
            />
          </div>

          {/* 실험 매뉴얼 */}
          <div className="mb-6 w-[280px] max-w-md mt-[32px]">
            <label className="block text-[16px] font-bold text-[#1C1C59] mb-2 text-center">
              실험 매뉴얼
            </label>
            <select
              className="w-full border border-gray-400 rounded px-4 py-2 text-sm appearance-none h-[28px]"
              value={selectedManual}
              onChange={(e) => setSelectedManual(e.target.value)}
              disabled={loading}
            >
              <option value="">
                {loading ? "매뉴얼 로딩 중..." : "실험 매뉴얼 선택"}
              </option>
              {manuals.map((manual, idx) => (
                <option key={manual.manual_id || idx} value={manual.manual_id}>
                  {manual.filename || manual.title || `매뉴얼 ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>

          <ExperimentStartBtn onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default NewExperimentModal;