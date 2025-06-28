// ===== 기존 코드 (주석 처리) =====
/*
import React from 'react';
import { motion } from 'framer-motion';

const ReportTypeModal = ({ isOpen, onClose, onSelectType }) => {
  if (!isOpen) return null;

  const handleSelectType = (type) => {
    onSelectType(type);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            리포트 유형 선택
          </h2>
          <p className="text-gray-600 text-sm">
            원하는 방식의 리포트 유형을 선택해주세요
          </p>
        </div>

        {/* 선택 옵션 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* 개인 리포트 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectType('personal')}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-lg p-6 text-center hover:border-blue-400 hover:shadow-lg transition-all duration-200"
          >
            <div className="text-4xl mb-3">👤</div>
            <h3 className="font-semibold text-gray-800 mb-2">개인</h3>
            <p className="text-xs text-gray-600">
              개인 실험 결과 리포트
            </p>
          </motion.button>

          {/* 비즈니스 리포트 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectType('business')}
            className="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-lg p-6 text-center hover:border-green-400 hover:shadow-lg transition-all duration-200"
          >
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="font-semibold text-gray-800 mb-2">비즈니스</h3>
            <p className="text-xs text-gray-600">
              비즈니스 분석 리포트
            </p>
          </motion.button>
        </div>

        {/* 실험 종료 버튼 */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            실험 종료
          </motion.button>
        </div>
      </motion.div>
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