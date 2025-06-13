import { useRef, useState } from 'react';
import Header from '../components/Header';
import ManualAllTextBtn from '../components/button/manualAllTextBtn';
import ManualCancleBtn from '../components/button/manualCancleBtn';

function RiskAnalyzeResult() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">위험도 분석 결과</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">리포트 생성</h2>
        <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
          실험 중 남긴 로그를 바탕으로 리포트가 자동으로 생성됩니다.
        </p>

        <section className="bg-[#ecece7] h-[560px] rounded-lg p-10 mb-10 pt-[24px] px-[100px] relative">
          <section className="bg-[#EDF2FF] h-[450px] rounded-lg p-10 mb-10 pt-[24px]">
          </section>
        </section>
      </div>
    </>
  );
}

export default RiskAnalyzeResult;