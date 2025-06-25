import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperimentStartBtn from '../button/experimentStartBtn';

const NewExperimentModal = ({ onClose, onTitleSubmit }) => {
  const [experiment_title, setExperimentTitle] = useState(''); // 실험 제목 상태
  const [selectedManual, setSelectedManual] = useState(''); // 매뉴얼 선택 상태
  const [manuals, setManuals] = useState([]); // 실제 매뉴얼 데이터
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (experiment_title.trim()) {
      navigate('/ExperimentChat', {
        state: {
          experiment_title,
          manual: selectedManual,
        },
      });
      onClose(); // 모달 닫기
    }
  };
  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      {/* 모달 */}
      <div className="fixed left-1/2 top-1/2 z-60 -translate-x-1/2 -translate-y-1/2 bg-[#FFFFFF] h-[420px] w-[420px] rounded-[24px] p-10 shadow-lg border border-[#E6EEFF]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
        <h2 className="text-[20px] font-extrabold text-center mb-0 font-[500]">새 실험 생성</h2>
        <p className="text-[14px] text-[#5F6E9C] text-center mb-8">
          실험을 시작하기 전에 환경을 세팅해주세요.
        </p>
       
        <div className="mb-10 flex flex-col items-center justify-center">
        {/* 실험 제목 */}
        <div className="mb-6 w-[280px] max-w-md mt-[20px]">
          <label className="block text-[16px] font-bold text-[#1C1C59] mb-2 text-center">실험 제목</label>
          <input
            type="text"
            placeholder="실험 제목을 입력해주세요."
            value={experiment_title}
            onChange={(e) => setExperimentTitle(e.target.value)}
            className="w-full border border-gray-400 rounded px-4 py-2 text-sm h-[28px]"
          />
        </div>

        {/* 실험 매뉴얼 */}
        <div className="mb-6 w-[280px] max-w-md mt-[32px]">
          <label className="block text-[16px] font-bold text-[#1C1C59] mb-2 text-center">실험 매뉴얼</label>
          <select
            className="w-full border border-gray-400 rounded px-4 py-2 text-sm appearance-none h-[28px]"
            value={selectedManual}
            onChange={(e) => setSelectedManual(e.target.value)}
          >
            <option value="">실험 매뉴얼 선택</option>
            {manuals.map((manual, idx) => (
              <option key={idx} value={manual.manual_id}>
                {manual.name}
              </option>
            ))}
          </select>
        </div>

       <ExperimentStartBtn onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default NewExperimentModal;