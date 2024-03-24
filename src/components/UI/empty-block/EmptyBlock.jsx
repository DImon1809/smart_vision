import "./EmptyBlock.scss";

const EmptyBlock = ({ children }) => {
  return (
    <div className="param-alert">
      <h3 style={{ margin: 0 }}>{children}</h3>
    </div>
  );
};

export default EmptyBlock;
