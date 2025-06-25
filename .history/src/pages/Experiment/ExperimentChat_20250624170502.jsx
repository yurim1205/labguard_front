import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import ChatInput from '../../components/ChatInput';
import VoiceControls from '../../components/VoiceControls';
import AudioPlayer from '../../components/AudioPlayer';
import InputModeToggle from '../../components/InputModelToggle';
import StatusBar from '../../components/StatusBar';
import TextInputSection from '../../components/TextInputSection';
import { motion } from 'framer-motion';


function ExperimentChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const [experimentDetails, setExperimentDetails] = useState({
    experiment_title: location.state?.experiment_title || '실험 제목 없음',
    manual: location.state?.manual || null,
  });
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: `안녕하세요! "${experimentDetails.experiment_title}" 실험에 오신 것을 환영합니다! 🧑‍🔬\n\n${experimentDetails.manual ? `선택하신 매뉴얼: ${experimentDetails.manual.filename || experimentDetails.manual.title || '매뉴얼'}` : '매뉴얼이 선택되지 않았습니다.'}\n\n실험에 대해 궁금한 점이 있으시면 언제든 질문해주세요!`
    },
  ]);
  const [mode, setMode] = useState('text');
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null); // 🔸 음성 녹음 Blob 저장
  const [statusText, setStatusText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);


  const connectWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket이 이미 연결되어 있습니다.');
      return;
    }

    console.log('WebSocket 연결 시도 중...');
    socketRef.current = new WebSocket('ws://localhost:8000/ws/agent-chat');
  
    socketRef.current.onopen = () => {
      console.log('WebSocket 연결 성공!');
      setStatusText('텍스트 모드 활성화 - 채팅 준비 완료');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WebSocket 메시지 수신:', data);
      setIsTyping(false); // ✅ 응답 도착 시 typing 종료
      setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket 에러:', error);
      setStatusText('연결 오류 - 서버 상태를 확인해주세요');
    };

    socketRef.current.onclose = (event) => {
      console.log('WebSocket 연결 종료:', event.code, event.reason);
      
      // 인증 실패로 인한 연결 종료 처리
      if (event.code === 1008 || event.code === 1011) {
        console.error('WebSocket 인증 실패');
        alert('로그인이 필요하거나 로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        setStatusText('연결이 종료되었습니다');
      }
    };
  };

  const connectVoiceChat = async () => {
    try {
      console.log('음성 채팅 연결 시도 중...');
      setStatusText('음성 모드 활성화 중...');
      
      const response = await fetch('/api/web-voice/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'connect',
          message: '음성 모드 활성화'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('음성 채팅 연결 성공:', data);
        setStatusText('음성 모드 활성화 - 마이크 버튼을 눌러 녹음하세요');
        setMessages((prev) => [...prev, { sender: 'bot', text: '음성 모드가 활성화되었습니다. 마이크 버튼을 눌러서 말씀해주세요! 🎤' }]);
      } else if (response.status === 401) {
        console.error('음성 채팅 인증 실패 - 로그인 필요');
        alert('로그인이 필요하거나 로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        console.error('음성 채팅 연결 실패:', response.status, response.statusText);
        setStatusText('음성 모드 연결 실패 - 서버 상태를 확인해주세요');
      }
    } catch (error) {
      console.error('음성 채팅 연결 에러:', error);
      if (error.message === 'Failed to fetch') {
        setStatusText('서버에 연결할 수 없습니다 - 백엔드 서버를 확인해주세요');
      } else {
        setStatusText('음성 모드 연결 에러 - 네트워크를 확인해주세요');
      }
    }
  };

  const handleExperimentEnd = () => {
    const confirmEnd = window.confirm(
      '실험을 종료하시겠습니까?\n\n종료하면 현재까지의 채팅 내용이 실험 로그로 저장됩니다.'
    );
    
    if (confirmEnd) {
      console.log('실험 종료 - 채팅 로그:', messages);
      
      // WebSocket 연결 종료
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      // 실험 결과 페이지로 이동하거나 메인 페이지로 돌아가기
      alert('실험이 종료되었습니다. 채팅 로그가 저장되었습니다.');
      
      // 실험 메인 페이지로 이동
      window.location.href = '/experiment';
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/user/me', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.status === 401) {
        console.error('사용자 인증 실패');
        alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
        navigate('/login');
        return false;
      }
      
      return response.ok;
    } catch (error) {
      console.error('인증 상태 확인 에러:', error);
      return false;
    }
  };

  useEffect(() => {
    // 페이지 로드 시 인증 상태 확인
    checkAuthStatus();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);  

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // WebSocket 연결 확인
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setStatusText('연결되지 않음 - 텍스트 버튼을 클릭하여 연결하세요');
      return;
    }
    
    const newMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, newMsg]);
    socketRef.current.send(JSON.stringify({ message: input }));
    setInput('');
    setIsTyping(true); // ✅ 응답 기다리는 중
  };
  

  const handleMicClick = () => {
    setIsRecording((prev) => !prev);
    setStatusText((prev) => (isRecording ? '녹음 중지됨' : '녹음 중...'));
  };

  const handleVoiceSubmit = async () => {
    if (!audioBlob) {
      setStatusText('녹음된 음성이 없습니다 - 마이크 버튼을 눌러 녹음하세요');
      return;
    }
    
    try {
      console.log('음성 파일 전송 중...');
      setStatusText('음성 처리 중...');
      setIsTyping(true);
      
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');

      const response = await fetch('/api/web-voice/chat', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('음성 응답 수신:', data);
        
        setMessages((prev) => [
          ...prev,
          { sender: 'user', text: '[음성 입력]' },
          { sender: 'bot', text: data.response || '음성이 처리되었습니다.' },
        ]);
        
        if (data.audio_url) {
          setAudioUrl(data.audio_url);
        }
        
        setStatusText('음성 처리 완료');
        setAudioBlob(null); // 전송 후 오디오 블롭 초기화
      } else if (response.status === 401) {
        console.error('음성 처리 인증 실패 - 로그인 필요');
        alert('로그인이 필요하거나 로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        console.error('음성 처리 실패:', response.status, response.statusText);
        setStatusText('음성 처리 실패 - 다시 시도해주세요');
      }
    } catch (error) {
      console.error('음성 전송 에러:', error);
      setStatusText('음성 전송 실패 - 네트워크를 확인해주세요');
    } finally {
      setIsTyping(false);
    }
  };

  const handleInputChange = (e) => setInput(e.target.value);

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[20px] text-left">
          {experimentDetails.experiment_title}
        </h1>
        
        {/* 실험 정보 섹션 */}
        <div className="bg-white border border-[#E6EEFF] rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-[#1C1C59] font-semibold">📋 매뉴얼:</span>
                <span className="text-[#5F6E9C]">
                  {experimentDetails.manual 
                    ? (experimentDetails.manual.filename || experimentDetails.manual.title || '선택된 매뉴얼')
                    : '매뉴얼 선택 안 됨'
                  }
                </span>
              </div>
              {experimentDetails.manual && (
                <div className="flex items-center space-x-2">
                  <span className="text-[#1C1C59] font-semibold">🆔 ID:</span>
                  <span className="text-[#5F6E9C]">#{experimentDetails.manual.manual_id}</span>
                </div>
              )}
            </div>
            <div className="text-sm text-[#7B87B8]">
              실험 시작 시간: {new Date().toLocaleString('ko-KR')}
            </div>
          </div>
        </div>
        
        <p className="text-[#7B87B8] text-base text-left mb-8">
          실험 중 음성 또는 텍스트로 로그를 남기거나 질문할 수 있습니다. <br />
          음성 입력 필요 시 "랩가드야"라고 부른 후 내용을 말해주세요. <br />
          남긴 실험 로그를 바탕으로 리포트가 자동 생성됩니다.
        </p>

        <div className="bg-[#f8f9fa] p-6 rounded-xl shadow-sm mb-10">
        <section
          ref={chatContainerRef}
          className="bg-[#D8DDFF] rounded-lg shadow-md p-4 h-[550px] overflow-y-auto space-y-4"
        >
       {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-[20px] text-sm break-words shadow-sm
                ${msg.sender === 'user'
                  ? 'bg-[#565991] text-white rounded-br-none'
                  : 'bg-white text-black rounded-bl-none border border-gray-200'}`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-start"
          >
            <div className="bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-[20px] max-w-[40%] animate-pulse">
              입력 중...
            </div>
          </motion.div>
        )}
        </section>
        </div>

        <div className="w-full mx-auto mb-12">
          <InputModeToggle 
            mode={mode} 
            setMode={setMode} 
            onTextModeClick={connectWebSocket} 
            onVoiceModeClick={connectVoiceChat}
            onExperimentEndClick={handleExperimentEnd}
          />
          <StatusBar message={statusText} type={isRecording ? 'recording' : 'idle'} />

          {mode === 'voice' ? (
            <>
              <VoiceControls
                isRecording={isRecording}
                onMicClick={handleMicClick}
                onSend={handleVoiceSubmit} // 🔹 음성 전송 처리
              />
              {audioUrl && <AudioPlayer url={audioUrl} />}
            </>
          ) : (
            <TextInputSection input={input} onInput={handleInputChange} onSend={handleSend} />
          )}
        </div>
      </div>
    </>
  );
}

export default ExperimentChat;