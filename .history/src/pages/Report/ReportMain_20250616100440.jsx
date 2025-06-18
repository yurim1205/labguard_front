import { useRef, useState } from 'react';
import Header from '../../components/Header';

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

function ReportMain() {
  const fileInputRef = useRef();
  const [reports, setReports] = useState(reportList);

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

        {/* 내 실험 */}
        <section className="mt-[48px]">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-[#EDF0FA] text-left text-[#1C1C59]">
                <tr>
                  <th className="px-6 py-3 text-sm font-bold border-b border-gray-200">No</th>
                  <th className="px-6 py-3 text-sm font-bold border-b border-gray-200">제목</th>
                  <th className="px-6 py-3 text-sm font-bold border-b border-gray-200">생성일시</th>
                </tr>
              </thead>
              <tbody className="text-[#1C1C59]">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-3 border-b border-gray-200">{report.id}</td>
                    <td className="px-6 py-3 border-b border-gray-200 underline text-blue-800">
                      {report.title}
                    </td>
                    <td className="px-6 py-3 border-b border-gray-200">{report.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

export default ReportMain; 