import { useRef, useState } from 'react';
import Header from '../../components/Header';

function ReportMain() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [reports, setReports] = useState(reportList);


  const reportList = [
    {
      id: 2,
      title: '알칼리수 전기분해 셀 설계',
      created_at: '25/06/05 13:12',
    },
    {
      id: 1,
      title: 'CO+H2+CO2 가스 혼합물과의 철 산화물의 반응성 조사',
      created_at: '25/05/17 13:43',
    },
  ];
  

  // 더미 매뉴얼 데이터
  const manuals = [
    {
      name: '고효율 촉매 및 전극 개발 실험 매뉴얼',
      date: '25/05/23 11:54:27',
      completed: false,
    },
    {
      name: '수소/산소 발생 전극의 열화 대응 소재 발굴 실험 매뉴얼',
      date: '25/05/26 18:02:36',
      completed: true,
    },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">리포트</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">내 리포트</h2>
        <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
        실험 종료 후 자동 생성된 리포트를 확인할 수 있습니다. <br />
        PDF 파일 형식으로 저장할 수 있습니다.
        </p>

        {/* 내 실험 */}
        <section className="mt-[48px]">
          <h2 className="text-[20px] font-bold mb-3 text-left font-[500]">내 실험</h2>
        
        </section>
      </div>
    </>
  );
}

export default ReportMain; 