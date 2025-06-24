// components/modal/manualUpdateModal.jsx
import ReactDOM from "react-dom";
import React, { useState } from "react";
import equipment from '../../assets/img/equipment.png';

const ManualUpdateModal = ({ manual_id, fileName, onClose, onStart }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(null);

  // 매뉴얼 등록 API 호출
  const handleRegisterManual = async () => {
    if (!manual_id) {
      setError('매뉴얼 ID가 없습니다.');
      return;
    }

    setIsRegistering(true);
    setError(null);

    try {
      console.log('매뉴얼 업데이트 API 호출 시작...', manual_id);
      
      // PUT 메서드로 매뉴얼 업데이트 (백엔드 API 스펙에 맞게)
      const response = await fetch(`api/manuals/${manual_id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: fileName?.replace('.pdf', '') || 'Untitled',
          manual_type: 'experiment'
          // 필요한 다른 필드들도 추가 가능
        }),
      });

      console.log('매뉴얼 업데이트 응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `매뉴얼 업데이트 실패: HTTP ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.error('매뉴얼 업데이트 에러 상세:', errorData);
          errorMessage = errorData.detail || errorMessage;
        } catch (jsonError) {
          console.error('에러 응답 파싱 실패:', jsonError);
          if (response.status === 500) {
            errorMessage = '서버 내부 오류가 발생했습니다. 데이터베이스 연결을 확인해주세요.';
          } else if (response.status === 404) {
            errorMessage = '매뉴얼을 찾을 수 없거나 권한이 없습니다.';
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('매뉴얼 업데이트 성공:', result);
      
      setIsRegistered(true);

    } catch (error) {
      console.error('매뉴얼 업데이트 에러:', error);
      setError(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  // 모달이 열릴 때 자동으로 매뉴얼 등록 API 호출
  React.useEffect(() => {
    if (manual_id && !isRegistered && !isRegistering && !error) {
      // 실제 API 호출로 매뉴얼 업데이트
      handleRegisterManual();
    }
  }, [manual_id, isRegistered, isRegistering, error]);

  const modalContent = (
    <div 
    className="fixed inset-0 z-[99999] bg-black bg-opacity-50 flex justify-center items-center p-4"
    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
    >
      <div 
        className="w-[480px] bg-[#ffffff] rounded-[20px] shadow-xl px-10 py-8 flex flex-col items-center gap-2"
        style={{ 
          position: 'absolute',
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          maxHeight: '90vh',
          minHeight: '320px'
        }}
      >
        {/* 아이콘 */}
        <div className="flex justify-center mt-4">
          <div className="bg-[#FFF2CC] rounded-full p-4">
            <img src={equipment} alt="equipment" className="w-[40px] h-[40px]" />
          </div>
        </div>

        {/* 상태별 텍스트 */}
        <div className="flex-1 flex items-center justify-center mb-6">
          {isRegistering && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-[20px] font-semibold text-[#1C1C59] leading-relaxed">
                매뉴얼을 등록하는 중...
              </p>
            </div>
          )}
          
          {error && (
            <div className="text-center">
              <p className="text-[20px] font-semibold text-red-600 leading-relaxed mb-2">
                등록 실패
              </p>
              <p className="text-[14px] text-red-500">
                {error}
              </p>
            </div>
          )}
          
          {isRegistered && !error && (
            <p className="text-[24px] font-semibold text-[#1C1C59] text-center leading-relaxed">
              매뉴얼이 등록되었습니다!
            </p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex justify-center gap-6 w-full px-4 pb-2">
          <button
            onClick={onClose}
            className="flex-1 max-w-[140px] py-4 text-[16px] text-[#1C1C59] font-semibold bg-[#ffffff] border border-gray-300 rounded-full hover:bg-gray-100 transition duration-200"
            disabled={isRegistering}
          >
            닫기
          </button>
          <button
            onClick={onStart}
            className="flex-1 max-w-[140px] py-4 text-[16px] text-[#ffffff] font-semibold bg-[#4B4F8F] rounded-full hover:bg-[#3d417a] shadow transition duration-200 disabled:opacity-50"
            disabled={isRegistering || !!error}
          >
            실험하기
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ManualUpdateModal;