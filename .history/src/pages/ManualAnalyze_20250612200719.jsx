import { useRef, useState } from 'react';
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
        <section className="bg-[#ecece7] h-[560px] rounded-lg p-10 mb-10 pt-[24px]">
          <div className="max-w-[520px] mx-auto">

            <div className="text-[#33308B] text-[26px] text-center mt-[200px] font-[500]">
              분석 중
            </div>
            <div className="text-[#33308B] text-[26px] mb-[44px] text-center  font-[400]">
              분석 중
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ManualAnalyze;