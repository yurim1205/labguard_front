// components/modal/manualUpdateModal.jsx
import ReactDOM from "react-dom";
import React from "react";
import equipment from '../../assets/img/equipment.png';

const ManualUpdateModal = ({ onClose, onStart }) => {
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-30">
      <div className="w-[480px] h-[420px] bg-white border-2 border-[#4B4F8F] rounded-[30px] p-8 flex flex-col items-center justify-between shadow-xl">
        {/* 아이콘 */}
        <div className="flex justify-center mt-4">
          <div className="bg-[#FFF2CC] rounded-full p-3">
            <img src={equipment} alt="equipment" className="w-[32px] h-[32px]" />
          </div>
        </div>

        {/* 텍스트 */}
        <p className="text-[20px] font-semibold text-[#1C1C59] text-center">
          매뉴얼이 등록되었습니다!
        </p>

        {/* 버튼 */}
        <div className="flex justify-between w-full px-4 gap-4 mb-2">
          <button
            onClick={onClose}
            className="w-1/2 py-2 text-[#1C1C59] font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            닫기
          </button>
          <button
            onClick={onStart}
            className="w-1/2 py-2 text-white font-semibold bg-[#4B4F8F] rounded-lg hover:bg-[#3d417a] shadow"
          >
            실험하기
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ManualUpdateModal;