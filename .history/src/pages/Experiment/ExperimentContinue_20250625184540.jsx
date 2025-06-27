import { useRef, useState } from 'react';
import Header from '../../components/Header';

function ExperimentContinue() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('ongoing'); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 더미 매뉴얼 데이터
  const manuals = [
    {
      name: '알칼리수 전기분해 셀 설계',
      date: '25/05/23',
      completed: false,
    },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const filteredManuals = manuals.filter((m) =>
    activeTab === 'ongoing' ? !m.completed : m.completed
  );

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        {/* 주요 콘텐츠 */}
        <h1 className="text-[2.3rem] font-black mb-[60px] text-left tracking-tight">실험</h1>
        <h2 className="text-[20px] font-bold text-left font-[600] mb-0">실험 이어하기</h2>

        <section className="mt-[18px]">
          {/* 실험 리스트 */}
          <ul className="bg-white border border-[#b5b5b5] rounded-[10px] py-4 list-none mt-[1px]">
            {filteredManuals.map((m, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-8 py-4 text-[1.05rem] border-b last:border-b-0"
              >
                <div className="flex gap-8 items-center">
                  <span className="text-[#7B87B8] text-[0.95rem] px-[10px] py-[10px]">{m.date}</span>
                  <span className="text-[#33308B] font-semibold">{m.name}</span>
                </div>

                <span className="text-[#1C1C59] text-[0.95rem] underline cursor-pointer hover:text-[#33308B] mr-[10px]">
                  {m.completed ? '레포트 보기 >' : '실험 이어하기 >'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default ExperimentContinue;