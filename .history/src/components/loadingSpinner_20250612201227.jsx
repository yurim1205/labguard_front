const DotsSpinner = () => {
    return (
      <div className="flex justify-center items-center gap-2 mt-[-20px]">
        <span className="w-3 h-3 bg-[#33308B] rounded-full animate-bounce [animation-delay:0s]" />
        <span className="w-3 h-3 bg-[#33308B] rounded-full animate-bounce [animation-delay:0.2s]" />
        <span className="w-3 h-3 bg-[#33308B] rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    );
  };
  
  export default DotsSpinner;
  