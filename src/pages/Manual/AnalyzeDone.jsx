import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import UploadCancleBtn from '../../components/button/UploadCancleBtn';
import ManualUpdateBtn from '../../components/button/manualUpdateBtn';
import ManualUpdateModal from '../../components/modal/manualUpdateModal';
import { useAuthStore } from '../../store/useAuthStore';

function AnalyzeDone() {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  


  // 매뉴얼 요약 데이터 상태
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  
  // 진행률 추적 상태
  const [totalCount, setTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoadingTotal, setIsLoadingTotal] = useState(false);

  // 전달받은 데이터 (manual_id, fileName, timestamp)
  const { manual_id, fileName, timestamp } = location.state || {};
  
  // 토큰 가져오기
  const { token } = useAuthStore();



  // 총 실험 개수 불러오기
  useEffect(() => {
    if (!manual_id) return;

    const fetchTotalCount = async () => {
      setIsLoadingTotal(true);
      try {
        console.log('🔢 총 실험 개수 조회 시작:', manual_id);
        
        const headers = {
          'Content-Type': 'application/json',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const countResponse = await fetch(`/api/manual-summary/manual/${manual_id}/experiment-count`, {
          method: 'GET',
          credentials: 'include',
          headers: headers,
        });

        console.log('🔢 실험 개수 응답 상태:', countResponse.status);

        if (countResponse.ok) {
          const countData = await countResponse.json();
          console.log('🔢 총 실험 개수:', countData.count);
          setTotalCount(countData.count || 0);
        } else {
          console.warn('🔢 실험 개수 조회 실패:', countResponse.status);
        }
      } catch (error) {
        console.error('🔢 실험 개수 조회 오류:', error);
      } finally {
        setIsLoadingTotal(false);
      }
    };

    fetchTotalCount();
  }, [manual_id, token]);

  // 매뉴얼 요약 데이터 불러오기 (폴링 방식)
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
        
        // 완료된 실험 수 업데이트
        const completed = summary?.experiment_summaries?.length || 0;
        setCompletedCount(completed);
        console.log('✅ 완료된 실험 수:', completed);

      } catch (error) {
        console.error('📊 매뉴얼 요약 로드 오류:', error);
        setSummaryError(error.message);
      } finally {
        setSummaryLoading(false);
      }
    };

    // 초기 데이터 로드
    fetchSummaryData();
    
    // 요약이 완료되지 않은 경우 폴링 시작
    let intervalId;
    if (totalCount > 0 && completedCount < totalCount) {
      intervalId = setInterval(async () => {
        await fetchSummaryData();
        // 완료되면 폴링 중단
        if (completedCount >= totalCount) {
          clearInterval(intervalId);
        }
      }, 3000); // 3초마다 업데이트 확인
    }

    // 정리 함수
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [manual_id, token, totalCount]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // 모달에서 "닫기" 버튼 클릭 시 ManualUpload 페이지로 이동
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/manualUpload');
  };

  // 모달에서 "실험하기" 버튼 클릭 시 ExperimentMain 페이지로 이동
  const handleStartExperiment = () => {
    setShowModal(false);
    navigate('/ExperimentMain');
  };

  // 업로드 취소 버튼 클릭 핸들러
  const handleUploadCancel = async () => {
    const confirmed = window.confirm("매뉴얼 등록을 취소하시겠습니까?\n업로드된 파일이 삭제됩니다.");
    if (!confirmed) return;

    try {
      console.log('🗑️ 매뉴얼 등록 취소 요청:', manual_id);
      
      // 요청 헤더 설정
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // 토큰이 있으면 Authorization 헤더 추가
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/manuals/${manual_id}`, {
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
        
        let errorMessage = `등록 취소 실패: HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('🗑️ 삭제 에러 상세:', errorData);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (jsonError) {
          console.error('🗑️ 에러 응답 파싱 실패:', jsonError);
        }
        
        throw new Error(errorMessage);
      }

      // 등록 취소 성공
      console.log('🗑️ 매뉴얼 등록 취소 성공');
      alert('매뉴얼 등록이 취소되었습니다.');
      navigate('/manualUpload');

    } catch (error) {
      console.error('🗑️ 매뉴얼 등록 취소 오류:', error);
      
      // 네트워크 오류 처리
      if (error.message === 'Failed to fetch') {
        alert('서버에 연결할 수 없습니다. 백엔드 서버가 실행중인지 확인해주세요.');
      } else {
        alert(`등록 취소 실패: ${error.message}`);
      }
    }
  };

  // 매뉴얼 등록 버튼 클릭 핸들러 (모달 표시)
  const handleManualUpdate = () => {
    setShowModal(true);
  };

  // 데이터가 없는 경우 처리
  if (!manual_id || !fileName) {
    return (
      <>
        <Header />
        <div className="max-w-[1200px] mx-auto pt-10 pb-12">
          <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">매뉴얼 분석 결과</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 text-lg mb-4">분석 결과를 찾을 수 없습니다.</p>
            <button 
              onClick={() => navigate('/manualUpload')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              매뉴얼 업로드로 돌아가기
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">매뉴얼 분석 완료</h1>
        
        {/* 파일 정보 섹션 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-800 mb-2">📄 업로드된 파일</h3>
          <p className="text-blue-700">파일명: <span className="font-semibold">{fileName}</span></p>
          <p className="text-blue-700">매뉴얼 ID: <span className="font-semibold">{manual_id}</span></p>
          <p className="text-blue-700 text-sm">처리 시간: {new Date(timestamp).toLocaleString('ko-KR')}</p>
          
          {/* 업로드 성공 상태 */}
          <div className="mt-3 flex items-center">
            <span className="text-green-600 mr-2">✅</span>
            <span className="text-green-700 font-medium">파일 업로드 성공</span>
          </div>
        </div>

        {/* 실험별 요약 섹션 */}
        <section className="mb-6">
          <h2 className="text-[20px] font-bold text-left font-[500] mb-4">📋 실험별 요약</h2>
          
          {/* 진행률 표시 */}
          {totalCount > 0 && completedCount < totalCount && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-yellow-800 font-semibold">🔄 요약 진행 중...</h3>
                <span className="text-yellow-700 text-sm font-medium">
                  {completedCount} / {totalCount}개 완료
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-yellow-200 rounded-full h-3 mb-3">
                <div 
                  className="bg-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                ></div>
              </div>
              
              <div className="flex items-center text-yellow-700 text-sm">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500 mr-2"></div>
                <span>실험 매뉴얼을 분석하여 요약을 생성하고 있습니다...</span>
              </div>
              
              {/* 진행률 퍼센트 */}
              <div className="mt-2 text-right">
                <span className="text-yellow-600 text-xs font-medium">
                  {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}% 완료
                </span>
              </div>
            </div>
          )}
          
          {summaryLoading && !totalCount && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-blue-700">실험 개수를 확인하는 중...</p>
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
                  {/* 완료 상태 표시 */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-green-600 text-xl mr-2">🎉</span>
                        <p className="text-green-800 font-medium">
                          요약 완료! 총 {summaryData.total_experiments || summaryData.experiment_summaries.length}개의 실험 요약
                        </p>
                      </div>
                      {totalCount > 0 && completedCount >= totalCount && (
                        <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded">
                          100% 완료
                        </span>
                      )}
                    </div>
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
          <UploadCancleBtn onClick={handleUploadCancel} />
          <ManualUpdateBtn onClick={handleManualUpdate} />
        </div>
      </div>

      {/* 매뉴얼 등록 완료 모달 */}
      {showModal && (
        <ManualUpdateModal
          manual_id={manual_id}
          fileName={fileName}
          onClose={handleCloseModal}
          onStart={handleStartExperiment}
        />
      )}
    </>
  );
}

export default AnalyzeDone;
