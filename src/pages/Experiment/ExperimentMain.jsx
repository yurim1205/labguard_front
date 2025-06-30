import { useEffect, useRef, useState } from 'react';
import Header from '../../components/Header';
import NewExperimentModal from '../../components/modal/NewExperimentModal';
import NewExperiment from '../../components/NewExperimentCard';
import ExperimentContinueCard from '../../components/ExperimentContinueCard';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuthStore } from '../../store/useAuthStore';
import leftArrow from '../../assets/img/leftArrow.png';
import rightArrow from '../../assets/img/rightArrow.png';

function ExperimentMain() {
  const fileInputRef = useRef();
  const [activeTab, setActiveTab] = useState('ongoing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [experiments, setExperiments] = useState([]);
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // 사용자 ID
  const currentUser = useAuthStore((state) => state.user);
  const userId = currentUser?.id || currentUser?.user_id || Cookies.get('user_id');

  useEffect(() => {
    const fetchExperiments = async () => {
      let currentUserId = userId;

      if (!currentUserId) {
        try {
          const res = await fetch('/api/user/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (res.ok) {
            const userData = await res.json();
            useAuthStore.getState().login({
              id: userData.id || userData.user_id,
              name: userData.name,
              email: userData.email,
              company_id: userData.company_id,
            });
            currentUserId = userData.id || userData.user_id;
          } else {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
          }
        } catch (err) {
          console.error('인증 확인 실패:', err);
          navigate('/login');
          return;
        }
      }

      if (!currentUserId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch(`/api/experiment/user/${currentUserId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          const data = await res.json();
          setExperiments(Array.isArray(data) ? data : [data]);
        } else {
          console.error('실험 목록 불러오기 실패:', res.status);
          setExperiments([]);
        }
      } catch (err) {
        console.error('불러오기 에러:', err);
        setExperiments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiments();
  }, [navigate]);

  // 진행중/종료 필터 및 최신순 정렬
  const filteredExperiments = experiments
    .filter((exp) => activeTab === 'ongoing' ? !exp.completed : exp.completed)
    .sort((a, b) => new Date(b.experiment_date) - new Date(a.experiment_date));

  // 페이지네이션 적용
  const paginatedExperiments = filteredExperiments.slice(startIndex, endIndex);

  // 실험 이어하기 클릭
  const handleContinue = (exp) => {
    navigate(`/ExperimentChat/experiment/${exp.experiment_id}`, {
      state: {
        experiment_id: exp.experiment_id,
        experiment_title: exp.title,
        manual: exp.manual_id,
      },
    });
  };

  return (
    <>
      <Header />
      {isModalOpen && (
        <NewExperimentModal
          onClose={() => setIsModalOpen(false)}
          onTitleSubmit={({ experiment_name, manual }) =>
            navigate('/ExperimentChat', { state: { experiment_name, manual } })
          }
        />
      )}
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">실험</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">실험 진행</h2>
        <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
          새 실험을 생성하거나 이전 실험을 이어 진행할 수 있습니다.
        </p>

        <section className="h-[380px] rounded-lg p-10 mb-10 pt-[24px]">
          <div className="flex justify-center gap-[96px] pt-[10px]">
            <div className="w-[360px]">
              <NewExperiment onClick={() => setIsModalOpen(true)} />
            </div>
            <div className="w-[360px]">
              <ExperimentContinueCard />
            </div>
          </div>
        </section>

        <section className="mt-[14px]">
            <h2 className="text-[20px] font-bold mb-3 text-left font-[500]">내 실험</h2>

            <div className="flex mb-0">
              <button
                onClick={() => setActiveTab('ongoing')}
                className={`px-8 py-3 rounded-t-[10px] text-[16px] font-bold mr-1
                  ${activeTab === 'ongoing'
                    ? 'bg-[#33308B] text-[#FFFFFF]'
                    : 'bg-[#E6EEFF] text-[#1C1C59] border border-[#b5b5b5] border-b-0'}
                `}
              >
                실험중
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-8 py-3 rounded-t-[10px] text-[16px] font-bold
                  ${activeTab === 'completed'
                    ? 'bg-[#33308B] text-[#FFFFFF]'
                    : 'bg-[#E6EEFF] text-[#1C1C59] border border-[#b5b5b5] border-b-0'}
                `}
              >
                실험종료
              </button>
            </div>

            {isLoading ? (
              <div className="bg-white border border-[#b5b5b5] rounded-[10px] py-8 text-center mt-2">
                <p className="text-[#7B87B8]">실험 목록을 불러오는 중...</p>
              </div>
            ) : filteredExperiments.length === 0 ? (
              <div className="bg-white border border-[#b5b5b5] rounded-[10px] py-8 text-center mt-2">
                <p className="text-[#7B87B8] mb-2">표시할 실험이 없습니다.</p>
              </div>
            ) : (
              <>
                <ul className="bg-white border border-[#b5b5b5] rounded-[10px] py-4 list-none mt-[-1px]">
                  {paginatedExperiments.map((exp) => (
                    <li
                      key={exp.experiment_id}
                      className="flex items-center justify-between px-8 py-4 text-[1.05rem] border-b last:border-b-0"
                    >
                      <div className="flex gap-8 items-center">
                        <span className="text-[#ABBFBD] text-[0.95rem] px-[10px] py-[10px]">
                          {new Date(exp.experiment_date).toLocaleDateString()}
                        </span>
                        <span className="text-[#33308B] font-semibold">{exp.title}</span>
                      </div>
                      <span
                        onClick={() => handleContinue(exp)}
                        className="text-[#1C1C59] text-[0.95rem] underline cursor-pointer hover:text-[#33308B] mr-[10px]"
                      >
                        {exp.completed ? '레포트 보기 >' : '실험 이어하기 >'}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-center mt-4 gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-[30px] h-[30px] flex items-center justify-center 
                              rounded-[6px] disabled:opacity-50 bg-[#CBD6EA]
                              border-0 hover:bg-[#f0f0f0] transition focus:outline-none mr-[12px]"
                  >
                    <img src={leftArrow} alt="이전" className="w-[16px] h-[16px]" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        endIndex < filteredExperiments.length ? p + 1 : p
                      )
                    }
                    disabled={endIndex >= filteredExperiments.length}
                    className="w-[30px] h-[30px] flex items-center justify-center 
                              rounded-[6px] disabled:opacity-50 bg-[#CBD6EA]
                              border-0 hover:bg-[#f0f0f0] transition focus:outline-none"
                  >
                    <img src={rightArrow} alt="다음" className="w-[16px] h-[16px]" />
                  </button>
                </div>
              </>
            )}
          </section>
      </div>
    </>
  );
}

export default ExperimentMain;