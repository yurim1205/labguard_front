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
        <h1 className="text-[2.3rem] font-black mb-9 text-left tracking-tight">매뉴얼</h1>
        <h2 className="text-xl font-bold mb-3 text-left">매뉴얼 등록</h2>
        <p className="text-[#444] text-base mb-9 text-left">
          PDF 형식 매뉴얼을 업로드하면 AI가 핵심 위험 요소와 절차를 요약·분석해줍니다.
        </p>

        {/* 실험 업로드 영역 */}
        <section className="bg-[#ecece7] rounded-lg p-10 mb-10 pt-[24px]">
          <div className="max-w-[520px] mx-auto">
            <div className="border border-dashed border-[#b5b5b5] rounded-lg bg-[#FFFFFF] min-h-[360px] flex flex-col items-center justify-center p-10 text-center gap-3">
              <div className="font-bold text-[1.05rem]">첨부할 파일 드래그</div>
              <div className="text-base text-[#222]">또는</div>
              <label
                htmlFor="file-upload"
                className="inline-block bg-white text-[#234c36] border border-[#234c36] rounded px-6 py-2 font-semibold text-base cursor-pointer transition-colors duration-200 hover:bg-[#234c36] hover:text-white"
              >
                파일 선택
              </label>
              <input id="file-upload" type="file" ref={fileInputRef} className="hidden" />
            </div>

            <div className="text-[#888] text-sm mt-4 text-left leading-6 mt-[12px] mb-10 pt-[12px]">
              · 파일 업로드는 PDF 형식만 가능하며, 용량은 30MB 이하로 제한됩니다.
            </div>
          </div>
        </section>

        {/* 내 매뉴얼 */}
        <section className="mt-14">
          <h2 className="text-xl font-bold mb-3 text-left">내 매뉴얼</h2>
          <div className="flex gap-2 mb-2">
            <button
              className="rounded-t-lg px-9 py-3 font-bold text-[1.05rem] tracking-tight border-none cursor-pointer bg-[#234c36] text-white"
            >
              실험
            </button>
          </div>
          <ul className="bg-white border border-[#b5b5b5] rounded-lg py-2 list-none m-0">
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
