import { useRef, useState } from 'react';
import Header from '../components/Header';

import NewExperiment from '../components/NewExperiment';
import ExperimentContinue from '../components/ExperimentContinue';

function ExperimentMain() {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('ongoing'); 

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

  const filteredManuals = manuals.filter((m) =>
    activeTab === 'ongoing' ? !m.completed : m.completed
  );

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">실험</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">실험 진행</h2>
        <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
          새 실험을 생성하거나 이전 실험을 이어 진행할 수 있습니다. <br />
          등록된 매뉴얼에 따라 AI가 실험 중 주의사항을 안내해주고 음성 Q&A도 지원합니다.
        </p>

        <section className="h-[380px] rounded-lg p-10 mb-10 pt-[24px]">
            <div className="flex justify-center gap-[56px] pt-[10px]">
                <div className="w-[360px]">
                    <NewExperiment />
                </div>
                <div className="w-[360px]">
                    <ExperimentContinue />
                </div>
            </div>
        </section>

        {/* 내 실험 */}
        <section className="mt-[48px]">
          <h2 className="text-[20px] font-bold mb-3 text-left font-[500]">내 실험</h2>

          {/* 탭 */}
          <div className="flex mb-0">
            <button
                onClick={() => setActiveTab('ongoing')}
                className={`px-8 py-3 rounded-t-lg text-[16px] font-bold mr-1
                ${
                    activeTab === 'ongoing'
                    ? 'bg-[#33308B] text-[#FFFFFF]'
                    : 'bg-[#E6EEFF] text-[#1C1C59] border border-[#b5b5b5] border-b-0'
                }`}
            >
                실험중
            </button>
            <button
                onClick={() => setActiveTab('completed')}
                className={`px-8 py-3 rounded-t-lg text-[16px] font-bold
                ${
                    activeTab === 'completed'
                    ? 'bg-[#33308B] text-[#FFFFFF]'
                    : 'bg-[#E6EEFF] text-[#1C1C59] border border-[#b5b5b5] border-b-0'
                }`}
            >
                실험종료
            </button>
        </div>

          {/* 실험 리스트 */}
          <ul className="bg-white border border-[#b5b5b5] rounded-[10px] py-4 list-none mt-[1px]">
            {filteredManuals.map((m, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-8 py-4 text-[1.05rem] border-b last:border-b-0"
              >
                <div className="flex gap-8 items-center">
                  <span className="text-[#ABBFBD] text-[0.95rem] px-[10px] py-[10px]">{m.date}</span>
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

export default ExperimentMain;