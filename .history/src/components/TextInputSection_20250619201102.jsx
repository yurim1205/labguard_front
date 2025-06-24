import React from 'react';

const TextInputSection = ({ input, onInput, onSend, disabled }) => (
  <div className="flex items-center gap-3 mt-4">
    <input
      type="text"
      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      value={input}
      onChange={onInput}
      placeholder="질문을 입력하세요..."
      disabled={disabled}
    />
    <button
      className="px-4 py-2 bg-[#33308B] text-white rounded-lg font-semibold hover:bg-[#2a276f] disabled:bg-gray-400"
      onClick={onSend}
      disabled={disabled}
    >
      전송
    </button>
  </div>
);

export default TextInputSection;
