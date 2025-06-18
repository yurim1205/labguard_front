import '../../loader.css'; // 경로는 프로젝트 구조에 따라 조정

const DotsSpinner = () => {
  return (
    <div className="flex justify-center items-center mt-6">
      <div className="loader">Loading...</div>
    </div>
  );
};

export default DotsSpinner;