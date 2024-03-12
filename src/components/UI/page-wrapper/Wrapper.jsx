import "./Wrapper.scss";

const Wrapper = ({ wapperActive, onWrapperClickHandler }) => {
  return (
    <div
      className={wapperActive ? "wrapper active" : "wrapper"}
      onClick={onWrapperClickHandler}
    ></div>
  );
};

export default Wrapper;
