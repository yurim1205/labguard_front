import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import ChatInput from '../../components/ChatInput';
import VoiceControls from '../../components/VoiceControls';
import AudioPlayer from '../../components/AudioPlayer';
import InputModeToggle from '../../components/InputModelToggle';
import StatusBar from '../../components/StatusBar';
import TextInputSection from '../../components/TextInputSection';


function ExperimentChat() {
  const location = useLocation();
  const [experimentDetails, setExperimentDetails] = useState({
    experiment_name: location.state?.experiment_name || '실험 제목 없음',
    manual: location.state?.manual || '매뉴얼 선택 안 됨',
  });
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '안녕하세요! 실험에 대해 질문해주세요. 🧑‍🔬',
    },
  ]);
  const [mode, setMode] = useState('text'); // 입력 모드
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const chatContainerRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState({ text: '', type: 'idle' });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 더미 매뉴얼 데이터
  const manuals = [
    { name: '고효율 촉매 및 전극 개발 실험 매뉴얼', date: '25/05/23 11:54:27' },
    { name: '수소/산소 발생 전극의 열화 대응 소재 발굴 실험 매뉴얼', date: '25/05/26 18:02:36' },
  ];

  const handleTitleSubmit = ({ experiment_name, manual }) => {
    setExperimentDetails({ experiment_name, manual }); // 제목과 매뉴얼 정보 업데이트
  };

  const handleMicClick = () => {
    setIsRecording((prev) => !prev);
    setStatusText(isRecording ? '녹음 중지됨' : '녹음 중...');
  };
  
  const handleSend = async () => {
    if (input.trim() === '' || isProcessing) return;

    const newMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsProcessing(true);
    setStatus({ text: 'AI가 답변을 생성하고 있습니다...', type: 'info' });

    // AI 봇 응답 시뮬레이션 (setTimeout 사용)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `'${prev[prev.length - 1].text}'에 대한 더미 답변입니다.` },
      ]);
      setIsProcessing(false);
      setStatus({ text: '', type: 'idle' });
    }, 1500);
  };
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };  

  return (
    <>
    <Header />
    <div className="max-w-[1200px] mx-auto pt-10 pb-12">
      {/* 실험 제목 및 안내 */}
      <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">
        {experimentDetails.experiment_name}
      </h1>
      <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
        실험 중 음성 또는 텍스트로 로그를 남기거나 질문할 수 있습니다. <br />
        음성 입력 필요 시 "진영아"라고 부른 후 내용을 말해주세요. <br /><br />
        남긴 실험 로그를 바탕으로 리포트가 자동 생성됩니다.
      </p>

    <div className="bg-[#f8f9fa] p-6 rounded-xl shadow-sm mb-10">
      <section
        ref={chatContainerRef}
        className="bg-white rounded-lg shadow-md p-4 h-[400px] overflow-y-auto space-y-4"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-xl px-4 py-3 text-sm max-w-[80%] ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.sender === 'bot' && (
                <strong className="font-bold block mb-1">AI 챗봇</strong>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </section>
    </div>
  
      {/* 입력 모드 UI 삽입 */}
      <div className="w-[600px] mx-auto mb-12">
        <InputModeToggle mode={mode} setMode={setMode} />
        <StatusBar message={statusText} type={isRecording ? 'recording' : 'idle'} />
  
        {mode === 'voice' ? (
          <>
            <VoiceControls
              isRecording={isRecording}
              onMicClick={handleMicClick}
              statusText={statusText}
            />
            {audioUrl && <AudioPlayer url={audioUrl} />}
          </>
        ) : (
          <TextInputSection
            input={input}
            onInput={handleInputChange}
            onSend={handleSend}
            disabled={false}
          />
        )}
      </div>
    </div>
  </>  
  );
}

export default ExperimentChat;