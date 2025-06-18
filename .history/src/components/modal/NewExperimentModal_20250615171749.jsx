import React from 'react';

const NewExperimentModal = ({ onClose }) => {
  return (
    // 배경 어둡게
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      
      {/* 모달 본체 */}
      <div className="bg-white w-[420px] rounded-[24px] p-10 shadow-lg">
        <h2 className="text-[20px] font-extrabold text-center mb-2">새 실험 생성</h2>
        <p className="text-sm text-[#5F6E9C] text-center mb-8">
          실험을 시작하기 전에 환경을 세팅해주세요.
        </p>

        {/* 실험 제목 */}
        <div className="mb-6">
          <label className="block text-[16px] font-bold text-[#1C1C59] mb-2">
            실험 제목
          </label>
          <input
            type="text"
            placeholder="실험 제목을 입력해주세요."
            className="w-full border border-gray-400 rounded px-4 py-2 text-sm"
          />
        </div>

        {/* 실험 매뉴얼 */}
        <div className="mb-10">
          <label className="block text-[16px] font-bold text-[#1C1C59] mb-2">
            실험 매뉴얼
          </label>
          <select
            className="w-full border border-gray-400 rounded px-4 py-2 text-sm appearance-none"
          >
            <option>실험 매뉴얼 선택</option>
          </select>
        </div>

        {/* 버튼 */}
        <button
          className="w-full bg-[#33308B] text-white text-sm font-semibold py-3 rounded hover:bg-[#2a286a] transition"
        >
          실험 시작
        </button>
      </div>
    </div>
  );
};

export default NewExperimentModal;