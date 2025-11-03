import { CircularProgress } from '@heroui/progress';

const OverlayLoading = ({ visible }: { visible: boolean }): React.JSX.Element => {
  return (
    <div
      className={`${visible ? '' : 'hidden'} fixed left-0 top-0 w-screen h-screen flex items-center justify-center`}
    >
      <div className="opacity-20 bg-black fixed w-full h-full" />
      <CircularProgress
        size="lg"
        color="primary"
        className="z-10"
      />
    </div>
  );
};

export default OverlayLoading;
