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