import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

// 더미 리포트 목록 데이터 - 실제 API로 교체 예정
const dummyReportList = [
  {
    id: 2,
    title: '알칼리수 전기분해 셀 설계',
    created_at: '25/06/05 13:12',
    isDummy: true,
  },
  {
    id: 1,
    title: 'CO+H2+CO2 가스 혼합물과의 철 산화물의 반응성 조사',
    created_at: '25/05/17 13:43',
    isDummy: true,
  },
];

function ReportMain() {
  const fileInputRef = useRef();
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // localStorage에서 내 리포트 불러오기
    const myReports = JSON.parse(localStorage.getItem('myReports') || '[]');
    console.log('내 리포트:', myReports);
    // 더미 리포트가 먼저, 내 리포트가 뒤에 오도록 순서 변경
    setReports([...dummyReportList, ...myReports]);
  }, []);

  // 리포트 제목 클릭 시 상세 페이지로 이동하는 함수
  const handleReportClick = (report) => {
    if (report.isDummy) {
      navigate(`/ReportRead/${report.id}`);
    } else {
      // 내 리포트는 state로 데이터 전달
      navigate('/report/read', { state: { experimentData: report.experiment_data, reportType: report.report_type } });
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">리포트</h1>
        <h2 className="text-[20px] font-bold text-left font-[600] mb-0">내 리포트</h2>
        <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
          실험 종료 후 자동 생성된 리포트를 확인할 수 있습니다. <br />
          PDF 파일 형식으로 저장할 수 있습니다.
        </p>

        {/* 리포트 목록 테이블 */}
        <section className="mt-[48px]">
          <h2 className="text-[16px] font-bold mb-3 text-left">
            총 {reports.length}개
          </h2>
          {reports.length === 0 ? (
            <div className="text-center text-gray-500 py-12">아직 생성된 리포트가 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse border border-gray-200">
                {/* 테이블 헤더 */}
                <thead className="bg-[#EDF0FA] text-left text-[#1C1C59]">
                  <tr>
                    <th className="px-6 py-3 text-sm font-bold border-b border-gray-200 mr-[50px]">No</th>
                    <th className="px-6 py-3 text-sm font-bold border-b border-gray-200">제목</th>
                    <th className="px-6 py-3 text-sm font-bold border-b border-gray-200">생성일시</th>
                    <th className="px-6 py-3 text-sm font-bold border-b border-gray-200">구분</th>
                  </tr>
                </thead>
                {/* 테이블 본문 - 리포트 목록 출력 */}
                <tbody className="text-[#1C1C59]">
                  {reports.map((report, idx) => (
                    <tr key={report.id + (report.isDummy ? '-dummy' : '')} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-3 border-b border-gray-200">{idx + 1}</td>
                      <td
                        className="px-6 py-3 border-b border-gray-200 underline text-blue-800 cursor-pointer hover:text-blue-600"
                        onClick={() => handleReportClick(report)} // 제목 클릭 시 상세 페이지로 이동
                      >
                        {report.title}
                      </td>
                      <td className="px-6 py-3 border-b border-gray-200 text-[#19234E]">{report.created_at}</td>
                      <td className="px-6 py-3 border-b border-gray-200">
                        {report.isDummy ? <span className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs">더미</span> : <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">내 리포트</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default ReportMain; 