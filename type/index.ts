import { LucideIcon } from 'lucide-react-native';

export interface MenuDetail {
  icon?: LucideIcon;
  Label: string;
  onPress?: () => void;
  Value?: string | number;
  rigthComponent?: React.ReactNode;
}
