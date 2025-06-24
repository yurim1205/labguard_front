import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const [experimentDetails, setExperimentDetails] = useState({
    experiment_title: location.state?.experiment_title || '실험 제목 없음',
    manual: location.state?.manual || '매뉴얼 선택 안 됨',
  });
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '안녕하세요! 실험에 대해 질문해주세요. 🧑‍🔬' },
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


  useEffect(() => {
    socketRef.current = new WebSocket('ws://localhost:8000/ws/agent-chat');
  
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setIsTyping(false); // ✅ 응답 도착 시 typing 종료
      setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
    };
  
    return () => socketRef.current?.close();
  }, []);  

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
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
    if (!audioBlob) return;
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');

    const res = await fetch('api/web-voice/chat', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: '[음성 입력]' },
      { sender: 'bot', text: data.response },
    ]);
    setAudioUrl(data.audio_url); // 만약 base64로 올 경우 변환 필요
  };

  const handleInputChange = (e) => setInput(e.target.value);

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left">
          {experimentDetails.experiment_title}
        </h1>
        <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
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
        </section>
        </div>

        <div className="w-full mx-auto mb-12">
          <InputModeToggle mode={mode} setMode={setMode} />
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