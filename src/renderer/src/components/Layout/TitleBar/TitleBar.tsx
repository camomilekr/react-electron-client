import './TitleBar.css';

const TitleBar = (): React.JSX.Element => {
  return (
    <div className="title-bar flex items-center justify-center">
      <div className="title-bar-left flex-1">Custom title bar</div>
      <div className="title-bar-right flex items-center justify-center w-[100px] h-[var(--height-title-bar)]" />
    </div>
  );
};

export default TitleBar;
