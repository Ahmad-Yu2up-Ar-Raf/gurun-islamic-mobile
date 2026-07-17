import { cn } from '@/lib/utils';
import { Icon } from './icon';
import { Loader2Icon, LucideIcon, LucideProps } from 'lucide-react-native';

type IconProps = LucideProps & {
  as?: LucideIcon;
  className?: string;
};
function Spinner({ className, as, ...props }: IconProps) {
  return (
    <Icon
      as={as ?? Loader2Icon}
      size={20}
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
