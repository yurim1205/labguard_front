import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import ChatInput from '../../components/ChatInput';
import VoiceControls from '../../components/VoiceControls';
import AudioPlayer from '../../components/AudioPlayer';
import InputModeToggle from '../../components/InputModelToggle';
// import StatusBar from '../../components/StatusBar';
import TextInputSection from '../../components/TextInputSection';
import { motion } from 'framer-motion';
import ReportTypeModal from '../../components/modal/ReportTypeModal';
import ExperimentEndBtn from '../../components/button/experimentEndBtn';


function ExperimentChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [experimentDetails, setExperimentDetails] = useState({
    experiment_title: location.state?.experiment_title || '실험 제목 없음',
    manual: location.state?.manual || null,
  });

  // 디버깅: location.state 확인
  console.log('ExperimentChat - location.state:', location.state);
  console.log('ExperimentChat - experimentDetails:', experimentDetails);
  const [experimentStartTime] = useState(new Date().toISOString()); // 실험 시작 시간
  const [messages, setMessages] = useState([]); // 초기에는 빈 배열로 시작
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
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioStream, setAudioStream] = useState(null);

  const [experimentId, setExperimentId] = useState(() => {
    return location.state?.experiment_id || sessionStorage.getItem("experiment_id") || null;
  });

  // 모달 상태
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const loadChatLogFromDB = async () => {
    if (!experimentId) return;

    try {
      const res = await fetch(`/api/chat/continue/${experimentId}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((msg) => ({
          sender: msg.sender === "user" ? "user" : "bot",
          text: msg.message,
        }));
        console.log("포맷된 메시지:", formatted);
        setMessages((prev) => [...prev, ...formatted]);
        console.log("이어쓰기 채팅 로드 완료:", formatted);
      } else {
        console.warn("이어쓰기 채팅 로드 실패:", res.status);
      }
    } catch (err) {
      console.error("이어쓰기 채팅 로드 중 오류:", err);
    }
    console.log("🧾 현재 메시지 상태:", messages);
  };

  useEffect(() => {
    if (experimentId) {
      sessionStorage.setItem("experiment_id", experimentId);
      loadChatLogFromDB();
    }
  }, [experimentId]);


  const connectWebSocket = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket이 이미 연결되어 있습니다.');
      return;
    }

    const wsUrl = 'ws://localhost:8000/api/ws/agent-chat';
    console.log('WebSocket 연결 시도:', wsUrl);
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log('✅ WebSocket 연결 성공!');
      setStatusText('텍스트 모드 활성화 - 채팅 준비 완료');

      // 실험 정보를 서버로 전송
      const experimentInfo = {
        type: 'experiment_info',
        experiment_id: experimentId,
        experiment_title: experimentDetails.experiment_title,
        manual: experimentDetails.manual,
        timestamp: new Date().toISOString()
      };
      console.log('실험 정보 전송:', experimentInfo);
      socketRef.current.send(JSON.stringify(experimentInfo));
    };

    socketRef.current.onmessage = (event) => {
      console.log('📨 WebSocket 메시지 수신 (raw):', event.data);
      const data = JSON.parse(event.data);
      console.log('📨 WebSocket 메시지 수신 (parsed):', data);
      setIsTyping(false);

      // 다양한 응답 필드 확인 (answer, message, response 등)
      const responseText = data.answer || data.message || data.response || data.text;

      if (responseText) {
        console.log('✅ AI 응답 추가:', responseText);
        setMessages((prev) => [...prev, { sender: 'ai', text: responseText }]);
      }
      else {
        console.warn('⚠️ 알 수 없는 응답 구조:', data);
        setMessages((prev) => [...prev, { sender: 'ai', text: '[알 수 없는 응답]' }]);
      }

      // TTS 오디오 URL이 있으면 설정
      if (data.audio_url) {
        setAudioUrl(data.audio_url);
        console.log('🎵 TTS 오디오 URL 설정:', data.audio_url);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('❌ WebSocket 에러:', error);
      setStatusText('WebSocket 연결 실패 - 백엔드 서버가 실행되지 않았습니다');
    };

    socketRef.current.onclose = (event) => {
      console.log('🔌 WebSocket 연결 종료:', event.code, event.reason);

      // 인증 실패로 인한 연결 종료 처리
      if (event.code === 1008 || event.code === 1011) {
        console.error('WebSocket 인증 실패');
        alert('로그인이 필요하거나 로그인이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else if (event.code === 1006) {
        setStatusText('WebSocket 연결 실패 - 백엔드 서버가 실행되지 않았습니다');
      } else {
        setStatusText('WebSocket 연결이 종료되었습니다');
      }
    };
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

      useEffect(() => {
        const experimentId = location.state?.experiment_id;
        if (!experimentId) return;

        const loadPreviousChat = async () => {
          try {
            const res = await fetch(`/api/experiment/${experimentId}`, {
              method: 'GET',
              credentials: 'include'
            });
            console.log("📡 응답 객체:", res);
            const rawText = await res.text();
            console.log("🧾 응답 원문 텍스트:", rawText);

            const data = JSON.parse(rawText);
            console.log("파싱된 데이터:", data);

            if (res.ok) {
              const data = await res.json();
              const formatted = data.map((msg) => ({
                sender: msg.sender === "user" ? "user" : "bot",
                text: msg.message,
              }));
              setMessages((prev) => [...prev, ...formatted]);
              console.log(" 이전 채팅 불러오기 성공:", formatted);
            } else {
              console.warn(" 이전 채팅 불러오기 실패:", res.status);
            }
          } catch (err) {
            console.error(" 채팅 불러오기 중 에러:", err);
          }
        };

        loadPreviousChat();
      }, []);

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

    // location.state에서 초기 실험 정보 설정 (새로운 실험 시작 시)
    if (location.state?.experiment_title) {
      const locationDetails = {
        experiment_title: location.state.experiment_title,
        manual: location.state.manual || null,
      };
      setExperimentDetails(locationDetails);
      console.log('새 실험 시작 - location.state에서 실험 정보 설정:', locationDetails);
    }

    // WebSocket 연결 시도
    console.log('🔌 WebSocket 연결 시도 시작');
    connectWebSocket();

    ///////////브리핑////////////////////

    // 브리핑 자동 재생 및 메시지 표시
    console.log('브리핑 자동재생 대상:', location.state?.audio_url, location.state?.summary);

    if (location.state?.audio_url && location.state?.summary) {
      console.log('🎯 브리핑 데이터 감지:', {
        audio_url: location.state.audio_url,
        summary: location.state.summary
      });

      // 브리핑 메시지를 시스템 메시지로 추가
      const briefingMessage = {
        sender: 'bot',
        text: `📋 **[위험요소 브리핑]**\n\n${location.state.summary}`,
        isSystemMessage: true
      };

      setMessages((prevMessages) => {
        // 이미 브리핑 메시지가 있는지 확인 (중복 방지)
        const hasBriefing = prevMessages.some(msg =>
          msg.text && msg.text.includes('[위험요소 브리핑]')
        );

        if (!hasBriefing) {
          console.log('🎯 브리핑 메시지 추가');
          return [briefingMessage, ...prevMessages];
        }
        return prevMessages;
      });

      // 브리핑 음성 자동 재생
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

  useEffect(() => {
    // URL에서 experimentId 파라미터 또는 location.state에서 experiment_id 가져오기
    const experimentId = params.experimentId || location.state?.experiment_id;

    if (!experimentId) {
      console.log('실험 ID가 없습니다. 새로운 실험을 시작합니다.');
      return;
    }

    console.log('실험 기록 로드 시도:', experimentId);

    const loadPreviousChat = async () => {
      try {
        console.log('실험 정보 로드 시도:', experimentId);

        const res = await fetch(`/api/experiment/${experimentId}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (res.ok) {
          const experimentData = await res.json();
          console.log("실험 정보 로드 성공:", experimentData);

          // 실험 정보 업데이트 (location.state의 최신 데이터를 우선 사용)
          setExperimentDetails({
            experiment_title: location.state?.experiment_title || experimentData.title || experimentData.experiment_title || '실험 제목 없음',
            manual: location.state?.manual || experimentData.manual_id || experimentData.manual || null,
          });

          // 현재는 채팅 메시지를 가져오는 별도 API가 없으므로 환영 메시지 표시
          setMessages([
            {
              sender: 'bot',
              text: `안녕하세요! "${experimentData.title || experimentData.experiment_title || '실험'}" 실험에 오신 것을 환영합니다! 🧑‍🔬\n\n실험에 대해 궁금한 점이 있으시면 언제든 질문해주세요!`
            }
          ]);
          console.log("실험 복원 완료 - 실험 정보 로드됨");

        } else if (res.status === 404) {
          console.warn("실험을 찾을 수 없습니다. 새로운 실험을 시작합니다.");
          // 실험이 없으면 기본 환영 메시지 표시
          setMessages([
            {
              sender: 'bot',
              text: `안녕하세요! "${experimentDetails.experiment_title}" 실험에 오신 것을 환영합니다! 🧑‍🔬\n\n${experimentDetails.manual ? `선택하신 매뉴얼: ${experimentDetails.manual.filename || experimentDetails.manual.title || '매뉴얼'}` : '매뉴얼이 선택되지 않았습니다.'}\n\n실험에 대해 궁금한 점이 있으시면 언제든 질문해주세요!`
            }
          ]);
        } else {
          console.warn("실험 정보 불러오기 실패:", res.status);
          // API 실패 시에도 환영 메시지 표시
          setMessages([
            {
              sender: 'bot',
              text: `안녕하세요! "${experimentDetails.experiment_title}" 실험에 오신 것을 환영합니다! 🧑‍🔬\n\n${experimentDetails.manual ? `선택하신 매뉴얼: ${experimentDetails.manual.filename || experimentDetails.manual.title || '매뉴얼'}` : '매뉴얼이 선택되지 않았습니다.'}\n\n실험에 대해 궁금한 점이 있으시면 언제든 질문해주세요!`
            }
          ]);
        }
      } catch (err) {
        console.error("실험 로드 중 에러:", err);
        // 에러 시에도 환영 메시지 표시
        setMessages([
          {
            sender: 'bot',
            text: `안녕하세요! "${experimentDetails.experiment_title}" 실험에 오신 것을 환영합니다! 🧑‍🔬\n\n${experimentDetails.manual ? `선택하신 매뉴얼: ${experimentDetails.manual.filename || experimentDetails.manual.title || '매뉴얼'}` : '매뉴얼이 선택되지 않았습니다.'}\n\n실험에 대해 궁금한 점이 있으시면 언제든 질문해주세요!`
          }
        ]);
      }
    };

    loadPreviousChat();
  }, [params.experimentId, location.state?.experiment_id]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input; // 입력값을 변수에 저장
    const newMsg = { sender: 'user', text: userMessage };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // WebSocket이 연결되어 있으면 WebSocket 사용
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      // manual_id 처리 - 음성 처리와 동일한 로직 사용
      const manualId = experimentDetails.manual?.manual_id ||
        experimentDetails.manual?.id ||
        (typeof experimentDetails.manual === 'string' ? experimentDetails.manual : null);

      console.log('manual_id 처리 과정:', {
        'experimentDetails.manual': experimentDetails.manual,
        'typeof experimentDetails.manual': typeof experimentDetails.manual,
        'manual_id 계산 결과': manualId,
        'manual_id가 null인가': manualId === null,
        'experimentDetails 전체': experimentDetails
      });

      // manual_id가 없으면 오류 메시지 표시
      if (!manualId) {
        console.error('❌ manual_id가 없습니다. WebSocket 메시지를 보낼 수 없습니다.');
        setMessages((prev) => [...prev, {
          sender: 'bot',
          text: '매뉴얼 정보가 없어서 채팅을 할 수 없습니다. 실험을 다시 시작해주세요.'
        }]);
        setIsTyping(false);
        setStatusText('매뉴얼 정보 오류');
        return;
      }

      const messageData = {
        message: userMessage,
        manual_id: manualId,  // 필수 필드로 항상 포함
        user_id: userInfo?.id || userInfo?.user_id || "4",
        experiment_id: experimentId || ''
      };

      console.log('WebSocket 메시지 전송:', messageData);
      console.log('실험 매뉴얼 정보:', experimentDetails.manual);

      socketRef.current.send(JSON.stringify(messageData));
    } else {
      // WebSocket이 연결되지 않았으면 HTTP API 사용
      try {
        setStatusText('메시지 전송 중...');
      } catch (error) {
        console.error('HTTP 채팅 에러:', error);
        setMessages((prev) => [...prev, { sender: 'bot', text: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }]);
        setStatusText('네트워크 오류');
        setIsTyping(false);
      }
    }
  };

  const handleMicClick = async () => {
    // 녹음 시작만 담당
    if (isRecording) return; // 이미 녹음 중이면 무시

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      console.log('마이크 접근 허용됨, 녹음 시작');

      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        console.log('녹음 완료, 오디오 블롭 생성됨, 크기:', audioBlob.size);

        // 녹음 완료 후 자동으로 서버에 전송 (audioBlob을 직접 전달)
        setTimeout(() => {
          console.log('handleVoiceSubmit 호출 시작');
          handleVoiceSubmit(audioBlob);
        }, 100);
      };

      recorder.start();
      setIsRecording(true);
      setStatusText('녹음 중... 녹음 중지 버튼을 눌러 완료하세요');

    } catch (error) {
      console.error('마이크 접근 실패:', error);
      setStatusText('마이크 접근 실패 - 브라우저에서 마이크 권한을 허용해주세요');
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    // 녹음 중지 및 서버 전송
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      setStatusText('녹음 완료 - 음성 처리 중...');
      console.log('녹음 중지됨 - 서버 전송 대기');
    }
  };

  const handleVoiceSubmit = async (blob = audioBlob) => {
    console.log('handleVoiceSubmit 함수 시작, audioBlob:', blob);

    if (!blob) {
      console.log('audioBlob이 없음');
      setStatusText('녹음된 음성이 없습니다 - 마이크 버튼을 눌러 녹음하세요');
      return;
    }

    try {
      console.log('음성 파일 전송 중...', {
        blobSize: blob.size,
        experimentId: experimentId,
        userId: userInfo?.id || userInfo?.user_id,
        manualId: experimentDetails.manual?.manual_id
      });
      setStatusText('음성 처리 중...');
      setIsTyping(true);

      const formData = new FormData();
      formData.append('audio', blob, 'audio.wav');
      formData.append('experiment_id', experimentId || '');

      // manual_id 처리 - 빈 문자열 대신 null 또는 실제 값 전송
      const manualId = experimentDetails.manual?.manual_id ||
        experimentDetails.manual?.id ||
        (typeof experimentDetails.manual === 'string' ? experimentDetails.manual : null);
      if (manualId) {
        formData.append('manual_id', manualId);
      }
      // manual_id가 없으면 아예 전송하지 않음 (빈 문자열 전송 방지)

      formData.append('user_id', userInfo?.id || userInfo?.user_id || '');

      // FormData 내용 확인
      console.log('전송할 데이터:', {
        audioSize: blob.size,
        experimentId: experimentId || '',
        manualId: manualId,
        userId: userInfo?.id || userInfo?.user_id || '',
        experimentDetails: experimentDetails,
        userInfo: userInfo
      });

      const response = await fetch('/api/stt/voice/chat', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('음성 응답 수신:', data);

        // 사용자 메시지(STT 결과)와 AI 응답을 함께 추가
        setMessages((prev) => [
          ...prev,
          { sender: 'user', text: data.input_text || '[음성 인식 실패]' },
          { sender: 'assistant', text: data.output_text || data.response_text || '음성이 처리되었습니다.', audio_url: data.audio_url }
        ]);

        if (data.audio_url) {
          setAudioUrl(data.audio_url);
        }

        setStatusText('음성 처리 완료');
        setAudioBlob(null);
      } else if (response.status === 401) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        // 에러 응답 본문 확인
        let errorText = '';
        try {
          const errorData = await response.json();
          errorText = JSON.stringify(errorData);
          console.error('에러 응답 JSON:', errorData);
        } catch (jsonError) {
          try {
            errorText = await response.text();
            console.error('에러 응답 텍스트:', errorText);
          } catch (textError) {
            console.error('응답 읽기 실패:', textError);
          }
        }

        setStatusText(`음성 처리 실패 (${response.status}) - 다시 시도해주세요`);
        console.error('음성 처리 실패:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('음성 전송 에러:', error);
      setStatusText('음성 전송 실패 - 네트워크를 확인해주세요');
    } finally {
      setIsTyping(false);
    }
  };

  const handleInputChange = (e) => setInput(e.target.value);

  // 실험 종료 버튼 클릭 핸들러
  const handleExperimentEndClick = () => {
    // 실험 데이터 준비
    const experimentData = {
      experiment_id: experimentId,
      experiment_title: experimentDetails.experiment_title,
      manual_id: experimentDetails.manual?.manual_id || experimentDetails.manual?.id || experimentDetails.manual,
      messages: messages,
      start_time: experimentStartTime,
      end_time: new Date().toISOString()
    };

    // ExperimentEnd 페이지로 이동하면서 데이터 전달
    navigate('/experiment/end', {
      state: {
        experimentData: experimentData
      }
    });
  };

  // 리포트 유형 선택 핸들러
  const handleReportTypeSelect = (type) => {
    console.log('선택된 리포트 유형:', type);

    // 실험 데이터 준비
    const experimentData = {
      experiment_id: experimentId,
      experiment_title: experimentDetails.experiment_title,
      manual_id: experimentDetails.manual?.manual_id || experimentDetails.manual?.id || experimentDetails.manual,
      report_type: type,
      messages: messages,
      start_time: experimentStartTime,
      end_time: new Date().toISOString()
    };

    // ReportRead 페이지로 이동하면서 데이터 전달
    navigate('/report/read', {
      state: {
        experimentData: experimentData,
        reportType: type
      }
    });
  };

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <div className="flex justify-between items-center mb-[20px]">
          <h1 className="text-[2.3rem] font-black text-left">
            {experimentDetails.experiment_title}
          </h1>

          {/* 실험 종료 버튼 */}
          <ExperimentEndBtn
            onClick={handleExperimentEndClick}
          />
        </div>

        <p className="text-[#7B87B8] text-base text-left mb-8">
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
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user'
                  ? 'bg-[#E6E6FA] text-black'
                  : msg.isSystemMessage
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 text-gray-800 shadow-md'
                    : 'bg-[#F2F2F2] text-black'
                  }`}>
                  <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
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
          onVoiceModeClick={() => {
            connectWebSocket();
            setStatusText('음성 모드 활성화됨 - 마이크 버튼을 눌러 녹음하세요');
          }}
        />

        {/* 상태 표시 */}
        {/* <StatusBar statusText={statusText} /> */}

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
            onStopRecording={handleStopRecording}
            statusText={statusText}
          />
        )}

        {/* 오디오 플레이어 */}
        {audioUrl && <AudioPlayer url={audioUrl} />}
      </div>

      {/* 리포트 유형 선택 모달 */}
      <ReportTypeModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSelectType={handleReportTypeSelect}
      />
    </>
  );
}

export default ExperimentChat;