import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ url }) => {
  const audioRef = useRef(null);

  const isDev = import.meta.env.DEV;
  const resolvedUrl = isDev ? url : `${window.location.origin}${url}`;

  useEffect(() => {
    if (audioRef.current) {
      // 자동 재생 로직
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("자동 재생 실패: ", error);
        });
      }
    }
  }, [resolvedUrl]);

  return (
    <audio
      key={resolvedUrl}
      ref={audioRef}
      src={resolvedUrl}
      style={{ display: 'none' }} // 플레이어 UI 숨기기
    >
      브라우저가 오디오 태그를 지원하지 않습니다.
    </audio>
  );
};

export default AudioPlayer;