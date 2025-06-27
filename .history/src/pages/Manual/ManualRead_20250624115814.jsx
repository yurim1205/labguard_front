import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import ManualCancleBtn from '../../components/button/manualCancleBtn';
import DangerResultBtn from '../../components/button/dangerResultBtn';

function ManualRead() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // 전달받은 manualId
  const manualId = location.state?.manualId;
  
  // 매뉴얼 데이터 상태
  const [manualData, setManualData] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 매뉴얼 데이터 불러오기
  useEffect(() => {
    if (!manualId) {
      console.error('매뉴얼 ID가 없습니다.');
      navigate('/manual');
      return;
    }

    const fetchManualData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('📖 매뉴얼 데이터 로드 시작:', manualId);
        
        // 매뉴얼 정보 가져오기
        const manualResponse = await fetch(`api/manuals/${manualId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!manualResponse.ok) {
          throw new Error(`매뉴얼 정보 조회 실패: HTTP ${manualResponse.status}`);
        }

        const manual = await manualResponse.json();
        console.log('📖 매뉴얼 정보:', manual);
        setManualData(manual);

        // 청크 데이터 가져오기
        const chunksResponse = await fetch(`http://localhost:8000/manual/chunks?manual_id=${manualId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!chunksResponse.ok) {
          throw new Error(`청크 데이터 조회 실패: HTTP ${chunksResponse.status}`);
        }

        const chunksData = await chunksResponse.json();
        console.log('📖 청크 데이터:', chunksData);
        setChunks(chunksData.chunks || chunksData || []);

      } catch (error) {
        console.error('📖 매뉴얼 데이터 로드 오류:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManualData();
  }, [manualId, navigate]);

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
    const confirmed = window.confirm("이 매뉴얼을 삭제하시겠습니까?\n삭제된 매뉴얼은 복구할 수 없습니다.");
    if (!confirmed) return;

    try {
      console.log('🗑️ 매뉴얼 삭제 요청:', manualId);
      
      const response = await fetch(`http://localhost:8000/manuals/${manualId}`, {
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

  // 위험도 분석 결과 버튼 클릭 핸들러
  const handleDangerResult = () => {
    console.log('📊 위험도 분석 결과 버튼 클릭 - 매뉴얼 ID:', manualId);
    // RiskAnalyzeResult 페이지로 이동하면서 manualId 전달
    navigate('/RiskAnalyzeResult', { 
      state: { 
        manualId: manualId,
        manualData: manualData 
      } 
    });
  };

  // manualId가 없는 경우
  if (!manualId) {
    return (
      <>
        <Header />
        <div className="max-w-[1200px] mx-auto pt-10 pb-12">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">매뉴얼 ID가 없습니다.</p>
            <button 
              onClick={() => navigate('/manual')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              매뉴얼 목록으로 돌아가기
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

        <section className="bg-[#ecece7] min-h-[560px] rounded-lg p-10 mb-10 pt-[24px] px-[100px] relative">
          <section className="bg-[#EDF2FF] min-h-[450px] rounded-lg p-10 mb-10 pt-[24px]">
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">매뉴얼 내용을 불러오는 중...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h4 className="font-bold text-red-800 mb-2">❌ 매뉴얼 로드 실패</h4>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {!loading && !error && chunks.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">📋 매뉴얼 내용</h3>
                {chunks.map((chunk, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="text-gray-800 leading-relaxed text-base whitespace-pre-wrap">
                      {chunk.page_content || '내용이 없습니다.'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && chunks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">분석된 매뉴얼 내용이 없습니다.</p>
              </div>
            )}
          </section>

          <div className="absolute bottom-5 right-[100px]">
            <div className='flex gap-[10px]'> 
              <button
                onClick={handleCancel}
                className="px-[24px] py-[7px] mt-[10px] border border-gray-300 rounded-[10px] bg-white text-gray-600
                 font-[700] text-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] hover:bg-gray-100 hover:border-gray-400
                  transition duration-200 cursor-pointer"
              >
                목록으로 돌아가기
              </button>
              <DangerResultBtn onClick={handleDangerResult} />
              <ManualCancleBtn onClick={handleDelete} />
            </div> 
          </div>
        </section>
      </div>
    </>
  );
}

export default ManualRead;