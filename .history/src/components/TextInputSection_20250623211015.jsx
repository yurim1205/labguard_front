import React from 'react';

const TextInputSection = ({ input, onInput, onSend, disabled }) => (
  <div className="w-full flex items-center gap-3 mt-[10px]">
    <input
      type="text"
      className="flex-1 h-[50px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      value={input}
      onChange={onInput}
      placeholder="질문을 입력하세요..."
      disabled={disabled}
    />
    <button
       className="bg-[#DFE9FB] hover:bg-[#4071c7] w-[50px] h-[52px] text-[#8B8A8A] mb-[4px]
      font-medium py-3 rounded-full transition text-[14px] border-none shadow-[0_12px_24px_0_rgba(128,128,128,0.35)]"
      onClick={onSend}
      disabled={disabled}
    >
      전송
    </button>
  </div>
);

export default TextInputSection;