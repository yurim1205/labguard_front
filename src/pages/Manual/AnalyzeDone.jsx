import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import UploadCancleBtn from '../../components/button/UploadCancleBtn';
import ManualUpdateBtn from '../../components/button/manualUpdateBtn';
import ManualUpdateModal from '../../components/modal/manualUpdateModal';

function AnalyzeDone() {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // 청크 데이터 관련 상태
  const [chunks, setChunks] = useState([]);
  const [chunksLoading, setChunksLoading] = useState(false);
  const [chunksError, setChunksError] = useState(null);

  // 전달받은 데이터 (manual_id, fileName, timestamp)
  const { manual_id, fileName, timestamp } = location.state || {};

  // 청크 데이터 가져오기
  useEffect(() => {
    const fetchChunks = async () => {
      if (!manual_id) return;

      setChunksLoading(true);
      setChunksError(null);

      try {
        console.log('청크 데이터 요청 시작...', manual_id);
        
        const response = await fetch(`http://localhost:8000/manual/chunks?manual_id=${manual_id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('청크 응답 상태:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`청크 데이터 조회 실패: HTTP ${response.status}`);
        }

        const chunksData = await response.json();
        console.log('청크 데이터 로드 완료:', chunksData);
        
        setChunks(chunksData.chunks || chunksData || []);
        
      } catch (error) {
        console.error('청크 데이터 로드 오류:', error);
        setChunksError(error.message);
      } finally {
        setChunksLoading(false);
      }
    };

    fetchChunks();
  }, [manual_id]);

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
      
      const response = await fetch(`http://localhost:8000/manuals/${manual_id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
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

        {/* 청크 분석 결과 섹션 */}
        <section className="bg-[#f8f9fa] rounded-lg p-8 mb-10">
          <h2 className="text-[20px] font-bold mb-6 text-left">📋 분석된 문서 내용</h2>
          
          {chunksLoading && (
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">문서 내용을 불러오는 중...</p>
            </div>
          )}

          {chunksError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="font-bold text-red-800 mb-2">❌ 문서 내용 로드 실패</h4>
              <p className="text-red-700">{chunksError}</p>
            </div>
          )}

          {!chunksLoading && !chunksError && chunks.length > 0 && (
            <div className="bg-white rounded-lg p-6 max-h-96 overflow-y-auto">
              <div className="space-y-6">
                {chunks.map((chunk, index) => (
                  <div key={index} className="chunk border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <div className="text-gray-800 leading-relaxed text-base">
                      {chunk.page_content?.split('\n').map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {line}
                          {lineIndex < chunk.page_content.split('\n').length - 1 && <br />}
                        </span>
                      )) || '내용이 없습니다.'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!chunksLoading && !chunksError && chunks.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600">분석된 문서 내용이 없습니다.</p>
            </div>
          )}
        </section>

        {/* 액션 버튼들 */}
        <div className="flex justify-center gap-4 mt-8">
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
