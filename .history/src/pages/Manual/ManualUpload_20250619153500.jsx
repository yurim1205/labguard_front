import { useRef, useState } from 'react';
import Header from '../../components/Header';
import equipment from '../../assets/img/equipment.png';
import AnalyzeBtn from '../../components/button/analyzeBtn'; 
import ManualAnalyzeLoading from '../../components/ManualAnalyzeLoading';

function ManualUpload() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  // 더미 매뉴얼 데이터
  const manuals = [
    { manual_id: 1, name: '고효율 촉매 및 전극 개발 실험 매뉴얼', date: '25/05/23 11:54:27' },
    { manual_id: 2, name: '수소/산소 발생 전극의 열화 대응 소재 발굴 실험 매뉴얼', date: '25/05/26 18:02:36' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleAnalyze = () => {
    setIsLoading(true);
    // 분석 API 호출 등 비동기 작업
    // 예시: setTimeout(() => setIsLoading(false), 3000);
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
          <section className="bg-[#ecece7] h-[560px] rounded-lg p-10 mb-10 pt-[24px] flex items-center justify-center">
          {isLoading ? (
            <ManualAnalyzeLoading />
          ) : (
            <AnalyzeBtn onClick={handleAnalyze} />
          )}
        </section>
            <div className="text-[#888] text-[14px] mb-[44px] text-left mt-[12px]">
              · 파일 업로드는 PDF 형식만 가능하며, 용량은 30MB 이하로 제한됩니다.
            </div>
          </div>
        </section>

        {/* 내 매뉴얼 */}
        <section className="mt-[48px]">
          <h2 className="text-[20px] font-bold mb-3 text-left font-[500]">내 매뉴얼</h2>

          <ul className="bg-white border border-[#b5b5b5] rounded-[10px] py-4 list-none m-0 mt-[1px]">
            {manuals.map((m, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-8 py-5 text-[1.05rem]"
              >
                <div className="flex items-center gap-4">
                  <img src={equipment} alt="equipment" className="w-[28px] h-[28px]" />
                  <span className="ml-[12px] text-[#33308B] font-semibold underline">{m.name}</span>
                </div>
                <span className="mr-[12px] mt-[12px] mb-[12px] text-[#33308B] text-[0.95rem]">{m.date}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default ManualUpload;