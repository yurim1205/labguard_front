import React from "react";

const ChatInput = () => {
  return (
    <div className="max-w-[1200px] fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-white px-4 py-4 shadow-lg">
      <div
        className="flex items-center max-w-4xl mx-auto border border-transparent rounded-full px-4"
        style={{ height: "150px" }} // 높이 설정
      >
        <div className="flex-1">
          <input
            type="text"
            placeholder="텍스트를 입력해주세요."
            className="w-full h-full outline-none bg-transparent placeholder-gray-400 text-gray-600"
          />
        </div>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full"
          aria-label="질문 보내기"
        >
          ➡️
        </button>
      </div>
    </div>
  );
};

export default ChatInput;