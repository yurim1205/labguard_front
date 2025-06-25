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


// WebSocket readyState를 텍스트로 변환하는 헬퍼 함수
const getReadyStateText = (readyState) => {
  const states = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED'
  };
  return states[readyState] || 'UNKNOWN';
};

function ExperimentChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const [experimentDetails, setExperimentDetails] = useState({
    experiment_title: location.state?.experiment_title || '실험 제목 없음',
    manual: location.state?.manual || null,
  });
  const [experimentStartTime] = useState(new Date().toISOString()); // 실험 시작 시간
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
  const [userInfo, setUserInfo] = useState(null);


  const connectWebSocket = () => {
    console.log('🔄 connectWebSocket 함수 호출됨');
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('✅ WebSocket이 이미 연결되어 있습니다.', {
        readyState: socketRef.current.readyState,
        url: socketRef.current.url
      });
      return;
    }

    // 기존 WebSocket 정리
    if (socketRef.current) {
      console.log('🧹 기존 WebSocket 정리 중...', {
        currentState: socketRef.current.readyState,
        url: socketRef.current.url
      });
      socketRef.current.close();
      socketRef.current = null;
    }

    console.log('🚀 WebSocket 연결 시도 시작');
    console.log('🌐 브라우저 환경 정보:', {
      userAgent: navigator.userAgent,
      location: window.location.href,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port
    });
    
    // 직접 백엔드 서버에 연결 (프록시 우회)
    const wsUrl = 'ws://localhost:8000/ws/agent-chat';
    
    console.log('📡 WebSocket 연결 정보:', {
      targetUrl: wsUrl,
      timestamp: new Date().toISOString(),
      WebSocketSupport: typeof WebSocket !== 'undefined',
      readyStates: {
        CONNECTING: WebSocket.CONNECTING,
        OPEN: WebSocket.OPEN,
        CLOSING: WebSocket.CLOSING,
        CLOSED: WebSocket.CLOSED
      }
    });

    try {
      console.log('⚡ new WebSocket() 생성 시도...');
      socketRef.current = new WebSocket(wsUrl);
      
      console.log('✅ WebSocket 객체 생성 성공:', {
        readyState: socketRef.current.readyState,
        url: socketRef.current.url,
        protocol: socketRef.current.protocol,
        extensions: socketRef.current.extensions
      });
    } catch (error) {
      console.error('❌ WebSocket 객체 생성 실패:', {
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      setStatusText('WebSocket 객체 생성 실패: ' + error.message);
      return;
    }
  
    socketRef.current.onopen = (event) => {
      console.log('🎉 WebSocket 연결 성공! (onopen 이벤트)', {
        event: event,
        url: socketRef.current.url,
        readyState: socketRef.current.readyState,
        protocol: socketRef.current.protocol,
        extensions: socketRef.current.extensions,
        timestamp: new Date().toISOString(),
        bufferedAmount: socketRef.current.bufferedAmount
      });
      setStatusText('텍스트 모드 활성화 - 채팅 준비 완료');
      
      // 실험 정보를 서버로 전송
      const experimentInfo = {
        type: 'experiment_info',
        experiment_title: experimentDetails.experiment_title,
        manual: experimentDetails.manual,
        timestamp: new Date().toISOString()
      };
      socketRef.current.send(JSON.stringify(experimentInfo));
      console.log('실험 정보 전송:', experimentInfo);
    };

    socketRef.current.onmessage = (event) => {
      console.log('📨 WebSocket 메시지 수신 (raw):', {
        data: event.data,
        type: typeof event.data,
        length: event.data.length,
        timestamp: new Date().toISOString()
      });
      
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WebSocket 메시지 파싱 성공:', data);
        setIsTyping(false); // ✅ 응답 도착 시 typing 종료
        setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
      } catch (parseError) {
        console.error('❌ WebSocket 메시지 JSON 파싱 실패:', {
          error: parseError.message,
          rawData: event.data
        });
      }
    };

    socketRef.current.onerror = (errorEvent) => {
      console.error('💥 WebSocket 에러 발생 (onerror 이벤트):', {
        errorEvent: errorEvent,
        eventType: errorEvent.type,
        target: errorEvent.target,
        currentTarget: errorEvent.currentTarget,
        timestamp: new Date().toISOString()
      });
      
      if (socketRef.current) {
        console.error('💥 WebSocket 상태 정보:', {
          url: socketRef.current.url,
          readyState: socketRef.current.readyState,
          readyStateText: getReadyStateText(socketRef.current.readyState),
          protocol: socketRef.current.protocol,
          extensions: socketRef.current.extensions,
          bufferedAmount: socketRef.current.bufferedAmount
        });
      }
      
      // 네트워크 연결 상태 확인
      console.error('🌐 네트워크 상태:', {
        online: navigator.onLine,
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : 'not available'
      });
      
      setStatusText('WebSocket 연결 실패 - 백엔드 서버(localhost:8000)가 실행되지 않았거나 WebSocket 엔드포인트가 준비되지 않았습니다');
    };

    socketRef.current.onclose = (closeEvent) => {
      console.log('🔌 WebSocket 연결 종료 (onclose 이벤트):', {
        code: closeEvent.code,
        reason: closeEvent.reason,
        wasClean: closeEvent.wasClean,
        timestamp: new Date().toISOString(),
        eventType: closeEvent.type
      });
      
      // WebSocket 종료 코드 해석
      const closeCodeMeanings = {
        1000: 'Normal Closure',
        1001: 'Going Away',
        1002: 'Protocol Error',
        1003: 'Unsupported Data',
        1004: 'Reserved',
        1005: 'No Status Rcvd',
        1006: 'Abnormal Closure',
        1007: 'Invalid frame payload data',
        1008: 'Policy Violation',
        1009: 'Message Too Big',
        1010: 'Mandatory Extension',
        1011: 'Internal Server Error',
        1015: 'TLS Handshake'
      };
      
      console.log('📋 종료 코드 상세 정보:', {
        code: closeEvent.code,
        meaning: closeCodeMeanings[closeEvent.code] || 'Unknown',
        reason: closeEvent.reason || 'No reason provided',
        wasClean: closeEvent.wasClean ? '정상 종료' : '비정상 종료'
      });
      
      // 인증 실패로 인한 연결 종료 처리
      if (closeEvent.code === 1008 || closeEvent.code === 1011) {
        console.error('🔐 WebSocket 인증 실패 또는 서버 내부 오류');
        alert('로그인이 필요하거나 로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else if (closeEvent.code === 1006) {
        console.error('⚠️ 비정상 연결 종료 (1006) - 가능한 원인들:');
        console.error('   1. 백엔드 서버가 실행되지 않음');
        console.error('   2. WebSocket 엔드포인트가 존재하지 않음');
        console.error('   3. 방화벽이나 프록시에서 WebSocket 차단');
        console.error('   4. 네트워크 연결 문제');
        console.error('   5. CORS 정책 문제');
        setStatusText('WebSocket 연결 실패 - 백엔드 서버가 실행되지 않았거나 WebSocket 엔드포인트(/ws/agent-chat)가 준비되지 않았습니다');
      } else {
        console.log('ℹ️ 기타 종료 사유');
        setStatusText('WebSocket 연결이 종료되었습니다');
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
          message: '음성 모드 활성화',
          experiment_title: experimentDetails.experiment_title,
          manual: experimentDetails.manual,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        try {
          const data = await response.json();
          console.log('음성 채팅 연결 성공:', data);
          setStatusText('음성 모드 활성화 - 마이크 버튼을 눌러 녹음하세요');
          setMessages((prev) => [...prev, { sender: 'bot', text: '음성 모드가 활성화되었습니다. 마이크 버튼을 눌러서 말씀해주세요! 🎤' }]);
        } catch (jsonError) {
          console.error('음성 채팅 응답 JSON 파싱 실패:', jsonError);
          const responseText = await response.text();
          console.error('음성 채팅 응답 원문:', responseText);
          setStatusText('음성 모드 활성화 - 서버 응답 처리 중 문제가 발생했지만 연결되었습니다');
        }
      } else if (response.status === 401) {
        console.error('음성 채팅 인증 실패 - 로그인 필요');
        alert('로그인이 필요하거나 로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        // 에러 응답 처리
        let errorMessage = `음성 모드 연결 실패 (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (jsonError) {
          const responseText = await response.text();
          console.error('에러 응답 원문:', responseText);
          if (responseText.includes('Internal Server Error')) {
            errorMessage = '서버 내부 오류가 발생했습니다';
          }
        }
        console.error('음성 채팅 연결 실패:', response.status, response.statusText);
        setStatusText(errorMessage);
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
      // 실험 로그 데이터 구성
      const experimentLog = {
        experiment_title: experimentDetails.experiment_title,
        manual: experimentDetails.manual,
        chat_messages: messages,
        start_time: experimentStartTime,
        end_time: new Date().toISOString(),
        total_messages: messages.length
      };
      
      console.log('실험 종료 - 실험 로그:', experimentLog);
      
      // WebSocket 연결 종료
      if (socketRef.current) {
        // 실험 종료 정보를 서버로 전송
        if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({
            type: 'experiment_end',
            ...experimentLog
          }));
        }
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
      
      if (response.ok) {
        const userData = await response.json();
        setUserInfo(userData);
        console.log('사용자 정보 로드:', userData);
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

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const newMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);
    
    // WebSocket이 연결되어 있으면 WebSocket 사용
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageData = {
        message: input,
        manual_id: experimentDetails.manual?.manual_id || experimentDetails.manual?.id || null,
        user_id: userInfo?.id || userInfo?.user_id || "4"
      };
      
      const jsonMessage = JSON.stringify(messageData);
      console.log('📤 WebSocket 메시지 전송 시도:', {
        messageData: messageData,
        jsonString: jsonMessage,
        length: jsonMessage.length,
        readyState: socketRef.current.readyState,
        readyStateText: getReadyStateText(socketRef.current.readyState),
        timestamp: new Date().toISOString()
      });
      
      socketRef.current.send(jsonMessage);
      console.log('✅ WebSocket 메시지 전송 완료');
    } else {
      // WebSocket이 연결되지 않았으면 HTTP API 사용
      try {
        setStatusText('메시지 전송 중...');
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            message: newMsg.text,
            manual_id: experimentDetails.manual?.manual_id || experimentDetails.manual?.id || null,
            user_id: userInfo?.id || userInfo?.user_id || "4",
            experiment_title: experimentDetails.experiment_title
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('HTTP 채팅 응답:', data);
          setMessages((prev) => [...prev, { sender: 'bot', text: data.response || '응답을 받았습니다.' }]);
          setStatusText('메시지 전송 완료');
        } else if (response.status === 401) {
          alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
        } else {
          console.error('HTTP 채팅 실패:', response.status);
          setMessages((prev) => [...prev, { sender: 'bot', text: '죄송합니다. 현재 서버에 문제가 있어 응답할 수 없습니다.' }]);
          setStatusText('메시지 전송 실패');
        }
      } catch (error) {
        console.error('HTTP 채팅 에러:', error);
        setMessages((prev) => [...prev, { sender: 'bot', text: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }]);
        setStatusText('네트워크 오류');
      }
    }
    
    setIsTyping(false);
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
      formData.append('experiment_title', experimentDetails.experiment_title);
      formData.append('manual_id', experimentDetails.manual?.manual_id || '');
      formData.append('manual_filename', experimentDetails.manual?.filename || '');
      formData.append('timestamp', new Date().toISOString());

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
            <div className={`max-w-[70%] p-3 rounded-lg ${
              msg.sender === 'user' 
                ? 'bg-[#E6E6FA] text-black' 
                : 'bg-[#F2F2F2] text-black'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex justify-start"
          >
            <div className="bg-[#F2F2F2] text-black max-w-[70%] p-3 rounded-lg">
              <p>입력 중...</p>
            </div>
          </motion.div>
        )}
        </section>
        </div>

        {/* 입력 모드 토글 */}
        <InputModeToggle 
          mode={mode} 
          onModeChange={setMode}
          onTextModeClick={connectWebSocket}
          onVoiceModeClick={connectVoiceChat}
        />

        {/* 상태 표시 */}
        <StatusBar statusText={statusText} />

        {/* 텍스트 입력 섹션 */}
        {mode === 'text' && (
          <TextInputSection
            input={input}
            onInputChange={handleInputChange}
            onSend={handleSend}
          />
        )}

        {/* 음성 입력 섹션 */}
        {mode === 'voice' && (
          <VoiceControls
            isRecording={isRecording}
            onMicClick={handleMicClick}
            onVoiceSubmit={handleVoiceSubmit}
            setAudioBlob={setAudioBlob}
          />
        )}

        {/* 오디오 플레이어 */}
        {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
      </div>
    </>
  );
}

export default ExperimentChat;