import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import ManualCancleBtn from '../../components/button/manualCancleBtn';
import DangerResultBtn from '../../components/button/dangerResultBtn';
import { useAuthStore } from '../../store/useAuthStore';

function ManualRead() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 전달받은 manual_id
  const manual_id = location.state?.manual_id;
  
  // 매뉴얼 데이터 상태
  const [manualData, setManualData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 매뉴얼 요약 데이터 상태
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  
  // 토큰 가져오기
  const { token } = useAuthStore();

  // 매뉴얼 데이터 불러오기
  useEffect(() => {
    if (!manual_id) {
      console.error('매뉴얼 ID가 없습니다.');
      navigate('/manual');
      return;
    }

    const fetchManualData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('📖 매뉴얼 데이터 로드 시작:', manual_id);
        
        // 요청 헤더 설정
        const headers = {
          'Content-Type': 'application/json',
        };
        
        // 토큰이 있으면 Authorization 헤더 추가
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // 매뉴얼 정보 가져오기
        const manualResponse = await fetch(`/api/manuals/${manual_id}`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
        });

        if (!manualResponse.ok) {
          let errorMessage = `매뉴얼 정보 조회 실패: HTTP ${manualResponse.status}`;
          try {
            const errorData = await manualResponse.json();
            console.error('📖 매뉴얼 조회 에러 상세:', errorData);
            errorMessage = errorData.detail || errorData.message || errorMessage;
          } catch (jsonError) {
            console.error('📖 에러 응답 파싱 실패:', jsonError);
          }
          throw new Error(errorMessage);
        }

        const manual = await manualResponse.json();
        console.log('📖 매뉴얼 정보:', manual);
        console.log('📖 매뉴얼 정보 상세:', {
          id: manual.id,
          manual_id: manual.manual_id,
          title: manual.title,
          user_id: manual.user_id
        });
        setManualData(manual);

      } catch (error) {
        console.error('📖 매뉴얼 데이터 로드 오류:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManualData();
  }, [manual_id, navigate, token]);

  // 매뉴얼 요약 데이터 불러오기
  useEffect(() => {
    if (!manual_id) return;

    const fetchSummaryData = async () => {
      setSummaryLoading(true);
      setSummaryError(null);

      try {
        console.log('📊 매뉴얼 요약 데이터 로드 시작:', manual_id);
        
        // 요청 헤더 설정
        const headers = {
          'Content-Type': 'application/json',
        };
        
        // 토큰이 있으면 Authorization 헤더 추가
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const summaryResponse = await fetch(`/api/manual-summary/manual/${manual_id}`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
        });

        console.log('📊 요약 응답 상태:', summaryResponse.status, summaryResponse.statusText);

        if (!summaryResponse.ok) {
          if (summaryResponse.status === 404) {
            // 404는 요약이 없는 경우로 처리
            setSummaryData({ experiment_summaries: [] });
            return;
          }
          throw new Error(`매뉴얼 요약 조회 실패: HTTP ${summaryResponse.status}`);
        }

        const summary = await summaryResponse.json();
        console.log('📊 매뉴얼 요약 데이터:', summary);
        setSummaryData(summary);

      } catch (error) {
        console.error('📊 매뉴얼 요약 로드 오류:', error);
        setSummaryError(error.message);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummaryData();
  }, [manual_id, token]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    navigate('/manual');
  };

  // 매뉴얼 삭제 핸들러
  const handleDelete = async () => {
    // 매뉴얼 데이터가 로드되지 않은 경우
    if (!manualData) {
      alert('매뉴얼 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const confirmed = window.confirm("이 매뉴얼을 삭제하시겠습니까?\n삭제된 매뉴얼은 복구할 수 없습니다.");
    if (!confirmed) return;

    // 실제 매뉴얼 ID 결정 (백엔드에서 반환된 실제 ID 사용)
    // 우선순위: manual_id (UUID) > id (숫자) > 원본 manual_id
    const actualManualId = manualData?.manual_id || manualData?.id || manual_id;
    
    try {
      console.log('🗑️ 매뉴얼 삭제 요청:', actualManualId);
      console.log('🗑️ 매뉴얼 데이터:', manualData);
      console.log('🗑️ 원본 manual_id:', manual_id);
      
      // 요청 헤더 설정
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // 토큰이 있으면 Authorization 헤더 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/manuals/${actualManualId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: headers,
      });

      console.log('🗑️ 삭제 응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          alert('로그인이 필요하거나 로그인이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login');
          return;
        }
        
        let errorMessage = `삭제 실패: HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('🗑️ 삭제 에러 상세:', errorData);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (jsonError) {
          console.error('🗑️ 에러 응답 파싱 실패:', jsonError);
        }
        
        throw new Error(errorMessage);
      }

      // 삭제 성공
      console.log('🗑️ 매뉴얼 삭제 성공');
      alert('매뉴얼이 성공적으로 삭제되었습니다.');
      navigate('/manual');

    } catch (error) {
      console.error('🗑️ 매뉴얼 삭제 오류:', error);
      
      // 네트워크 오류 처리
      if (error.message === 'Failed to fetch') {
        alert('서버에 연결할 수 없습니다. 백엔드 서버가 실행중인지 확인해주세요.');
      } else {
        alert(`삭제 실패: ${error.message}`);
      }
    }
  };





  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">매뉴얼</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">매뉴얼 요약 및 분석 확인</h2>
        
        {/* 매뉴얼 정보 헤더 */}
        {manualData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-2">📄 {manualData.filename || manualData.title}</h3>
            <div className="text-blue-700 text-sm space-y-1">
              <p>매뉴얼 ID: {manualData.manual_id}</p>
              <p>타입: {manualData.manual_type}</p>
              <p>상태: {manualData.status}</p>
              <p>업로드 시간: {new Date(manualData.uploaded_at).toLocaleString('ko-KR')}</p>
            </div>
          </div>
        )}

        {/* 실험별 요약 섹션 */}
        <section className="mb-6">
          <h2 className="text-[20px] font-bold text-left font-[500] mb-4">📋 실험별 요약</h2>
          
          {summaryLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-blue-700">요약 불러오는 중...</p>
            </div>
          )}

          {summaryError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="font-bold text-red-800 mb-2">❌ 요약 로드 실패</h4>
              <p className="text-red-700">{summaryError}</p>
            </div>
          )}

          {!summaryLoading && !summaryError && summaryData && (
            <>
              {summaryData.experiment_summaries && summaryData.experiment_summaries.length > 0 ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">
                      ✅ 총 {summaryData.total_experiments || summaryData.experiment_summaries.length}개의 실험 요약이 있습니다.
                    </p>
                  </div>
                  {summaryData.experiment_summaries.map((experiment, index) => (
                    <div key={experiment.experiment_id || index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-800">
                          🧪 목차 {index + 1}
                        </h3>
                        {/* <div className="text-sm text-gray-500 space-y-1">
                          <p>실험 ID: {experiment.experiment_id}</p>
                          <p>청크 수: {experiment.chunk_count}</p>
                          {experiment.created_at && (
                            <p>생성일: {new Date(experiment.created_at * 1000).toLocaleString('ko-KR')}</p>
                          )}
                        </div> */}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                          {experiment.summary || '요약 내용이 없습니다.'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600 text-lg">요약 결과가 없습니다.</p>
                  <p className="text-gray-500 text-sm mt-2">아직 이 매뉴얼에 대한 실험별 요약이 생성되지 않았습니다.</p>
                </div>
              )}
            </>
          )}
        </section>

        {/* 버튼 섹션 */}
        <div className="flex justify-end gap-[10px] mt-8">
          <button
            onClick={handleCancel}
            className="px-[24px] py-[7px] mt-[10px] border border-gray-300 rounded-[10px] bg-white text-gray-600
             font-[700] text-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] hover:bg-gray-100 hover:border-gray-400
              transition duration-200 cursor-pointer"
          >
            목록으로 돌아가기
          </button>
          <DangerResultBtn manual_id={manual_id} />
          <ManualCancleBtn onClick={handleDelete} />
        </div>
      </div>
    </>
  );
}

export default ManualRead;