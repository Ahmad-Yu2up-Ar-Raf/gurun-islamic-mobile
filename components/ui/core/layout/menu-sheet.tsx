// components/ui/core/layout/menu-sheet.tsx
//
// ✅ Self-contained drawer trigger.
// Tidak perlu props apapun dari header.
// DrawerActions.openDrawer() bubble up ke Drawer navigator
// terdekat di atas tree — works dari (tabs), doa, maupun article.

import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { Icon } from '../../fragments/shadcn-ui/icon';
import { MenuIcon } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from 'expo-router/react-navigation';

export function MenuSheet() {
  const navigation = useNavigation();

  return (
    <Button
      variant="ghost"
      size="icon"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <Icon as={MenuIcon} className="size-5" />
    </Button>
  );
}
