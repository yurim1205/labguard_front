import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import personalIcon from '../../assets/img/equipment.png';
import businessIcon from '../../assets/img/experiment.png';

function ExperimentEnd() {
    const location = useLocation();
    const navigate = useNavigate();
    const [experimentData, setExperimentData] = useState(null);

    useEffect(() => {
        // ExperimentChat에서 전달받은 데이터 확인
        if (location.state?.experimentData) {
            setExperimentData(location.state.experimentData);
        } else {
            // 데이터가 없으면 실험 메인 페이지로 이동
            alert('실험 데이터가 없습니다. 실험을 다시 시작해주세요.');
            navigate('/experiment');
        }
    }, [location.state, navigate]);

    const handleReportTypeSelect = (type) => {
        console.log('선택된 리포트 유형:', type);

        // ReportRead 페이지로 이동하면서 데이터 전달
        navigate('/report/read', {
            state: {
                experimentData: experimentData,
                reportType: type
            }
        });
    };

    const handleBackToExperiment = () => {
        // 실험 채팅 페이지로 돌아가기
        navigate('/experiment');
    };

    if (!experimentData) {
        return (
            <>
                <Header />
                <div className="max-w-[1200px] mx-auto pt-10 pb-12">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">데이터를 불러오는 중...</div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="max-w-[1200px] mx-auto pt-10 pb-12">
                {/* 헤더 섹션 */}
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-[2.5rem] font-black text-gray-800 mb-4"
                    >
                        실험 완료! 🎉
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-[1.2rem] text-gray-600 mb-2"
                    >
                        "{experimentData.experiment_title}" 실험이 성공적으로 완료되었습니다
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-gray-500"
                    >
                        원하는 방식의 리포트 유형을 선택해주세요
                    </motion.p>
                </div>

                {/* 실험 요약 정보 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200"
                >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 실험 요약</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {experimentData.messages?.length || 0}
                            </div>
                            <div className="text-gray-600">총 메시지</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {experimentData.messages?.filter(msg => msg.sender === 'user').length || 0}
                            </div>
                            <div className="text-gray-600">사용자 질문</div>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                {experimentData.messages?.filter(msg => msg.sender === 'bot' || msg.sender === 'ai').length || 0}
                            </div>
                            <div className="text-gray-600">AI 응답</div>
                        </div>
                    </div>
                </motion.div>

                {/* 리포트 유형 선택 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mb-8"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        리포트 유형 선택
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 max-w-none mx-auto min-h-[320px]">
                        {/* 개인 리포트 */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 border-r-0 md:border-r-2 border-blue-200 rounded-none md:rounded-l-xl p-8 text-center hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[320px]"
                            onClick={() => handleReportTypeSelect('personal')}
                            style={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem' }}
                        >
                            <img src={personalIcon} alt="개인 리포트" className="w-20 h-20 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">개인</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                개인 학습과 실험 기록을 위한 상세한 리포트입니다.
                                실험 과정, 질문과 답변, 개인적인 노트를 포함합니다.
                            </p>
                            <div className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200">
                                개인 리포트 생성
                            </div>
                        </motion.div>

                        {/* 비즈니스 리포트 */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-emerald-100 border-l-0 md:border-l-2 border-green-200 rounded-none md:rounded-r-xl p-8 text-center hover:border-green-400 hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[320px]"
                            onClick={() => handleReportTypeSelect('business')}
                            style={{ borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem' }}
                        >
                            <img src={businessIcon} alt="비지니스 리포트" className="w-20 h-20 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">비지니스</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                비즈니스 분석과 의사결정을 위한 전문적인 리포트입니다.
                                실험 지표, 분석 결과, 비즈니스 인사이트를 제공합니다.
                            </p>
                            <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200">
                                비즈니스 리포트 생성
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* 하단 버튼 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="text-center"
                >
                    <button
                        onClick={handleBackToExperiment}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg"
                    >
                        ← 실험으로 돌아가기
                    </button>
                </motion.div>
            </div>
        </>
    );
}

export default ExperimentEnd; 