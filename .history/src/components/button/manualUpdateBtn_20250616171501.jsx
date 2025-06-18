import React, { useState } from 'react';
import ManualUpdateModal from '../modal/manualUpdateModal';

const ManualUpdateBtn = () => {
  const [showModal, setShowModal] = useState(false);

  const handleRegister = () => {
    // 실제 등록 로직 실행 후
    setShowModal(true);
  };

  const handleStartExperiment = () => {
    // 실험 페이지 이동 등 로직
    console.log('실험하기 누름');
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={handleRegister}
        className="px-[24px] py-[7px] mt-[10px] border border-gray-[10px] rounded-[10px] bg-[#FFFFFF] text-[#1C1C59]
        font-[700] text-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] hover:bg-gray-100
        transition duration-200 cursor-pointer"
      >
        매뉴얼 등록
      </button>

      {showModal && (
        <ManualUpdateModal
          onClose={() => setShowModal(false)}
          onStart={handleStartExperiment}
        />
      )}
    </>
  );
};

export default ManualUpdateBtn;
