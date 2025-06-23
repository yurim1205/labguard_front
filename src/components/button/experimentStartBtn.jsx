import React from "react";

function ExperimentStartBtn({ children = "실험 시작", onClick, ...props }) {
    return (
        <button
            onClick={onClick}
            className="bg-[#565991] hover:bg-[#4071c7] w-[146px] h-[48px] mt-[80px] text-[#ffffff] 
            font-medium py-3 rounded-full transition text-[16px] border-none shadow-[0_12px_24px_0_rgba(128,128,128,0.5)]"
        >
            {children}
        </button>
    );
}

export default ExperimentStartBtn;