import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import ChatInput from '../../components/ChatInput';
import VoiceControls from '../../components/VoiceControls';
import AudioPlayer from '../../components/AudioPlayer';
import InputModeToggle from '../../components/InputModeToggle';
import StatusBar from '../../components/StatusBar';
import TextInputSection from '../../components/TextInputSection';


function ExperimentChat() {
  const location = useLocation();
  const [experimentDetails, setExperimentDetails] = useState({
    experiment_name: location.state?.experiment_name || '실험 제목 없음',
    manual: location.state?.manual || '매뉴얼 선택 안 됨',
  });
  const [mode, setMode] = useState('text'); // 입력 모드
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

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
    console.log('보낸 입력:', input);
    setInput('');
  };
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">
          {experimentDetails.experiment_name}
        </h1>
        <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
          실험 중 음성 또는 텍스트로 로그를 남기거나 질문할 수 있습니다. <br />
          음성 입력 필요 시 "진영아"라고 부른 후 내용을 말해주세요. <br />
          <br />
          남긴 실험 로그를 바탕으로 리포트가 자동 생성됩니다.
        </p>

        <section className="bg-[#ecece7] w-[600px] rounded-[10px] p-10 mb-10 pt-[24px] px-[100px] relative h-[200px] overflow-y-scroll">
            <div>
                <p>
                매뉴얼 브리핑 내용
                </p>
            </div>
        </section>

        <section className="bg-[#BAC9F0] w-[600px] rounded-[10px] p-10 mb-10 pt-[24px] px-[100px] relative h-[150px] overflow-y-scroll ml-auto">
            <div className="text-right">
                <p>
                사용자 질문 내용
                </p>
            </div>
        </section>
      </div>
      <ChatInput />
    </>
  );
}

export default ExperimentChat;