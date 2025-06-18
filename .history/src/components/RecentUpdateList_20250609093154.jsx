// RecentUpdateList.jsx: 최근 업데이트 항목 리스트 컴포넌트

function RecentUpdateList({ updates = [] }) {
  return (
    <ul className="list-none p-0 m-0">
      {updates.length === 0 ? (
        <li className="py-2 border-b border-gray-200">업데이트 내역이 없습니다.</li>
      ) : (
        updates.map((item, idx) => <li className="py-2 border-b border-gray-200" key={idx}>{item}</li>)
      )}
    </ul>
  );
}

export default RecentUpdateList; 