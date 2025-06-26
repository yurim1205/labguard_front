import { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import Cookies from 'js-cookie';

function ExperimentContinue() {
  const fileInputRef = useRef();
  const [experiments, setExperiments] = useState([]);
  const [activeTab, setActiveTab] = useState('ongoing');

  // ❗ TODO: 쿠키나 전역 상태에서 experiment_id 가져오기
  const experimentId = 12; // 예시 ID. 쿠키에서 가져올 수도 있음.

  useEffect(() => {
    const fetchExperiment = async () => {
      try {
        const res = await fetch(`/api/experiment/${experimentId}`, {
          credentials: 'include', // 쿠키 기반 인증 사용하는 경우
        });
        if (!res.ok) throw new Error('실험 정보 불러오기 실패');
        const data = await res.json();
        setExperiments([data]); // 단일 객체 → 배열로 저장 (map 사용 위함)
      } catch (err) {
        console.error('에러:', err);
      }
    };

    fetchExperiment();
  }, [experimentId]);

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[60px] text-left tracking-tight">실험</h1>
        <h2 className="text-[20px] font-bold text-left font-[600] mb-0">실험 이어하기</h2>

        <section className="mt-[18px]">
          <ul className="bg-white border border-[#b5b5b5] rounded-[10px] py-4 list-none mt-[1px]">
            {experiments.map((exp) => (
              <li
                key={exp.experiment_id}
                className="flex items-center justify-between px-8 py-4 text-[1.05rem] border-b last:border-b-0"
              >
                <div className="flex gap-8 items-center">
                  <span className="text-[#7B87B8] text-[0.95rem] px-[10px] py-[10px]">
                    {new Date(exp.experiment_date).toLocaleDateString()}
                  </span>
                  <span className="text-[#33308B] font-semibold">{exp.title}</span>
                </div>

                <span className="text-[#1C1C59] text-[0.95rem] underline cursor-pointer hover:text-[#33308B] mr-[10px]">
                  실험 이어하기 &gt;
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
