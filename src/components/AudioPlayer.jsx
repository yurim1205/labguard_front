import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ url }) => {
  const isDev = import.meta.env.DEV;
  const resolvedUrl = isDev ? url : `${window.location.origin}${url}`;
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.warn('자동 재생 차단됨:', e.message);
      });
    }
  }, [resolvedUrl]);

  return (
    <audio
      key={url}
      ref={audioRef}
      controls
      src={resolvedUrl}
      style={{ width: '100%' }}
    >
      브라우저가 오디오 태그를 지원하지 않습니다.
    </audio>
  );
};

export default AudioPlayer;