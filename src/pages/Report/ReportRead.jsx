import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/Header';
import ReportCancleBtn from '../../components/button/reportCancleBtn';

// 더미 리포트 데이터 - 실제 API로 교체 예정
const reportData = {
  1: {
    id: 1,
    title: 'CO+H2+CO2 가스 혼합물과의 철 산화물의 반응성 조사',
    created_at: '25/05/17 13:43',
    content: `
      실험 목적: CO, H2, CO2 가스 혼합물이 철 산화물에 미치는 반응성을 조사하여 
      환원 반응의 효율성을 분석한다.
      
      실험 결과:
      - 온도 800°C에서 최적의 반응성을 보임
      - CO 농도가 높을수록 환원 속도 증가
      - 안전 주의사항: 고온 작업 시 방호복 착용 필수
    `,
    safety_notes: [
      '고온 작업 시 방호복 착용 필수',
      '가스 누출 감지기 상시 작동',
      '환기 시설 정상 작동 확인'
    ]
  },
  2: {
    id: 2,
    title: '알칼리수 전기분해 셀 설계',
    created_at: '25/06/05 13:12',
    content: `
      실험 목적: 고효율 알칼리수 전기분해 셀을 설계하여 수소 생산 효율을 극대화한다.
      
      실험 결과:
      - 전류밀도 500 mA/cm²에서 최적 효율 달성
      - 전해질 농도 30% KOH 사용
      - 수소 순도 99.8% 달성
    `,
    safety_notes: [
      '강알칼리 용액 취급 시 보안경 착용',
      '전기 작업 시 절연장갑 착용',
      '수소 가스 누출 방지 철저'
    ]
  }
};

function ReportRead() {
  const { reportId } = useParams(); // URL에서 리포트 ID 추출
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const location = useLocation(); // location state에서 데이터 받기
  const [currentReport, setCurrentReport] = useState(null); // 현재 리포트 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // ExperimentChat에서 전달받은 데이터 확인
      if (location.state?.experimentData) {
        console.log('실험 데이터 수신:', location.state.experimentData);

        // 실험 데이터에서 정보 추출 및 리포트 생성
        const experimentData = location.state.experimentData;
        const reportType = location.state.reportType;

        // 실험 데이터에서 정보 추출 (AI 활용)
        const extractedInfo = await extractExperimentInfo(experimentData);

        const generatedReport = {
          id: experimentData.experiment_id || `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          title: `${experimentData.experiment_title} - ${reportType === 'personal' ? '개인' : '비즈니스'} 리포트`,
          created_at: new Date(experimentData.end_time).toLocaleString(),
          content: generateReportContent(experimentData, reportType),
          safety_notes: extractedInfo.safety_notes || generateSafetyNotes(reportType),
          experiment_data: experimentData,
          report_type: reportType,
          // 추출된 정보들
          purpose: extractedInfo.purpose,
          equipment: extractedInfo.equipment,
          materials: extractedInfo.materials,
          procedure: extractedInfo.procedure,
          summary: extractedInfo.summary
        };

        setCurrentReport(generatedReport);
        setLoading(false);
        return;
      }

      // 기존 리포트 ID로 로드 (기존 로직)
      if (reportId) {
        const report = reportData[reportId];

        if (report) {
          setCurrentReport(report);
        } else {
          alert('리포트를 찾을 수 없습니다.');
          navigate('/ReportMain');
          return;
        }
      }

      setLoading(false);
    };

    loadData();
  }, [reportId, navigate, location.state]);

  useEffect(() => {
    if (currentReport && currentReport.id) {
      const saved = JSON.parse(localStorage.getItem('myReports') || '[]');
      if (!saved.find(r => r.id === currentReport.id)) {
        localStorage.setItem('myReports', JSON.stringify([currentReport, ...saved]));
      }
    }
  }, [currentReport]);

  // 실험 데이터에서 정보 추출하는 함수 (AI 활용)
  const extractExperimentInfo = async (experimentData) => {
    const messages = experimentData.messages || [];
    const userMessages = messages.filter(msg => msg.sender === 'user');
    const aiMessages = messages.filter(msg => msg.sender === 'bot' || msg.sender === 'ai');

    // 실험 제목
    const experimentTitle = experimentData.experiment_title || '실험';

    // 채팅 내용을 하나의 텍스트로 합치기
    const chatContent = messages.map(msg =>
      `${msg.sender === 'user' ? '사용자' : 'AI'}: ${msg.text}`
    ).join('\n');

    // AI를 사용해 실험 정보 추출
    try {
      const extractedInfo = await extractInfoWithAI(chatContent, experimentTitle);
      return extractedInfo;
    } catch (error) {
      console.error('AI 정보 추출 실패:', error);
      // AI 실패 시 기본값 반환
      return {
        purpose: `${experimentTitle}에 대한 연구와 분석을 진행합니다.`,
        equipment: '실험에 필요한 표준 장비와 기구를 사용합니다.',
        materials: '실험에 필요한 화학물질과 시약을 사용합니다.',
        procedure: '표준 실험 절차에 따라 체계적으로 진행됩니다.',
        summary: `총 ${messages.length}개의 메시지를 통해 실험을 진행했습니다. 사용자 질문 ${userMessages.length}개, AI 응답 ${aiMessages.length}개로 구성되어 있습니다.`,
        safety_notes: [
          '실험 전 안전수칙을 확인하세요',
          '보호장비를 착용하고 신중하게 진행하세요',
          '실험 결과를 정확히 기록하세요'
        ]
      };
    }
  };

  // AI를 사용해 실험 정보 추출하는 함수
  const extractInfoWithAI = async (chatContent, experimentTitle) => {
    const prompt = `
당신은 실험 채팅 로그를 분석하여 매우 상세하고 포괄적인 실험 정보를 추출하는 AI입니다.

다음 채팅 로그를 분석하여 실험 정보를 추출해주세요:

[채팅 로그]
${chatContent}

[실험 제목]
${experimentTitle}

다음 형식으로 JSON 응답을 해주세요. 각 항목은 최소 200자 이상으로 매우 상세하게 작성해주세요:

{
  "purpose": "실험 목적 (매우 상세하게 작성):
    - 실험의 근본적인 목적과 배경
    - 이 실험을 통해 얻고자 하는 결과나 지식
    - 실험의 과학적/실용적 의의
    - 예상되는 응용 분야나 활용 방안
    - 실험의 필요성과 중요성에 대한 설명",
  
  "equipment": "사용 장비 (매우 상세하게 작성):
    - 실험에 사용되는 모든 장비와 기구의 상세 목록
    - 각 장비의 용도와 기능 설명
    - 장비의 사양이나 모델명 (채팅에서 언급된 경우)
    - 장비 사용 시 주의사항이나 특별한 설정
    - 장비 간의 연결 관계나 조립 방법
    - 대체 가능한 장비나 대안",
  
  "materials": "사용 물질 (매우 상세하게 작성):
    - 실험에 사용되는 모든 화학물질과 시약의 상세 목록
    - 각 물질의 화학식, 순도, 농도 정보
    - 물질의 물리적/화학적 특성
    - 물질의 안전성 정보와 취급 시 주의사항
    - 물질의 구매처나 준비 방법
    - 물질의 보관 조건과 유효기간
    - 대체 가능한 물질이나 대안",
  
  "procedure": "실험 절차 (매우 상세하게 작성):
    - 실험의 전체적인 흐름과 단계별 상세 과정
    - 각 단계에서 수행해야 할 구체적인 작업
    - 실험 조건 설정 방법 (온도, 압력, 시간 등)
    - 측정 방법과 데이터 기록 방법
    - 예상되는 문제점과 해결 방안
    - 실험 중 확인해야 할 포인트
    - 실험 완료 후 정리 작업",
  
  "summary": "실험 요약 (매우 상세하게 작성):
    - 실험의 전체적인 진행 과정 요약
    - 주요 발견사항이나 결과
    - 실험 중 발생한 문제와 해결 과정
    - 실험의 성공/실패 여부와 그 이유
    - 실험을 통해 얻은 교훈이나 인사이트
    - 향후 개선 방향이나 추가 연구 필요사항
    - 실험의 의의와 영향",
  
  "safety_notes": [
    "안전 관련 주의사항 1 (구체적이고 상세하게)",
    "안전 관련 주의사항 2 (구체적이고 상세하게)",
    "안전 관련 주의사항 3 (구체적이고 상세하게)",
    "안전 관련 주의사항 4 (구체적이고 상세하게)",
    "안전 관련 주의사항 5 (구체적이고 상세하게)"
  ]
}

주의사항:
- 채팅에서 명확히 언급된 정보가 있으면 그것을 우선 사용하고 상세히 확장
- 정보가 부족하면 실험 제목과 일반적인 실험 과정을 기반으로 현실적으로 추정
- 각 항목은 최소 200자 이상으로 매우 상세하게 작성
- 전문적이면서도 이해하기 쉽게 작성
- 구체적인 수치, 조건, 방법 등을 포함
- safety_notes는 배열 형태로 5개 정도의 상세한 안전 관련 주의사항 포함
- 모든 텍스트는 한국어로 작성
- JSON 형식만 응답하고 다른 설명은 포함하지 마세요
- 실험의 전문성과 신뢰성을 높이는 방향으로 작성
`;

    try {
      const response = await fetch('/api/ai/extract-experiment-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          chat_content: chatContent,
          experiment_title: experimentTitle
        })
      });

      if (!response.ok) {
        throw new Error('AI API 호출 실패');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('AI 정보 추출 에러:', error);
      throw error;
    }
  };

  // 리포트 내용 생성 함수
  const generateReportContent = (experimentData, type) => {
    const startTime = new Date(experimentData.start_time);
    const endTime = new Date(experimentData.end_time);
    const duration = Math.round((endTime - startTime) / 1000 / 60);
    const messages = experimentData.messages || [];
    const userMessages = messages.filter(msg => msg.sender === 'user');
    const botMessages = messages.filter(msg => msg.sender === 'bot' || msg.sender === 'ai');

    if (type === 'personal') {
      return `
실험 제목: ${experimentData.experiment_title}
실험 ID: ${experimentData.experiment_id}
실험 시작: ${startTime.toLocaleString()}
실험 종료: ${endTime.toLocaleString()}
실험 시간: ${duration}분

📊 실험 요약:
- 총 메시지 수: ${messages.length}개
- 사용자 질문: ${userMessages.length}개
- AI 응답: ${botMessages.length}개

💬 주요 대화 내용:
${userMessages.slice(0, 5).map((msg, idx) => `Q${idx + 1}: ${msg.text}`).join('\n')}

📝 실험 노트:
이 실험에서는 ${experimentData.experiment_title}에 대한 다양한 질문을 통해 
실험 과정을 기록하고 분석했습니다.
      `;
    } else {
      return `
비즈니스 실험 분석 리포트

📋 실험 개요:
- 실험명: ${experimentData.experiment_title}
- 실험 ID: ${experimentData.experiment_id}
- 실험 기간: ${startTime.toLocaleDateString()} ~ ${endTime.toLocaleDateString()}
- 총 소요 시간: ${duration}분

📈 실험 지표:
- 총 상호작용: ${messages.length}회
- 사용자 참여도: ${userMessages.length}회
- 시스템 응답률: ${botMessages.length}회

💼 비즈니스 인사이트:
- 실험 과정에서 발견된 주요 패턴과 트렌드
- 개선이 필요한 영역과 기회 요소
- 향후 실험 계획 수립을 위한 권장사항
      `;
    }
  };

  // 안전 수칙 생성 함수
  const generateSafetyNotes = (type) => {
    if (type === 'personal') {
      return [
        '실험 데이터는 개인 학습 목적으로만 사용하세요',
        '중요한 정보는 별도로 백업해두세요',
        '실험 결과를 바탕으로 추가 연구를 진행하세요'
      ];
    } else {
      return [
        '이 리포트는 비즈니스 의사결정에 활용하세요',
        '데이터 보안 및 개인정보 보호를 준수하세요',
        '정기적인 실험 결과 검토를 권장합니다'
      ];
    }
  };

  // 리포트 삭제 처리 함수
  const handleDeleteReport = () => {
    if (window.confirm('정말로 이 리포트를 삭제하시겠습니까?')) {
      // 실제 API 호출로 교체 예정
      // await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });

      alert('리포트가 삭제되었습니다.');
      navigate('/ReportMain'); // 리포트 목록으로 이동
    }
  };

  // 실험 데이터가 없을 때 안내 메시지
  if (!currentReport && !loading) {
    return (
      <>
        <Header />
        <div className="max-w-[1200px] mx-auto pt-10 pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">
              리포트 데이터가 없습니다.<br />
              실험을 먼저 완료하고 리포트를 생성해 주세요.
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate('/ExperimentMain')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              실험 목록으로 이동
            </button>
          </div>
        </div>
      </>
    );
  }

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-[1200px] mx-auto pt-10 pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">리포트를 불러오는 중...</div>
          </div>
        </div>
      </>
    );
  }

  // currentReport가 없으면 안내 메시지
  if (!currentReport) {
    return (
      <>
        <Header />
        <div className="max-w-[1200px] mx-auto pt-10 pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-red-600">
              리포트를 찾을 수 없습니다.<br />
              올바른 경로로 접근해 주세요.
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => navigate('/ReportMain')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              리포트 목록으로 이동
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        {/* 리포트 제목 및 정보 */}
        <div className="mb-6">
          <h1 className="text-[2.3rem] font-black mb-2 text-left tracking-tight">리포트</h1>
          <h2 className="text-[1.5rem] font-bold text-[#33308B] mb-2">{currentReport.title}</h2>
          <p className="text-[#7B87B8] text-base">생성일시: {currentReport.created_at}</p>
        </div>

        {/* 리포트 항목별 상세 정보 */}
        <section className="bg-[#ecece7] min-h-[560px] rounded-lg p-10 mb-6 relative">
          <div className="bg-[#EDF2FF] min-h-[450px] rounded-lg p-8">
            <div className="mb-8">
              <h3 className="text-[1.2rem] font-bold text-[#1C1C59] mb-4">실험 제목</h3>
              <div className="text-[#333] whitespace-pre-line leading-relaxed text-base mb-6">{currentReport.experiment_data?.experiment_title || '-'}</div>

              <h3 className="text-[1.2rem] font-bold text-[#1C1C59] mb-4">실험 목적</h3>
              <div className="text-[#333] whitespace-pre-line leading-relaxed text-base mb-6">{currentReport.purpose || '실험 목적이 입력되지 않았습니다.'}</div>

              <h3 className="text-[1.2rem] font-bold text-[#1C1C59] mb-4">주의 사항</h3>
              {currentReport.safety_notes && currentReport.safety_notes.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 mb-6">
                  {currentReport.safety_notes.map((note, index) => (
                    <li key={index} className="text-[#856404] text-base">{note}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-[#333] mb-6">주의 사항이 없습니다.</div>
              )}

              <h3 className="text-[1.2rem] font-bold text-[#1C1C59] mb-4">사용 장비</h3>
              <div className="text-[#333] whitespace-pre-line leading-relaxed text-base mb-6">{currentReport.equipment || '사용 장비 정보가 없습니다.'}</div>

              <h3 className="text-[1.2rem] font-bold text-[#1C1C59] mb-4">사용 물질</h3>
              <div className="text-[#333] whitespace-pre-line leading-relaxed text-base mb-6">{currentReport.materials || '사용 물질 정보가 없습니다.'}</div>

              <h3 className="text-[1.2rem] font-bold text-[#1C1C59] mb-4">실험 절차</h3>
              <div className="text-[#333] whitespace-pre-line leading-relaxed text-base mb-6">{currentReport.procedure || '실험 절차 정보가 없습니다.'}</div>

              <h3 className="text-[1.2rem] font-bold text-[#1C1C59] mb-4">실험 요약</h3>
              <div className="text-[#333] whitespace-pre-line leading-relaxed text-base mb-6">{currentReport.summary || '실험 요약 정보가 없습니다.'}</div>
            </div>
          </div>
        </section>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => navigate('/ReportMain')}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
          >
            목록으로
          </button>
          <ReportCancleBtn onClick={handleDeleteReport} />
        </div>
      </div>
    </>
  );
}

export default ReportRead;