// Manual.jsx: 이미지와 완전히 동일하게 매뉴얼 등록 화면 구현
import { useRef, useState } from 'react';
import { FaFlask } from 'react-icons/fa';

function Manual() {
  // 탭 상태
  const [tab, setTab] = useState('실험');
  const [myTab, setMyTab] = useState('실험');
  const [input, setInput] = useState('');
  const fileInputRef = useRef();

  // 더미 매뉴얼 데이터 (이미지와 동일)
  const manuals = [
    { name: '고효율 촉매 및 전극 개발 실험 매뉴얼', date: '25/05/17 13:43:25' },
    { name: '수소/산소 발생 전극의 열화 대응 소재 발굴 실험 매뉴얼', date: '25/05/17 13:43:25' },
  ];

  // 탭별 placeholder
  const placeholders = {
    '실험': '실험명을 입력해주세요.',
    '장비': '장비명을 입력해주세요.',
    '화학물질': '화학물질명을 입력해주세요.'
  };

  return (
    <div className="max-w-[1200px] mx-auto pt-10 pb-12">
      <h1 className="text-[2.3rem] font-black mb-9 text-left tracking-tight">매뉴얼</h1>
      <h2 className="text-xl font-bold mb-3 text-left">매뉴얼 등록</h2>
      <p className="text-[#444] text-base mb-9 text-left">PDF 형식 매뉴얼을 업로드하면 AI가 핵심 위험 요소와 절차를 요약·분석해줍니다.</p>
      <div className="flex gap-2 mb-6">
        {['실험', '장비', '화학물질'].map((t) => (
          <button
            key={t}
            className={`rounded-t-lg px-9 py-3 font-bold text-[1.05rem] tracking-tight border-none cursor-pointer ${tab === t ? 'bg-[#234c36] text-white' : 'bg-[#e9ecef] text-[#234c36]'}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {tab === '실험' ? (
        <section className="bg-[#ecece7] rounded-lg p-10 mb-10">
          <div className="border border-dashed border-[#b5b5b5] rounded-lg bg-white min-h-[220px] flex flex-col items-center justify-center p-10 max-w-[520px] mx-auto">
            <div className="font-bold text-[1.05rem] mb-5">첨부파일 파일 넣기</div>
            <div className="text-base text-[#222] mb-5">또는</div>
            <label htmlFor="file-upload" className="inline-block bg-white text-[#234c36] border border-[#234c36] rounded px-6 py-2 font-semibold text-base cursor-pointer mt-2 transition-colors duration-200 hover:bg-[#234c36] hover:text-white">파일 선택</label>
            <input id="file-upload" type="file" ref={fileInputRef} className="hidden" />
          </div>
          <div className="text-[#888] text-sm mt-5 text-left leading-6">
            · 파일 업로드는 PDF 형식만 가능하며, 용량은 30MB 이하로 제한됩니다.<br />
            · 파일 업로드 시 바로 분석이 시작됩니다.
          </div>
        </section>
      ) : (
        <div className="flex items-center gap-2 my-10">
          <input
            className="flex-1 px-4 py-3 border border-[#d0d7d9] rounded-lg text-base bg-white"
            placeholder={placeholders[tab]}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button className="px-6 py-3 text-base font-bold rounded-lg bg-[#234c36] text-white cursor-pointer transition-colors duration-200 hover:bg-[#183324]">입력</button>
        </div>
      )}
      <section className="mt-14">
        <h2 className="text-xl font-bold mb-3 text-left">내 매뉴얼</h2>
        <div className="flex gap-2 mb-2">
          {['실험', '장비', '화학물질'].map((t) => (
            <button
              key={t}
              className={`rounded-t-lg px-9 py-3 font-bold text-[1.05rem] tracking-tight border-none cursor-pointer ${myTab === t ? 'bg-[#234c36] text-white' : 'bg-[#e9ecef] text-[#234c36]'}`}
              onClick={() => setMyTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <ul className="bg-white border border-[#b5b5b5] rounded-lg py-2 list-none m-0">
          {manuals.map((m, i) => (
            <li key={i} className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 text-[1.05rem]">
              <div className="flex items-center gap-3">
                <span className="text-[#234c36] text-[1.3rem]"><FaFlask /></span>
                <span className="text-[#234c36] font-bold">{m.name}</span>
              </div>
              <span className="text-[#888] text-[0.98rem]">{m.date}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Manual; 