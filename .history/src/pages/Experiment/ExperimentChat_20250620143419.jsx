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
    {
      sender: 'user',
      text: '네, 안녕하세요. 고효율 촉매 개발 실험 매뉴얼에 대해 질문이 있습니다. 실험 절차 3단계에서 주의해야 할 점이 무엇인가요?',
    },
    {
      sender: 'bot',
      text: '3단계에서는 시료를 혼합할 때 발생하는 열에 주의해야 합니다. 반드시 후드 내에서 작업하고, 보안경과 내열 장갑을 착용하세요. 온도가 급격히 상승할 경우 즉시 작업을 중단하고 관리자에게 보고해야 합니다.',
    },
    {
      sender: 'user',
      text: '알겠습니다. 감사합니다.',
    },
  ]);
  const [mode, setMode] = useState('text'); // 입력 모드
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const chatContainerRef = useRef(null);

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
  
  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    // AI 봇 응답 시뮬레이션
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '네, 질문에 대해 답변해 드릴게요.' },
      ]);
    }, 1000);
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
  
      {/* 브리핑 / 질문 로그 */}
      {/* <section className="bg-[#ecece7] w-[600px] rounded-[10px] p-10 mb-10 pt-[24px] px-[100px] relative h-[200px] overflow-y-scroll">
        <div>
          <p>매뉴얼 브리핑 내용</p>
        </div>
      </section>
  
      <section className="bg-[#BAC9F0] w-[600px] rounded-[10px] p-10 mb-10 pt-[24px] px-[100px] relative h-[150px] overflow-y-scroll ml-auto">
        <div className="text-right">
          <p>사용자 질문 내용</p>
        </div>
      </section> */}

    {/* 전체 채팅 영역을 감싸는 div 추가 */}
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