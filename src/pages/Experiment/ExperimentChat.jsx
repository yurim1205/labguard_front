import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import ChatInput from '../../components/ChatInput';
import VoiceControls from '../../components/VoiceControls';
import AudioPlayer from '../../components/AudioPlayer';
import InputModeToggle from '../../components/InputModelToggle';
import TextInputSection from '../../components/TextInputSection';
import { motion } from 'framer-motion';

function ExperimentChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  
  // 기본 상태들
  const [experimentDetails, setExperimentDetails] = useState({
    experiment_title: location.state?.experiment_title || '실험 제목 없음',
    manual: location.state?.manual || null,
  });
  
  const [messages, setMessages] = useState([]);
  const [mode, setMode] = useState('text');
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [statusText, setStatusText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  
  // 타이핑 상태
  const [typingText, setTypingText] = useState('');
  const [isStreamingResponse, setIsStreamingResponse] = useState(false);
  
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimerRef = useRef(null);
  
  // 타이핑 효과 함수
  const typeWriter = useCallback((text, callback, speed = 30) => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
    }

    let index = 0;
    setTypingText('');
    setIsStreamingResponse(true);
    
    typingTimerRef.current = setInterval(() => {
      if (index < text.length) {
        setTypingText(prev => prev + text[index]);
        index++;
      } else {
        clearInterval(typingTimerRef.current);
        setIsStreamingResponse(false);
        if (callback) callback();
      }
    }, speed);
    
    return typingTimerRef.current;
  }, []);
  
  const [experimentId, setExperimentId] = useState(() => {
    return location.state?.experiment_id || sessionStorage.getItem("experiment_id") || null;
  });

  // 사용자 정보 로드 함수 추가
  const checkAuthStatus = useCallback(async () => {
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
  }, [navigate]);

  // 기본 WebSocket 연결
  const connectWebSocket = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket이 이미 연결되어 있습니다.');
      return;
    }

    console.log('WebSocket 연결 시도...');
    
    const wsUrl = process.env.NODE_ENV === 'production' 
      ? 'wss://localhost:8000/api/ws/agent-chat' 
      : 'ws://localhost:8000/api/ws/agent-chat';
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('✅ WebSocket 연결 성공!');
      socketRef.current = ws;
      
      const experimentInfo = {
        type: 'experiment_info',
        experiment_id: experimentId,
        experiment_title: experimentDetails.experiment_title,
        manual: experimentDetails.manual,
        timestamp: new Date().toISOString()
      };
      ws.send(JSON.stringify(experimentInfo));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket 메시지 수신:', data);

        if (data.type === 'chat_response' || data.answer || data.message || data.response || data.text) {
          setIsTyping(false);
          
          const responseText = data.answer || data.message || data.response || data.text;
          
          if (responseText) {
            typeWriter(responseText, () => {
              setMessages(prev => [...prev, {
                sender: 'bot',
                text: responseText,
                audio_url: data.audio_url,
                timestamp: Date.now(),
                id: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              }]);
              setTypingText('');
              
              if (data.audio_url) {
                setAudioUrl(data.audio_url);
              }
            });
          }
        } else if (data.type === 'error') {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: '죄송합니다. 처리 중 오류가 발생했습니다.',
            timestamp: Date.now(),
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          }]);
        }
      } catch (error) {
        console.error('WebSocket 메시지 파싱 에러:', error);
      }
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket 연결 종료:', event.code, event.reason);
      socketRef.current = null;
    };
    
    ws.onerror = (error) => {
      console.error('❌ WebSocket 에러:', error);
      socketRef.current = null;
    };
  }, [experimentId, experimentDetails]);

  // 스크롤을 맨 아래로
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);

  // 실험 데이터 로드
  useEffect(() => {
    console.log('ExperimentChat useEffect 실행');
    
    const currentExperimentId = params.experimentId || location.state?.experiment_id;
    if (currentExperimentId && currentExperimentId !== experimentId) {
      setExperimentId(currentExperimentId);
      sessionStorage.setItem("experiment_id", currentExperimentId);
    }

    // location.state에서 초기 실험 정보 설정 (새로운 실험 시작 시)
    if (location.state?.experiment_title) {
      const locationDetails = {
        experiment_title: location.state.experiment_title,
        manual: location.state.manual || null,
      };
      setExperimentDetails(locationDetails);
      console.log('새 실험 시작 - location.state에서 실험 정보 설정:', locationDetails);
    }

    ///////////브리핑////////////////////

    // 브리핑 자동 재생 및 메시지 표시
    console.log('브리핑 자동재생 대상:', location.state?.audio_url, location.state?.summary);
    
    // 브리핑은 실험당 한 번만 재생 (새로고침 시 중복 재생 방지)
    const briefingKey = `briefing_played_${currentExperimentId}`;
    const briefingAlreadyPlayed = sessionStorage.getItem(briefingKey);
    
    if (location.state?.audio_url && location.state?.summary && !briefingAlreadyPlayed) {
      console.log('🎯 브리핑 데이터 감지 (첫 재생):', {
        audio_url: location.state.audio_url,
        summary: location.state.summary
      });

      // 브리핑 재생 완료 표시
      sessionStorage.setItem(briefingKey, 'true');

      // 브리핑 음성만 자동 재생 (텍스트 메시지 없이)
      try {
        console.log('🎯 브리핑 음성 재생 시작:', location.state.audio_url);
        const briefingAudio = new Audio(location.state.audio_url);
        
        briefingAudio.onloadeddata = () => {
          console.log('🎯 브리핑 음성 로드 완료');
        };
        
        briefingAudio.onplay = () => {
          console.log('🎯 브리핑 음성 재생 시작');
          setStatusText('브리핑 음성 재생 중...');
        };
        
        briefingAudio.onended = () => {
          console.log('🎯 브리핑 음성 재생 완료');
          setStatusText('브리핑 완료 - 실험을 시작해주세요');
        };
        
        briefingAudio.onerror = (error) => {
          console.error('🎯 브리핑 음성 재생 에러:', error);
          setStatusText('브리핑 음성 재생 실패');
        };

        // 브라우저 자동재생 정책에 따라 사용자 상호작용 후 재생될 수 있음
        briefingAudio.play().catch((error) => {
          console.log('🎯 브리핑 음성 자동재생 실패 (사용자 상호작용 필요):', error);
          setStatusText('브리핑 준비 완료 - 화면을 클릭하여 음성을 들어보세요');
          
          // 사용자 클릭 시 재생되도록 이벤트 리스너 추가
          const playOnClick = () => {
            briefingAudio.play().then(() => {
              setStatusText('브리핑 음성 재생 중...');
              document.removeEventListener('click', playOnClick);
            }).catch((err) => {
              console.error('🎯 클릭 후 재생 실패:', err);
            });
          };
          document.addEventListener('click', playOnClick, { once: true });
        });

      } catch (audioError) {
        console.error('🎯 브리핑 음성 객체 생성 실패:', audioError);
        setStatusText('브리핑 음성 로드 실패');
      }
    }
    
    //////////////////////브리핑 끝//////////////////////

    const loadPreviousChat = async () => {
      // 채팅 이력 로드
      if (currentExperimentId) {
        try {
          const res = await fetch(`/api/chat/continue/${currentExperimentId}`, {
            method: 'GET',
            credentials: 'include'
          });

          if (res.ok) {
            const data = await res.json();
            const formatted = data.map((msg, index) => ({
              sender: msg.sender === "user" ? "user" : "bot",
              text: msg.message || msg.text,
              timestamp: msg.timestamp || Date.now(),
              isSystemMessage: msg.sender === "system",
              id: msg.id || `db_${msg.timestamp || Date.now()}_${index}`
            }));
            
            setMessages(formatted);
            console.log("채팅 이력 복원 완료:", formatted);
          } else {
            console.warn("채팅 이력 불러오기 실패:", res.status);
            setMessages([]);
          }
        } catch (err) {
          console.error("채팅 이력 로드 중 에러:", err);
          setMessages([]);
        }
      }
      
      // 실험 정보 로드
      try {
        const res = await fetch(`/api/experiments/${currentExperimentId}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          console.log("실험 정보 로드 성공:", data);
          
          setExperimentDetails({
            experiment_title: data.experiment_title || experimentDetails.experiment_title,
            manual: data.manual || experimentDetails.manual
          });
          
          // 채팅 이력이 없을 때만 환영 메시지 추가
          setMessages(prev => {
            if (prev.length === 0) {
              const welcomeMessage = {
                sender: 'bot',
                text: `안녕하세요! "${data.experiment_title || experimentDetails.experiment_title}" 실험에 오신 것을 환영합니다! 🧑‍🔬\n\n${data.manual ? `선택하신 매뉴얼: ${data.manual.filename || data.manual.title || '매뉴얼'}` : experimentDetails.manual ? `선택하신 매뉴얼: ${experimentDetails.manual.filename || experimentDetails.manual.title || '매뉴얼'}` : '매뉴얼이 선택되지 않았습니다.'}\n\n실험에 대해 궁금한 점이 있으시면 언제든 질문해주세요!`,
                timestamp: Date.now(),
                id: `welcome_${Date.now()}`
              };
              return [...prev, welcomeMessage];
            }
            return prev;
          });
        } else if (res.status === 404) {
          console.warn("실험을 찾을 수 없습니다. 새로운 실험을 시작합니다.");
          // 실험이 없으면 기본 환영 메시지 표시
          setMessages(prev => {
            if (prev.length === 0) {
              const welcomeMessage = {
                sender: 'bot',
                text: `안녕하세요! "${experimentDetails.experiment_title}" 실험에 오신 것을 환영합니다! 🧑‍🔬\n\n${experimentDetails.manual ? `선택하신 매뉴얼: ${experimentDetails.manual.filename || experimentDetails.manual.title || '매뉴얼'}` : '매뉴얼이 선택되지 않았습니다.'}\n\n실험에 대해 궁금한 점이 있으시면 언제든 질문해주세요!`,
                timestamp: Date.now(),
                id: `welcome_${Date.now()}`
              };
              return [...prev, welcomeMessage];
            }
            return prev;
          });
        } else {
          console.warn("실험 정보 불러오기 실패:", res.status);
          // API 실패 시에도 환영 메시지 표시
          setMessages(prev => {
            if (prev.length === 0) {
              const welcomeMessage = {
                sender: 'bot',
                text: `안녕하세요! "${experimentDetails.experiment_title}" 실험에 오신 것을 환영합니다! 🧑‍🔬\n\n${experimentDetails.manual ? `선택하신 매뉴얼: ${experimentDetails.manual.filename || experimentDetails.manual.title || '매뉴얼'}` : '매뉴얼이 선택되지 않았습니다.'}\n\n실험에 대해 궁금한 점이 있으시면 언제든 질문해주세요!`,
                timestamp: Date.now(),
                id: `welcome_${Date.now()}`
              };
              return [...prev, welcomeMessage];
            }
            return prev;
          });
        }
      } catch (err) {
        console.error("실험 로드 중 에러:", err);
        // 에러 시에도 환영 메시지 표시
        setMessages(prev => {
          if (prev.length === 0) {
            const welcomeMessage = {
              sender: 'bot',
              text: `안녕하세요! "${experimentDetails.experiment_title}" 실험에 오신 것을 환영합니다! 🧑‍🔬\n\n${experimentDetails.manual ? `선택하신 매뉴얼: ${experimentDetails.manual.filename || experimentDetails.manual.title || '매뉴얼'}` : '매뉴얼이 선택되지 않았습니다.'}\n\n실험에 대해 궁금한 점이 있으시면 언제든 질문해주세요!`,
              timestamp: Date.now(),
              id: `welcome_${Date.now()}`
            };
            return [...prev, welcomeMessage];
          }
          return prev;
        });
      }
    };
  
    if (currentExperimentId) {
      loadPreviousChat();
      connectWebSocket();
      checkAuthStatus(); // 사용자 정보 로드 추가
    }
  }, [params.experimentId, location.state?.experiment_id, checkAuthStatus]);

  // 메시지 변경 시 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText, isStreamingResponse]);

  // 메시지 전송
  const handleSend = useCallback(async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = input.trim();
    const messageId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newMsg = { 
      sender: 'user', 
      text: userMessage, 
      timestamp: Date.now(),
      id: messageId 
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);
    
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const manualId = experimentDetails.manual?.manual_id || 
                      experimentDetails.manual?.id || 
                      (typeof experimentDetails.manual === 'string' ? 
                        experimentDetails.manual : null);

      const messageData = {
        message: userMessage,
        experiment_id: experimentId || params.experimentId,
        manual_id: manualId,
        message_id: messageId
      };
      
      socketRef.current.send(JSON.stringify(messageData));
    } else {
      connectWebSocket();
      setTimeout(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          const manualId = experimentDetails.manual?.manual_id || 
                          experimentDetails.manual?.id || null;

          const messageData = {
            message: userMessage,
            experiment_id: experimentId || params.experimentId,
            manual_id: manualId,
            message_id: messageId
          };
          
          socketRef.current.send(JSON.stringify(messageData));
        } else {
          setIsTyping(false);
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'WebSocket 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
            timestamp: Date.now(),
            id: `error_${Date.now()}`
          }]);
        }
      }, 1000);
    }
  }, [input, isTyping, experimentDetails, experimentId, params.experimentId, connectWebSocket]);

  // 음성 녹음 시작
  const handleMicClick = useCallback(async () => {
    if (isRecording) {
      handleStopRecording();
      return;
    }

    try {
      setStatusText('마이크 권한을 요청하고 있습니다...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setStatusText('음성이 녹음되었습니다. 전송하고 있습니다...');
        
        setTimeout(() => {
          handleSendAudio(blob);
        }, 500);
      };
      
      recorder.start();
      setIsRecording(true);
      setStatusText('🎤 녹음 중... 말씀해주세요!');
      
    } catch (error) {
      console.error('마이크 접근 에러:', error);
      setStatusText('마이크 접근이 거부되었습니다. 브라우저 설정을 확인해주세요.');
    }
  }, [isRecording]);

  // 음성 녹음 중지
  const handleStopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setStatusText('녹음을 중지하고 있습니다...');
    }
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
  }, [mediaRecorder, audioStream]);

  // 음성 전송
  const handleSendAudio = useCallback(async (blob = audioBlob) => {
    if (!blob) {
      console.error('전송할 음성 데이터가 없습니다.');
      return;
    }

    setIsTyping(true);
    setStatusText('음성을 분석하고 있습니다...');

    try {
      const formData = new FormData();
      formData.append('audio', blob, 'audio.wav'); // 기존 코드와 동일한 파일명
      
      const currentExperimentId = experimentId || params.experimentId || location.state?.experiment_id;
      formData.append('experiment_id', currentExperimentId || '');

      // manual_id 처리 - 기존 코드와 동일한 로직
      const manualId = experimentDetails.manual?.manual_id || 
                      experimentDetails.manual?.id || 
                      (typeof experimentDetails.manual === 'string' ? 
                        experimentDetails.manual : null);
      
      if (manualId) {
        formData.append('manual_id', manualId);
      }
      // manual_id가 없으면 아예 전송하지 않음 (빈 문자열 전송 방지)

      // user_id 추가 - 기존 코드에서 필수 필드로 보임
      formData.append('user_id', userInfo?.id || userInfo?.user_id || '');

      // FormData 내용 디버깅
      console.log('음성 전송 데이터 (기존 코드 형식):', {
        experiment_id: currentExperimentId || '',
        manual_id: manualId,
        user_id: userInfo?.id || userInfo?.user_id || '',
        audioSize: blob.size,
        audioType: blob.type
      });

      // FormData 항목들 확인
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      const response = await fetch('/api/stt/voice/chat', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      console.log('응답 상태:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('음성 처리 성공:', data);
        
        setIsTyping(false);
        
        const userText = data.input_text || '[음성 인식 실패]';
        const botText = data.output_text || data.response_text || data.message || '음성이 처리되었습니다.';
        
        // 사용자 메시지 추가
        setMessages(prev => [...prev, { 
          sender: 'user', 
          text: userText,
          timestamp: Date.now(),
          id: `voice_user_${Date.now()}`
        }]);
        
        // 봇 응답 추가 (타이핑 효과 적용)
        setTimeout(() => {
          typeWriter(botText, () => {
            setMessages(prev => [...prev, {
              sender: 'bot', // 기존 코드는 'assistant'였지만 일관성을 위해 'bot' 사용
              text: botText,
              audio_url: data.audio_url,
              timestamp: Date.now(),
              id: `voice_bot_${Date.now()}`
            }]);
            setTypingText('');
            
            if (data.audio_url) {
              setAudioUrl(data.audio_url);
            }
          });
        }, 500);
        
        setStatusText('답변 완료! 버튼을 눌러 질문 해주세요!');
        setAudioBlob(null);
      } else {
        setIsTyping(false);
        
        // 상세한 에러 응답 확인
        let errorMessage = '';
        let errorDetails = null;
        
        try {
          const errorData = await response.json();
          errorDetails = errorData;
          errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
          console.error('에러 응답 JSON:', errorData);
        } catch (jsonError) {
          try {
            errorMessage = await response.text();
            console.error('에러 응답 텍스트:', errorMessage);
          } catch (textError) {
            console.error('응답 읽기 실패:', textError);
            errorMessage = `HTTP ${response.status} 오류`;
          }
        }

        if (response.status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
          navigate('/login');
        } else if (response.status === 422) {
          console.error('422 Unprocessable Entity - 요청 데이터 문제:', {
            audioSize: blob.size,
            audioType: blob.type,
            experimentId: currentExperimentId,
            manualId: manualId,
            userId: userInfo?.id || userInfo?.user_id || '',
            errorDetails: errorDetails
          });
          setStatusText('음성 데이터 처리 실패 - 다시 녹음해주세요');
        } else {
          setStatusText(`음성 처리 실패 (${response.status}) - ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('음성 전송 에러:', error);
      setStatusText('음성 전송 실패 - 네트워크를 확인해주세요');
      setIsTyping(false);
    }
  }, [audioBlob, experimentId, params.experimentId, location.state?.experiment_id, experimentDetails, userInfo, navigate, typeWriter]);

  const handleInputChange = useCallback((e) => setInput(e.target.value), []);

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[20px] text-left">
          {experimentDetails.experiment_title}
        </h1>
          
        <p className="text-[#33308B] text-base text-left mb-8 font-medium">
          실험 중 음성 또는 텍스트로 로그를 남기거나 질문할 수 있습니다. <br />
          남긴 실험 로그를 바탕으로 리포트가 자동 생성됩니다.
        </p>

        <div className="bg-[#f8f9fa] p-6 rounded-xl shadow-sm mb-10">
          <section
            ref={chatContainerRef}
            className="bg-[#D8DDFF] rounded-lg shadow-md p-4 h-[550px] overflow-y-auto space-y-4"
          >
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] p-3 rounded-[20px] ${
                  msg.sender === 'user' 
                    ? 'bg-[#E6E6FA] text-black mr-[6px] mt-[10px]' 
                    : msg.isSystemMessage 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 text-gray-800 shadow-md'
                      : 'bg-[#F2F2F2] text-black ml-[6px] mt-[10px]'
                }`}>
                  <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            
            {/* 실시간 타이핑 표시 */}
            {isStreamingResponse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="w-full flex justify-start"
              >
                <div className="bg-[#F2F2F2] text-black max-w-[70%] p-3 rounded-[20px] ml-[6px] mt-[10px]">
                  <p className="whitespace-pre-wrap font-medium">
                    {typingText}
                    <span className="animate-pulse">|</span>
                  </p>
                </div>
              </motion.div>
            )}
            
            {/* 로딩 인디케이터 */}
            {isTyping && !isStreamingResponse && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex justify-start"
              >
                <div className="bg-[#F2F2F2] text-black max-w-[70%] p-3 rounded-[20px] ml-[6px] mt-[10px]">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-600 ml-2">AI가 답변을 준비하고 있습니다...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </section>
        </div>

        {/* 입력 모드 토글 */}
        <InputModeToggle 
          mode={mode} 
          onModeChange={setMode}
          onTextModeClick={() => {
            connectWebSocket();
            setStatusText('채팅 모드로 전환되었습니다.');
          }}
          onVoiceModeClick={() => {
            connectWebSocket();
            setStatusText('🎤 마이크 버튼을 눌러 음성으로 질문하세요!');
          }}
          onExperimentEndClick={() => {
            const confirmEnd = window.confirm('실험을 종료하시겠습니까?\n\n종료하면 현재까지의 채팅 내용이 실험 로그로 저장됩니다.');
            if (confirmEnd) {
              navigate('/ExperimentMain');
            }
          }}
          onExperimentSaveClick={() => {
            alert('실험이 저장되었습니다!');
          }}
        />

        {/* 텍스트 입력 모드 */}
        {mode === 'text' && (
          <TextInputSection
            input={input}
            onInputChange={handleInputChange}
            onSend={handleSend}
          />
        )}

        {/* 음성 입력 모드 */}
        {mode === 'voice' && (
          <div className="mt-4 text-center">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-gray-700 font-medium">{statusText}</p>
            </div>
            
            {/* 음성 질문 버튼을 눌렀을 때 바로 녹음 시작하는 기존 로직 유지 */}
            <button
              onClick={handleMicClick}
              disabled={isRecording}
              className={`px-4 py-2 w-[120px] h-[40px] rounded-[5px] font-medium text-[16px]
                shadow-[0_12px_24px_0_rgba(128,128,128,0.35)] transition border-none mb-4
                ${isRecording 
                  ? 'bg-red-500 text-white animate-pulse hover:bg-red-600' 
                  : 'bg-[#565991] hover:bg-[#4071c7] text-[#ffffff]'}`}
            >
              {isRecording ? '🎤 녹음중' : '🎤 녹음'}
            </button>
            
            {isRecording && (
              <button
                onClick={handleStopRecording}
                className="px-4 py-2 w-[120px] h-[40px] rounded-[5px] font-medium text-[16px]
                  shadow-[0_12px_24px_0_rgba(128,128,128,0.35)] transition border-none
                  bg-red-500 hover:bg-red-600 text-white block mx-auto mt-4"
              >
                🛑 중지
              </button>
            )}
          </div>
        )}

        {/* 오디오 플레이어 */}
        {audioUrl && <AudioPlayer url={audioUrl} />}
      </div>
    </>
  );
}

export default ExperimentChat;