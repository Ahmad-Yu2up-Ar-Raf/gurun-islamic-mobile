import { View } from 'react-native';
import React from 'react';
import { Sura } from '../types/surah-type';
import { BottomSheet, useBottomSheet } from '@/components/ui/fragments/custom-ui/bottom-sheet';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { ChevronDown, Paintbrush } from 'lucide-react-native';

type componentProps = {
  sura: Sura;
  isVisible: boolean;
  close: () => void;
};

export default function SuraMenu({ sura, isVisible, close }: componentProps) {
  return (
    <>
      <BottomSheet isVisible={isVisible} onClose={close} maxSnapPoint={0.9}>
        <View style={{ gap: 16 }}></View>
      </BottomSheet>
    </>
  );
}
