import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import ReportCancleBtn from '../../components/button/reportCancleBtn';

// 더미 리포트 데이터 - 실제 API로 교체 예정
const reportData = {
  1: {
    id: 1,
    title: 'CO+H2+CO2 가스 혼합물과의 철 산화물의 반응성 조사',
    created_at: '25/05/17 13:43',
    content: `
      실험 목적: CO, H2, CO2 가스 혼합물이 철 산화물에 미치는 반응성을 조사하여 
      환원 반응의 효율성을 분석한다.
      
      실험 결과:
      - 온도 800°C에서 최적의 반응성을 보임
      - CO 농도가 높을수록 환원 속도 증가
      - 안전 주의사항: 고온 작업 시 방호복 착용 필수
    `,
    safety_notes: [
      '고온 작업 시 방호복 착용 필수',
      '가스 누출 감지기 상시 작동',
      '환기 시설 정상 작동 확인'
    ]
  },
  2: {
    id: 2,
    title: '알칼리수 전기분해 셀 설계',
    created_at: '25/06/05 13:12',
    content: `
      실험 목적: 고효율 알칼리수 전기분해 셀을 설계하여 수소 생산 효율을 극대화한다.
      
      실험 결과:
      - 전류밀도 500 mA/cm²에서 최적 효율 달성
      - 전해질 농도 30% KOH 사용
      - 수소 순도 99.8% 달성
    `,
    safety_notes: [
      '강알칼리 용액 취급 시 보안경 착용',
      '전기 작업 시 절연장갑 착용',
      '수소 가스 누출 방지 철저'
    ]
  }
};

function ReportRead() {
  const { reportId } = useParams(); // URL에서 리포트 ID 추출
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const [showModal, setShowModal] = useState(false);
  const [currentReport, setCurrentReport] = useState(null); // 현재 리포트 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 컴포넌트 마운트 시 리포트 데이터 로드
  useEffect(() => {
    const loadReportData = () => {
      setLoading(true);
      
      // 실제 API 호출로 교체 예정
      // const response = await fetch(`/api/reports/${reportId}`);
      // const data = await response.json();
      
      // 더미 데이터에서 해당 리포트 찾기
      const report = reportData[reportId];
      
      if (report) {
        setCurrentReport(report);
      } else {
        // 리포트를 찾을 수 없는 경우 리포트 목록으로 이동
        alert('리포트를 찾을 수 없습니다.');
        navigate('/ReportMain');
        return;
      }
      
      setLoading(false);
    };

    if (reportId) {
      loadReportData();
    }
  }, [reportId, navigate]);

  // 리포트 삭제 처리 함수
  const handleDeleteReport = () => {
    if (window.confirm('정말로 이 리포트를 삭제하시겠습니까?')) {
      // 실제 API 호출로 교체 예정
      // await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
      
      alert('리포트가 삭제되었습니다.');
      navigate('/ReportMain'); // 리포트 목록으로 이동
    }
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-[1200px] mx-auto pt-10 pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">리포트를 불러오는 중...</div>
          </div>
        </div>
      </>
    );
  }

  // 리포트 데이터가 없을 때 처리
  if (!currentReport) {
    return (
      <>
        <Header />
        <div className="max-w-[1200px] mx-auto pt-10 pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">리포트를 찾을 수 없습니다.</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        {/* 리포트 제목 및 정보 */}
        <div className="mb-6">
          <h1 className="text-[2.3rem] font-black mb-2 text-left tracking-tight">리포트</h1>
          <h2 className="text-[1.5rem] font-bold text-[#33308B] mb-2">{currentReport.title}</h2>
          <p className="text-[#7B87B8] text-base">생성일시: {currentReport.created_at}</p>
        </div>

        {/* 리포트 내용 표시 영역 */}
        <section className="bg-[#ecece7] min-h-[560px] rounded-lg p-10 mb-6 relative">
          <div className="bg-[#EDF2FF] min-h-[450px] rounded-lg p-8">
            {/* 리포트 본문 내용 */}
            <div className="mb-8">
              <h3 className="text-[1.2rem] font-bold text-[#1C1C59] mb-4">실험 리포트</h3>
              <div className="text-[#333] whitespace-pre-line leading-relaxed text-base">
                {currentReport.content}
              </div>
            </div>

            {/* 안전 주의사항 */}
            {currentReport.safety_notes && currentReport.safety_notes.length > 0 && (
              <div className="mt-8 p-6 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
                <h4 className="text-[1.1rem] font-bold text-[#856404] mb-3">⚠️ 안전 주의사항</h4>
                <ul className="list-disc list-inside space-y-2">
                  {currentReport.safety_notes.map((note, index) => (
                    <li key={index} className="text-[#856404] text-base">{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate('/ReportMain')}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            목록으로
          </button>
          <ReportCancleBtn onClick={handleDeleteReport} />
        </div>
      </div>
    </>
  );
}

export default ReportRead;