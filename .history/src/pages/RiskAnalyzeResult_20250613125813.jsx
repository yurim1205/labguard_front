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
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">매뉴얼</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">매뉴얼 요약 및 분석 확인</h2>

        <section className="bg-[#ecece7] h-[560px] rounded-lg p-10 mb-10 pt-[24px] px-[100px] relative">
          <section className="bg-[#EDF2FF] h-[450px] rounded-lg p-10 mb-10 pt-[24px]">
          </section>

          <div className="absolute bottom-5 right-[100px]">
          <div className='flex gap-[10px]'> 
            <ManualAllTextBtn />
           <ManualCancleBtn />
            </div> 
          </div>
        </section>
      </div>
    </>
  );
}

export default RiskAnalyzeResult;