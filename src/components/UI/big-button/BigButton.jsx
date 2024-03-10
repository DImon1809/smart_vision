import "./BigButton.scss";

import arrowBase from "../../../font/arrow-base.png";
import arrowHead from "../../../font/arrow-head.png";

const BigButton = ({ onClickHandler, children }) => {
  return (
    <div className="big-button" onClick={onClickHandler}>
      <p>{children}</p>
      <div className="arrow">
        <img src={arrowBase} alt="#" className="arrow-base" />
        <img src={arrowHead} alt="#" className="arrow-head" />
      </div>
    </div>
  );
};

export default BigButton;
