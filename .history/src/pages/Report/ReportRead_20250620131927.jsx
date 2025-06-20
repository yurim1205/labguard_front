import { useRef, useState } from 'react';
import Header from '../../components/Header';
import UploadCancleBtn from '../../components/button/UploadCancleBtn';
import DangerResultBtn from '../../components/button/dangerResultBtn';
import ManualUpdateBtn from '../../components/button/manualUpdateBtn';
import ManualUpdateModal from '../../components/modal/manualUpdateModal';

function ReportRead() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto pt-10 pb-12">
        <h1 className="text-[2.3rem] font-black mb-[30px] text-left tracking-tight">리포트</h1>
        <h2 className="text-[20px] font-bold text-left font-[500] mb-0">매뉴얼 등록</h2>

        <section className="bg-[#ecece7] h-[560px] rounded-lg p-10 mb-10 pt-[24px] px-[100px] relative">
          <section className="bg-[#EDF2FF] h-[450px] rounded-lg p-10 mb-10 pt-[24px]"></section>

          <div className="absolute bottom-5 right-[100px]">
            <div className="flex gap-[10px]">
             이 자리에 버튼 넣음 돼 언니 
            </div>
          </div>
        </section>
      </div>

      {showModal && (
        <ManualUpdateModal
          onClose={() => setShowModal(false)}
          onStart={handleStartExperiment}
        />
      )}
    </>
  );
}

export default ReportRead;