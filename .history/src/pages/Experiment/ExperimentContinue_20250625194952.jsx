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
    const checkAuthAndFetch = async () => {
      let currentUserId = userId;
      
      // 사용자 ID가 없으면 인증 상태 확인
      if (!currentUserId) {
        console.log('사용자 ID가 없음 - 인증 상태 확인 중...');
        try {
          const response = await fetch('/api/user/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            console.log('현재 인증된 사용자:', userData);
            
            // 전역 상태 업데이트
            useAuthStore.getState().login({
              id: userData.id || userData.user_id,
              name: userData.name,
              email: userData.email,
              company_id: userData.company_id,
            });
            
            currentUserId = userData.id || userData.user_id;
          } else if (response.status === 401) {
            console.log('인증되지 않은 사용자 - 로그인 페이지로 이동');
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
          }
        } catch (error) {
          console.error('인증 상태 확인 실패:', error);
        }
      }
      
      if (!currentUserId) {
        console.error('사용자 ID를 찾을 수 없습니다.');
        setLoading(false);
        return;
      }
      
      // 실험 목록 조회
      try {
        setLoading(true);
        console.log('사용자 실험 목록 조회 시작, User ID:', currentUserId);
        
        const res = await fetch(`/api/experiment/user/${currentUserId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });        

        if (res.ok) {
          const data = await res.json();
          console.log('사용자 실험 목록:', data);
          // 백엔드에서 ExperimentOut 배열을 반환한다면 직접 사용
          setExperiments(Array.isArray(data) ? data : [data]);
        } else if (res.status === 401) {
          console.error('인증 실패 - 로그인 페이지로 이동');
          alert('로그인이 필요합니다.');
          navigate('/login');
        } else {
          console.error('실험 목록 불러오기 실패:', res.status);
          setExperiments([]);
        }
      } catch (err) {
        console.error('실험 목록 조회 에러:', err);
        setExperiments([]);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [navigate]);

  // 실험 이어하기 핸들러
  const handleContinueExperiment = (experiment) => {
    navigate(`/ExperimentChat/session/${experiment.session_id}`, {
      state: {
        experiment_id: experiment.experiment_id,
        experiment_title: experiment.title,
        manual: experiment.manual_id,
        session_id: experiment.session_id,
      },
    });
  };

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[60px] text-left tracking-tight">실험</h1>
        <h2 className="text-[20px] font-bold text-left font-[600] mb-0">실험 이어하기</h2>

        <section className="mt-[18px]">
          {loading ? (
            <div className="bg-white border border-[#b5b5b5] rounded-[10px] py-8 text-center">
              <p className="text-[#7B87B8]">실험 목록을 불러오는 중...</p>
            </div>
          ) : experiments.length === 0 ? (
            <div className="bg-white border border-[#b5b5b5] rounded-[10px] py-8 text-center">
              <p className="text-[#7B87B8] mb-2">진행 중인 실험이 없습니다.</p>
              <p className="text-[#7B87B8] text-sm">새 실험을 생성해보세요!</p>
            </div>
          ) : (
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

                  <span 
                    onClick={() => handleContinueExperiment(exp)}
                    className="text-[#1C1C59] text-[0.95rem] underline cursor-pointer hover:text-[#33308B] mr-[10px]"
                  >
                    실험 이어하기 &gt;
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}


export default ExperimentContinue;
