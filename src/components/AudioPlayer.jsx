import React from 'react';

const AudioPlayer = ({ url }) => {
  const isDev = import.meta.env.DEV;
  const resolvedUrl = isDev ? url : `${window.location.origin}${url}`;

  return (
    <audio key={url} controls src={resolvedUrl} style={{ width: '100%' }}>
      브라우저가 오디오 태그를 지원하지 않습니다.
    </audio>
  );
};

export default AudioPlayer;