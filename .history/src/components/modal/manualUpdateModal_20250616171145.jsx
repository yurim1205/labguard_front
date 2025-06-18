import React from 'react';
import equipment from '../../assets/img/equipment.png';

const ManualUpdateModal = ({ onClose, onStart }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-[360px] text-center relative">
        {/* 아이콘 */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#FFF2CC] rounded-full p-3">
            <PiFlaskBold size={32} className="text-[#1C1C59]" />
          </div>
        </div>

        {/* 텍스트 */}
        <p className="text-[18px] font-bold text-[#1C1C59] mb-8">
          매뉴얼이 등록되었습니다!
        </p>

        {/* 버튼 */}
        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-[#1C1C59] font-semibold bg-white hover:bg-gray-100"
          >
            닫기
          </button>
          <button
            onClick={onStart}
            className="flex-1 py-2 rounded-lg text-white font-semibold bg-[#4B4F8F] hover:bg-[#3d417a] shadow"
          >
            실험하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualUpdateModal;
