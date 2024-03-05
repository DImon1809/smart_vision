import "./FloorWindow.scss";

import close from "../../font/close.png";

const FloorWindow = ({ setOpenFloorWind, floorText }) => {
  const clickCloseHandler = () => setOpenFloorWind(false);

  return (
    <div className="floor-window">
      <img
        src={close}
        alt="#"
        className="floor-window-close"
        onClick={clickCloseHandler}
      />
      <div className="floor-window-alert">
        <p>{floorText}</p>
      </div>
    </div>
  );
};

export default FloorWindow;
