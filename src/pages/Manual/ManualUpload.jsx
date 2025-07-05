import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import equipment from '../../assets/img/equipment.png';
import AnalyzeBtn from '../../components/button/analyzeBtn'; 
import ManualAnalyzeLoading from '../../components/ManualAnalyzeLoading';
import { useAuthStore } from '../../store/useAuthStore';

function ManualUpload() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // 업로드된 매뉴얼 목록 (filename과 uploaded_at만 표시용)
  const [uploadedManuals, setUploadedManuals] = useState([]);
  const [manualsLoading, setManualsLoading] = useState(false);
  const [manualsError, setManualsError] = useState(null);
  
  // useAuthStore에서 로그인 상태 확인
  const { isLoggedIn } = useAuthStore();

  // 매뉴얼 목록 불러오기 함수
  const fetchManuals = async () => {
    setManualsLoading(true);
    setManualsError(null);

    try {
      console.log('📋 매뉴얼 목록 API 호출 시작...');
      
      const response = await fetch('/api/manuals/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📋 매뉴얼 목록 응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('🔐 인증 오류 - 로그인 필요');
          setManualsError('로그인이 필요하거나 세션이 만료되었습니다.');
          return;
        }
        throw new Error(`매뉴얼 목록 조회 실패: HTTP ${response.status}`);
      }

      const manualsData = await response.json();
      console.log('📋 매뉴얼 목록 데이터:', manualsData);
      console.log('📋 매뉴얼 개수:', manualsData.length);
      
      // 각 매뉴얼의 상태 확인
      manualsData.forEach((manual, index) => {
        console.log(`📄 매뉴얼 ${index + 1}:`, {
          title: manual.title,
          filename: manual.filename,
          status: manual.status,
          uploaded_at: manual.uploaded_at,
          manual_id: manual.manual_id
        });
      });

      // 상태 필터링 - uploaded와 registered 모두 포함
      const filteredManuals = manualsData.filter(manual => 
        manual.status === 'uploaded' || manual.status === 'registered'
      );
      
      console.log('🔍 필터링된 매뉴얼 개수:', filteredManuals.length);
      console.log('🔍 필터링된 매뉴얼:', filteredManuals);
      
      setUploadedManuals(filteredManuals);
      
    } catch (error) {
      console.error('📋 매뉴얼 목록 로드 오류:', error);
      setManualsError(error.message);
    } finally {
      setManualsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 매뉴얼 목록 불러오기
  useEffect(() => {
    if (isLoggedIn) {
      fetchManuals();
    }
  }, [isLoggedIn]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  // 매뉴얼 클릭 핸들러
  const handleManualClick = (manual_id) => {
    console.log('📖 매뉴얼 클릭:', manual_id);
    navigate('/ManualRead', { 
      state: { 
        manual_id: manual_id 
      } 
    });
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      console.error('파일이 선택되지 않았습니다.');
      return;
    }

    setIsLoading(true);

    try {
      // 파일 업로드 (매뉴얼 등록 API는 호출하지 않음)
      console.log('파일 업로드 시작...');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', selectedFile.name.replace('.pdf', ''));
      formData.append('manual_type', 'experiment');

      console.log('업로드 요청 데이터:', {
        filename: selectedFile.name,
        title: selectedFile.name.replace('.pdf', ''),
        manual_type: 'experiment',
        size: selectedFile.size
      });

      const uploadResponse = await fetch('/api/manuals/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      console.log('업로드 응답 상태:', uploadResponse.status, uploadResponse.statusText);

      if (!uploadResponse.ok) {
        let errorMessage = `업로드 실패: HTTP ${uploadResponse.status}`;
        
        // 응답 텍스트 전체를 먼저 읽어 보기
        let responseText = '';
        try {
          responseText = await uploadResponse.text();
          console.error('서버 에러 응답 원문:', responseText);
        } catch (textError) {
          console.error('응답 텍스트 읽기 실패:', textError);
        }
        
        try {
          // JSON 파싱 시도
          const errorData = responseText ? JSON.parse(responseText) : {};
          console.error('업로드 에러 상세:', errorData);
          errorMessage = errorData.detail || errorData.message || errorMessage;
          
          // 401 인증 오류 처리
          if (uploadResponse.status === 401) {
            alert('로그인이 필요하거나 로그인이 만료되었습니다. 다시 로그인해주세요.');
            navigate('/login');
            return;
          }
        } catch (jsonError) {
          console.error('에러 응답 JSON 파싱 실패:', jsonError);
          
          // 상태 코드별 에러 메시지 개선
          if (uploadResponse.status === 500) {
            errorMessage = '서버 내부 오류가 발생했습니다.\n\n가능한 원인:\n• 데이터베이스 연결 문제\n• 파일 처리 오류\n• 서버 리소스 부족\n\n시스템 관리자에게 문의해주세요.';
            console.error('500 에러 - 서버 응답:', responseText);
          } else if (uploadResponse.status === 401) {
            alert('로그인이 필요하거나 로그인이 만료되었습니다. 다시 로그인해주세요.');
            navigate('/login');
            return;
          } else if (uploadResponse.status === 413) {
            errorMessage = '파일 크기가 너무 큽니다. 30MB 이하의 파일을 업로드해주세요.';
          } else if (uploadResponse.status === 415) {
            errorMessage = '지원하지 않는 파일 형식입니다. PDF 파일만 업로드 가능합니다.';
          } else if (uploadResponse.status >= 500) {
            errorMessage = `서버 오류가 발생했습니다 (${uploadResponse.status}). 잠시 후 다시 시도해주세요.`;
          } else if (uploadResponse.status >= 400) {
            errorMessage = `요청 오류가 발생했습니다 (${uploadResponse.status}). 파일과 입력값을 확인해주세요.`;
          }
        }
        
        throw new Error(errorMessage);
      }

      const uploadResult = await uploadResponse.json();
      console.log('파일 업로드 성공:', uploadResult);
      
      // manual_id 추출 (다양한 필드명 대응)
      const manualId = uploadResult.manual_id || uploadResult.id || uploadResult.manual?.id;
      if (!manualId) {
        console.error('업로드 응답 데이터:', uploadResult);
        throw new Error('업로드 응답에서 매뉴얼 ID를 찾을 수 없습니다.');
      }

      console.log('추출된 manual_id:', manualId);

      // 성공 시 파일 선택 상태 초기화
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // alert 메시지 제거하고 바로 AnalyzeDone 페이지로 이동
      navigate('/AnalyzeDone', {
        state: {
          manual_id: manualId,
          fileName: selectedFile.name,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('매뉴얼 처리 에러:', error);
      
      // 네트워크 오류 처리
      if (error.message === 'Failed to fetch') {
        alert('서버에 연결할 수 없습니다. 백엔드 서버가 실행중인지 확인해주세요.');
      } else if (error.message.includes('데이터베이스')) {
        alert('데이터베이스 오류가 발생했습니다. 시스템 관리자에게 문의해주세요.\n\n오류 내용: ' + error.message);
      } else {
        alert(`처리 실패: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">매뉴얼</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">매뉴얼 등록</h2>
        <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
          PDF 형식 매뉴얼을 업로드하면 AI가 핵심 위험 요소와 절차를 요약·분석해줍니다.
        </p>

        {/* 실험 업로드 영역 */}
        <section className="bg-[#ecece7] rounded-lg p-10 mb-10 pt-[24px]">
          <div className="max-w-[520px] mx-auto">
            <div className="border border-dashed border-[#b5b5b5] rounded-lg bg-[#FFFFFF] shadow-[0_6px_12px_0_rgba(128,128,128,0.28)] min-h-[360px] flex flex-col items-center justify-center p-10 text-center gap-4">
              {!selectedFile ? (
                <>
                  <div className="font-[500] text-[#0E467B] text-lg">첨부할 파일 놓기</div>
                  <div className="text-base text-[#798483] mt-[10px]">또는</div>
                  <label
                    htmlFor="file-upload"
                    className="mt-[10px] font-[500] rounded-[3px] shadow-[0_6px_12px_0_rgba(128,128,128,0.28)] inline-block bg-white text-[#0E467B] border border-[#0E467B] px-[10px] py-[2px] font-semibold text-base cursor-pointer transition-colors duration-200 hover:text-white"
                  >
                    파일 선택
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <section className="h-[260px] rounded-lg p-10 mb-10 pt-[24px] flex flex-col items-center justify-center gap-6">
                    {!isLoading && (
                      <div className="bg-[#cfe3ff] text-[#0E467B] px-6 py-2 rounded-full text-[15px] font-medium">
                        {selectedFile.name}
                      </div>
                    )}
                    {isLoading ? (
                      <ManualAnalyzeLoading />
                    ) : (
                      <AnalyzeBtn onClick={handleAnalyze} />
                    )}
                  </section>
                </div>
              )}
            </div>

            <div className="text-[#888] text-[14px] mb-[44px] text-left mt-[12px]">
              · 파일 업로드는 PDF 형식만 가능하며, 용량은 30MB 이하로 제한됩니다.
            </div>
          </div>
        </section>

        {/* 내 매뉴얼 */}
        <section className="mt-[48px]">
          <h2 className="text-[20px] font-bold mb-3 text-left font-[500]">내 매뉴얼</h2>

          {/* 로딩 상태 */}
          {manualsLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center mb-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-blue-700">매뉴얼 목록을 불러오는 중...</p>
            </div>
          )}

          {/* 에러 상태 */}
          {manualsError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <h4 className="font-bold text-red-800 mb-2">❌ 매뉴얼 목록 로드 실패</h4>
              <p className="text-red-700">{manualsError}</p>
              <button 
                onClick={fetchManuals}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                다시 시도
              </button>
            </div>
          )}

          {/* 업로드된 매뉴얼이 없는 경우 */}
          {!manualsLoading && !manualsError && uploadedManuals.length === 0 && (
            <div className="bg-gray-50 border border-[#0E467B] rounded-[10px] p-8 text-center">
              <p className="text-[#0E467B] text-lg">아직 업로드된 매뉴얼이 없습니다.</p>
              <p className="text-[#0E467B] text-sm mt-2">PDF 파일을 업로드하여 매뉴얼을 등록해보세요.</p>
              <button 
                onClick={fetchManuals}
                className={`px-4 py-2 w-[120px] h-[40px] rounded-[5px] font-medium text-[14px] mb-[10px]
                  shadow-[0_12px_24px_0_rgba(128,128,128,0.35)] transition border-none flex-shrink-0
                  bg-[#99B5CE] hover:bg-[#4071c7] text-[#ffffff]`}
              >
                목록 새로고침
              </button>
            </div>
          )}

          {/* 업로드된 매뉴얼 목록 (filename과 uploaded_at만 표시) */}
          {!manualsLoading && uploadedManuals.length > 0 && (
            <div className="space-y-4">
              {uploadedManuals.map((manual, index) => (
                <div 
                  key={manual.manual_id || index} 
                  onClick={() => handleManualClick(manual.manual_id)}
                  className="bg-white border border-[#b5b5b5] rounded-[10px] overflow-hidden cursor-pointer hover:bg-gray-50 hover:border-[#0E467B] transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between px-8 py-8 min-h-[60px]">
                                          <div className="flex items-center gap-4">
                        <img src={equipment} alt="equipment" className="w-[28px] h-[28px]" />
                        <div className="flex flex-col py-1">
                          <span className="text-[#33308B] font-semibold text-[1.1rem] hover:text-[#0E467B] leading-relaxed">
                            {manual.filename || manual.title}
                          </span>
                          {/* <span className="text-xs text-gray-500 mt-1">
                            상태: {manual.status} | ID: {manual.manual_id}
                          </span> */}
                        </div>
                      </div>
                                          <div className="flex items-center gap-2 py-1">
                        <div className="text-[#33308B] text-[0.95rem] leading-relaxed">
                          {new Date(manual.uploaded_at).toLocaleString('ko-KR')}
                        </div>
                      {/* <div className="text-gray-400 text-sm">
                        👆 클릭하여 읽기
                      </div> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default ManualUpload; 