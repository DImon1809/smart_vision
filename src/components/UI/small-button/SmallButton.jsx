import "./SmallButton.scss";

import arrowBase from "../../../font/arrow-base.png";
import arrowHead from "../../../font/arrow-head.png";

const SmallButton = ({ children, requestDataForGraphs }) => {
  return (
    <div className="button" onClick={requestDataForGraphs}>
      <p>{children}</p>
      <div className="arrow">
        <img src={arrowBase} alt="#" className="arrow-base" />
        <img src={arrowHead} alt="#" className="arrow-head" />
      </div>
    </div>
  );
};

export default SmallButton;
