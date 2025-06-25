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
