import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DangerResultBtn = ({ manual_id }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRiskAnalysis = async () => {
    if (!manual_id) {
      alert('매뉴얼 ID가 없습니다.');
      return;
    }

    setLoading(true);

    try {
      console.log('🔍 위험 분석 요청 시작:', manual_id);
      
      const response = await fetch('/api/manual-analyze/analyze-risks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manual_id: manual_id }),
        credentials: 'include',
      });

      console.log('🔍 위험 분석 응답 상태:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          alert('로그인이 필요하거나 로그인이 만료되었습니다. 다시 로그인해주세요.');
          navigate('/login');
          return;
        }
        
        let errorMessage = `위험 분석 실패: HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('🔍 위험 분석 에러 상세:', errorData);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (jsonError) {
          console.error('🔍 에러 응답 파싱 실패:', jsonError);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('🔍 위험 분석 응답 데이터:', data);

      // 성공 응답 확인
      if (data.success) {
        console.log('🔍 위험 분석 성공, 결과 페이지로 이동');
        navigate('/RiskAnalyzeResult', { state: data });
      } else {
        throw new Error(data.message || '위험 분석에 실패했습니다.');
      }

    } catch (error) {
      console.error('🔍 위험 분석 오류:', error);
      
      // 네트워크 오류 처리
      if (error.message === 'Failed to fetch') {
        alert('서버에 연결할 수 없습니다. 백엔드 서버가 실행중인지 확인해주세요.');
      } else {
        alert(`위험 분석 실패: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRiskAnalysis}
      disabled={loading}
      className={`px-[10px] py-[7px] mt-[10px] border border-gray-[10px] rounded-[10px] text-[#1C1C59]
       font-[700] text-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.12)] transition duration-200 cursor-pointer
       ${loading 
         ? 'bg-gray-200 cursor-not-allowed' 
         : 'bg-white hover:bg-gray-100'
       }`}
    >
      {loading ? '분석 중...' : '위험도 분석'}
    </button>
  );
};

export default DangerResultBtn;