import React from 'react';

const AudioPlayer = ({ url }) => (
  <div className="w-full max-w-md mx-auto mt-4 p-4 bg-white rounded-xl shadow-md">
    <audio controls className="w-full">
      <source src={url} type="audio/mpeg" />
      브라우저에서 오디오를 지원하지 않습니다.
    </audio>
  </div>
);

export default AudioPlayer;
