import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { useAuthStore } from '../../store/useAuthStore';

function RiskAnalyzeResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    // location.state에서 전달받은 데이터 확인
    if (location.state) {
      console.log('📊 위험 분석 결과 데이터:', location.state);
      setResultData(location.state);
    } else {
      console.warn('📊 위험 분석 결과 데이터가 없습니다.');
      // 데이터가 없으면 매뉴얼 페이지로 리다이렉트
      navigate('/manual');
    }
  }, [location.state, navigate]);

  // 목록으로 돌아가기
  const handleBackToManual = () => {
    navigate('/manual');
  };

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">위험도 분석 결과</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">매뉴얼 위험 요소 분석</h2>
        <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
          매뉴얼을 분석하여 위험 요소와 안전 수칙을 제공합니다.
        </p>

        <section className="bg-[#ecece7] min-h-[560px] rounded-lg p-10 mb-10 pt-[24px] px-[100px] relative">
          <section className="bg-[#EDF2FF] min-h-[450px] rounded-lg p-10 mb-10 pt-[24px]">
            {!resultData ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">결과를 불러오는 중...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* 위험 조언 섹션 */}
                {resultData.결과?.위험_조언 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                      ⚠️ 위험 조언
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-red-700">
                      {resultData.결과.위험_조언.map((item, index) => (
                        <li key={index} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 주의사항 섹션 */}
                {resultData.결과?.주의사항 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                      ⚡ 주의사항
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-yellow-700">
                      {resultData.결과.주의사항.map((item, index) => (
                        <li key={index} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 안전수칙 섹션 */}
                {resultData.결과?.안전수칙 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                      🛡️ 안전수칙
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-green-700">
                      {resultData.결과.안전수칙.map((item, index) => (
                        <li key={index} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 결과가 없을 때 */}
                {(!resultData.결과?.위험_조언 && !resultData.결과?.주의사항 && !resultData.결과?.안전수칙) && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-600">분석 결과가 없습니다.</p>
                    <pre className="mt-4 text-left text-sm bg-white p-4 rounded border overflow-auto">
                      {JSON.stringify(resultData, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="absolute bottom-5 right-[100px]">
            <button
              onClick={handleBackToManual}
              className="px-[24px] py-[7px] mt-[10px] border border-gray-300 rounded-[10px] bg-white text-gray-600
               font-[700] text-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] hover:bg-gray-100 hover:border-gray-400
                transition duration-200 cursor-pointer"
            >
              매뉴얼 목록으로 돌아가기
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default RiskAnalyzeResult;