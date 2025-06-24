import { useRef, useState } from 'react';
import Header from '../../components/Header';
import ReportCancleBtn from '../../components/button/reportCancleBtn';

function ReportRead() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">리포트</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">매뉴얼 등록</h2>

        <section className="bg-[#ecece7] h-[560px] rounded-lg p-10 mb-10 pt-[24px] px-[100px] relative">
          {/* <section className="bg-[#EDF2FF] h-[450px] rounded-lg p-10 mb-10 pt-[24px]"></section> */}

        </section>
        <div className="absolute bottom-5 right-[100px]">
            <div className="flex gap-[10px]">
              <ReportCancleBtn />
            </div>
          </div>
      </div>
    </>
  );
}

export default ReportRead;