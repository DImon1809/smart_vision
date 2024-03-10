import "./LoadingDoughnut.scss";

const LoadingDoughnut = () => {
  return (
    <div className="loading-graph-doughnut">
      <div className="loading-doughnut"></div>
      <div className="loading-doughnut-infomation">
        <div className="loading-red"></div>
        <div className="loading-yellow"></div>
      </div>
    </div>
  );
};

export default LoadingDoughnut;
