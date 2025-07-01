import React from 'react';

const TextInputSection = ({ input, onInputChange, onSend, disabled }) => (
  <div className="w-full mt-[10px]">
    <div className="relative flex items-center">
      <input
        type="text"
        className="w-full h-[50px] px-4 pr-[60px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        value={input}
        onChange={onInputChange}
        placeholder=" 채팅하기 버튼을 눌러주세요 !"
        disabled={disabled}
      />
      <button
        className="absolute right-[8px] bg-[#DFE9FB] hover:bg-[#4071c7] w-[50px] h-[40px] text-[#8B8A8A] hover:text-white
        font-medium rounded-md transition text-[14px] border-none shadow-[0_4px_8px_0_rgba(128,128,128,0.2)]"
        onClick={onSend}
        disabled={disabled}
      >
        전송
      </button>
    </div>
  </div>
);

export default TextInputSection;