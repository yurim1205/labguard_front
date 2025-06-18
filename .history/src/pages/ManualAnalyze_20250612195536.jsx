import { useRef, useState } from 'react';
import { FaFlask } from 'react-icons/fa';
import Header from '../components/Header';
import equipment from '../assets/img/equipment.png';
import AnalyzeBtn from '../components/button/analyzeBtn'; // 버튼 컴포넌트 추가

function ManualAnalyze() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null); // ✅ 파일 상태 추가

  // 더미 매뉴얼 데이터
  const manuals = [
    { name: '고효율 촉매 및 전극 개발 실험 매뉴얼', date: '25/05/23 11:54:27' },
    { name: '수소/산소 발생 전극의 열화 대응 소재 발굴 실험 매뉴얼', date: '25/05/26 18:02:36' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
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
                <div className="font-[600] text-[#0E467B] text-lg">첨부할 파일 놓기</div>
                <div className="text-base text-[#798483]">또는</div>
                <label
                  htmlFor="file-upload"
                  className="rounded-[3px] shadow-[0_6px_12px_0_rgba(128,128,128,0.28)] inline-block bg-white text-[#0E467B] border border-[#0E467B] px-6 py-2 font-semibold text-base cursor-pointer transition-colors duration-200 hover:text-white"
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
                <div className="bg-[#cfe3ff] text-[#0E467B] px-6 py-2 rounded-full text-[15px] font-medium">
                  {selectedFile.name}
                </div>
                <AnalyzeBtn onClick={() => alert('분석 시작')} />
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

export default ManualAnalyze;