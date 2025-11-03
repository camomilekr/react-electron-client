import { IconName } from '@/types/components/icon';
import * as HeroIcons from '@heroicons/react/24/solid';

export interface IconProps {
  iconName: IconName;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Icon = ({ iconName, className, onClick }: IconProps): React.JSX.Element => {
  const InnerIcon = HeroIcons[iconName!];

  if (!InnerIcon) {
    return <></>;
  }

  return (
    <>
      <div onClick={onClick}>
        <InnerIcon className={className} />
      </div>
    </>
  );
};

export default Icon;
