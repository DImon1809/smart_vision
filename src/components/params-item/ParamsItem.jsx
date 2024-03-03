import "./ParamsItem.scss";

import close from "../../font/close.png";

const ParamsItem = ({ children }) => {
  return (
    <div className="param-item">
      <img src={close} alt="#" className="close" />
      <div className="param-infomation-wrapper">
        <div className="param-text-wrapper">
          <div className="param-title-wrapper">
            <p className="param-number">1.</p>
            <p className="param-title">Тест сайта</p>
          </div>
          <div className="param-value-wrapper">
            <p className="param-value">http://45.9.40.156:4000/</p>
          </div>
        </div>

        <div className="circle-param-item">ОК</div>
      </div>
      {children}
    </div>
  );
};

export default ParamsItem;
