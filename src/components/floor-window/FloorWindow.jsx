import "./FloorWindow.scss";

import close from "../../font/close.png";

const FloorWindow = ({
  setOpenFloorWind,
  floorText,
  floorButton = false,
  confirmDeleteHandler,
}) => {
  const clickCloseHandler = () => setOpenFloorWind(false);

  return (
    <div className="floor-window">
      <img
        src={close}
        alt="#"
        className="floor-window-close"
        onClick={() => {
          confirmDeleteHandler && confirmDeleteHandler(false);
          clickCloseHandler();
        }}
      />
      <div className="floor-window-alert">
        <p>{floorText}</p>
      </div>

      {floorButton && (
        <div
          className="floor-button"
          onClick={() => {
            confirmDeleteHandler && confirmDeleteHandler(true);

            clickCloseHandler();
          }}
        >
          <p>Подтвердить</p>
        </div>
      )}
    </div>
  );
};

export default FloorWindow;
