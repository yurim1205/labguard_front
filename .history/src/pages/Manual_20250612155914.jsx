import { useRef, useState } from 'react';
import { FaFlask } from 'react-icons/fa';
import Header from '../components/Header';

function Manual() {
  const fileInputRef = useRef();

  // 더미 매뉴얼 데이터
  const manuals = [
    { name: '고효율 촉매 및 전극 개발 실험 매뉴얼', date: '25/05/23 11:54:27' },
    { name: '수소/산소 발생 전극의 열화 대응 소재 발굴 실험 매뉴얼', date: '25/05/26 18:02:36' },
  ];

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">매뉴얼</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">매뉴얼 등록</h2>
            <p className="text-[#7B87B8] text-base text-left mt-[-10px]">
              PDF 형식 매뉴얼을 업로드하면 AI가 핵심 위험 요소와 절차를 요약·분석해줍니다.
            </p>


        {/* 실험 업로드 영역 */}
        <section className="bg-[#ecece7] rounded-lg p-10 mb-10 pt-[24px]">
          <div className="max-w-[520px] mx-auto">
          <div className="border border-dashed border-[#b5b5b5] rounded-lg bg-[#FFFFFF] shadow-[0_6px_12px_0_rgba(128,128,128,0.28)] min-h-[360px] flex flex-col items-center justify-center p-10 text-center gap-4">
            <div className="font-[600] text-[#0E467B] text-lg">첨부할 파일 놓기</div>
            <div className="text-base text-[#798483]">또는</div>
            <label
              htmlFor="file-upload"
              className="rounded-[3px] shadow-[0_6px_12px_0_rgba(128,128,128,0.28)] inline-block bg-white text-[#0E467B] border border-[#0E467B] rounded px-6 py-2 font-semibold text-base cursor-pointer transition-colors duration-200 hover:text-white"
            >
              파일 선택
            </label>
            <input id="file-upload" type="file" ref={fileInputRef} className="hidden" />
          </div>

          <ul className="text-[#888] text-[14px] mt-4 mb-6 list-disc pl-5">
  <li className="text-left">
    파일 업로드는 PDF 형식만 가능하며, 용량은 30MB 이하로 제한됩니다.
  </li>
</ul>

          </div>
        </section>

        {/* 내 매뉴얼 */}
        <section className="mt-[48px]">
          <h2 className="text-[20px] font-bold mb-3 text-left font-[500]">내 매뉴얼</h2>

          {/* 탭 */}
          <div className="flex">
            <button
              className="rounded-t-lg px-9 py-3 font-bold text-[1.05rem] tracking-tight bg-[#234c36] text-white border border-[#b5b5b5] border-b-0"
            >
              실험
            </button>
          </div>

          {/* 리스트 박스 */}
          <ul className="bg-white border border-[#b5b5b5] rounded-b-lg rounded-t-none py-2 list-none m-0">
            {manuals.map((m, i) => (
              <li
                key={i}
                className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 text-[1.05rem]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#234c36] text-[1.3rem]">
                    <FaFlask />
                  </span>
                  <span className="text-[#234c36] font-bold">{m.name}</span>
                </div>
                <span className="text-[#888] text-[0.98rem]">{m.date}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default Manual;