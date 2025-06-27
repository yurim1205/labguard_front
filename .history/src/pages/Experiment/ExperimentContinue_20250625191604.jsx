import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Cookies from 'js-cookie';
import { useAuthStore } from '../../store/useAuthStore';

function ExperimentContinue() {
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [activeTab, setActiveTab] = useState('ongoing');
  const [loading, setLoading] = useState(true);
  
  // 쿠키 또는 전역 상태에서 사용자 ID 가져오기
  const currentUser = useAuthStore((state) => state.user);
  const userId = currentUser?.id || currentUser?.user_id || Cookies.get('user_id');

  useEffect(() => {
    const fetchUserExperiments = async () => {
      if (!userId) {
        console.error('사용자 ID를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('사용자 실험 목록 조회 시작, User ID:', userId);
        
                 // 사용자의 모든 실험 목록을 가져오는 API 호출
         const res = await fetch(`/api/experiments/user/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log('사용자 실험 목록:', data);
          setExperiments(data.experiments || data || []);
        } else if (res.status === 401) {
          console.error('인증 실패 - 로그인 페이지로 이동');
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else {
          console.error('실험 목록 불러오기 실패:', res.status);
          // 실패 시 빈 배열로 설정
          setExperiments([]);
        }
      } catch (err) {
        console.error('실험 목록 조회 에러:', err);
        setExperiments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserExperiments();
  }, [userId, navigate]);

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
