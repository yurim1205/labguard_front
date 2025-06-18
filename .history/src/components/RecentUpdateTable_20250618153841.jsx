// RecentUpdateTable.jsx: 최근 업데이트 표 컴포넌트

function RecentUpdateTable({ updates }) {
  return (
    <>
      <h4 className="mb-3 text-[1.1rem] text-[#222]">최근 업데이트</h4>
      <section className="mt-10 border border-[#222] rounded-2xl bg-white shadow-md p-6 pt-[10px] mt-[10px]">
        <table className="w-full border-collapse bg-white">
          <tbody>
            {updates.map((item, idx) => (
              <tr key={idx}>
                <td className="px-2 py-3 border-b border-gray-200 text-[0.98rem]">
                  <span className="inline-block bg-[#e3f0ff] text-blue-600 text-xs font-semibold rounded-lg px-3 py-1 mr-2">{item.type}</span>
                </td>
                <td className="px-2 py-3 border-b border-gray-200 text-[0.98rem]">{item.date}</td>
                <td className="px-2 py-3 border-b border-gray-200 text-[0.98rem]">{item.title}</td>
                <td className="px-2 py-3 border-b border-gray-200 text-[0.98rem]">
                  <a href={item.link} className="text-[#218c5a] underline hover:text-[#176b43]">상세 보기</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default RecentUpdateTable; 