const DotsSpinner = () => {
    return (
      <div className="flex justify-center items-center gap-2 ">
        <span className="w-3 h-3 bg-[#33308B] rounded-full animate-bounce delay-[0ms]" />
        <span className="w-3 h-3 bg-[#33308B] rounded-full animate-bounce delay-[200ms]" />
        <span className="w-3 h-3 bg-[#33308B] rounded-full animate-bounce delay-[400ms]" />
      </div>
    );
  };
  
  export default DotsSpinner;
  