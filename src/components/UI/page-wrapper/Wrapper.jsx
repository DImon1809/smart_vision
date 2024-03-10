import "./Wrapper.scss";

const Wrapper = ({ wapperActive, onWrapperClickHandler }) => {
  console.log(wapperActive);

  return (
    <div
      className={wapperActive ? "wrapper active" : "wrapper"}
      onClick={onWrapperClickHandler}
    ></div>
  );
};

export default Wrapper;
