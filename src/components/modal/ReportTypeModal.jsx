// ===== 기존 코드 (주석 처리) =====
/*
import React from 'react';

const ReportTypeModal = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[320px] shadow-lg">
        <h2 className="text-lg font-bold mb-4">리포트 타입을 선택하세요</h2>
        <div className="flex flex-col space-y-3">
          <button 
            className="bg-[#565991] text-white py-2 rounded hover:bg-[#434677]" 
            onClick={() => onSelect('개인용')}
          >
            개인용 리포트
          </button>
          <button 
            className="bg-[#4071c7] text-white py-2 rounded hover:bg-[#3059a1]" 
            onClick={() => onSelect('보고용')}
          >
            기업 보고용 리포트
          </button>
          <button 
            className="text-sm text-gray-500 underline mt-2" 
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportTypeModal;
*/

// ===== 새 코드 (이미지 스타일) =====
import React, { useState } from 'react';

const icons = {
  개인: (
    <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="22" r="12" stroke="#222" strokeWidth="2.5" fill="white"/>
      <path d="M15 55c0-8.284 9-15 20-15s20 6.716 20 15" stroke="#222" strokeWidth="2.5" fill="white"/>
      <rect x="32" y="35" width="6" height="15" rx="2" fill="#3B5CB8"/>
    </svg>
  ),
  비지니스: (
    <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="50" r="7" stroke="#222" strokeWidth="2.5" fill="white"/>
      <circle cx="50" cy="50" r="7" stroke="#222" strokeWidth="2.5" fill="white"/>
      <circle cx="35" cy="25" r="7" stroke="#222" strokeWidth="2.5" fill="white"/>
      <path d="M35 32v6m0 0l-8 8m8-8l8 8" stroke="#3B5CB8" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
};

const cardList = [
  { key: '개인', label: '개인' },
  { key: '비지니스', label: '비지니스' }
];

const ReportTypeModal = ({ isOpen, onClose, onSelect }) => {
  const [selected, setSelected] = useState(null);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-10 w-[500px] flex flex-col items-center">
        <div className="mb-10">
          <div className="text-[1.3rem] text-[#565991] font-semibold text-center">원하는 방식의 리포트 유형을 선택해주세요.</div>
        </div>
        <div className="flex gap-10 mb-10">
          {cardList.map(card => (
            <button
              key={card.key}
              type="button"
              onClick={() => { setSelected(card.key); onSelect && onSelect(card.key); }}
              className={`flex flex-col items-center justify-center w-[200px] h-[200px] rounded-2xl border-2 transition-all duration-150 shadow-sm bg-white
                ${selected === card.key ? 'border-blue-400 shadow-blue-100' : 'border-gray-200 hover:border-blue-200'}`}
              style={{ outline: 'none' }}
            >
              {icons[card.key]}
              <span className="mt-6 text-xl text-black font-medium">{card.label}</span>
            </button>
          ))}
        </div>
        <button
          className="mt-2 px-10 py-2 rounded-md bg-[#565991] text-white text-base font-semibold shadow hover:bg-[#434677] transition"
          onClick={onClose}
        >
          실험 종료
        </button>
      </div>
    </div>
  );
};

export default ReportTypeModal;