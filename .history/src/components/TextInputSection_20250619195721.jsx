import React from 'react';

const TextInputSection = ({ input, onInput, onSend, disabled }) => (
  <div className="text-input-section">
    <input
      type="text"
      className="text-input"
      value={input}
      onChange={onInput}
      placeholder="질문을 입력하세요..."
      disabled={disabled}
    />
    <button className="send-button" onClick={onSend} disabled={disabled}>
      전송
    </button>
  </div>
);

export default TextInputSection;