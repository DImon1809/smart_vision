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
      <p>{floorText}</p>
    </div>
  );
};

export default FloorWindow;
