import React from 'react';

const AudioPlayer = ({ url }) => (
  <div className="audio-player">
    <audio controls autoPlay>
      <source src={url} type="audio/mpeg" />
      브라우저에서 오디오를 지원하지 않습니다.
    </audio>
  </div>
);

export default AudioPlayer;
