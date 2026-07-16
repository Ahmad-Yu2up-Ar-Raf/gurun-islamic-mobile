// components/ui/fragments/custom-ui/carousel/filter-carousel.tsx
//
// DESAIN KOMPONEN:
//   - Generic `<T>` → works dengan Type enum apapun, bukan hanya dzikir
//   - Controlled component: parent owns state via `selectedValues` + `onChange`
//   - Multi-select: klik filter → toggle masuk/keluar dari array selected
//   - "All" button: klik → reset semua filter (clear selection)
//   - Visual feedback: button selected punya style berbeda
//   - Fully reusable: tinggal pass `options` + `selectedValues` + `onChange`
//
// CONTOH PENGGUNAAN:
//   <FiltersCarousel
//     options={dzikirFilters}
//     selectedValues={selectedTypes}
//     onChange={setSelectedTypes}
//   />

import React, { useCallback } from 'react';
import { ScrollView, Pressable, View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Icon } from '@/components/ui/fragments/shadcn-ui/icon';
import { cn } from '@/lib/utils';
import { LucideIcon, X, XCircleIcon } from 'lucide-react-native';
import { Button } from '@/components/ui/fragments/shadcn-ui/button';

// ─── Public Types (export untuk dipakai di parent) ────────────────────────────

// FilterOption generic: value bisa Type enum, string, number, dll
export interface FilterOption<T = string> {
  label: string;
  value: T | 'all'; // 'all' adalah reserved value untuk "show everything"
  icon?: LucideIcon;
}

export interface FiltersCarouselProps<T> {
  // Daftar pilihan filter yang dirender sebagai button
  options: FilterOption<T>[];

  // Array nilai yang sedang aktif/terpilih — dikelola oleh parent
  selectedValues: T[];

  // Callback saat user toggle filter — parent update state-nya
  onChange: (selected: T[]) => void;

  // Mode multi-select (default: true)
  // Jika false → hanya 1 filter aktif sekaligus (seperti radio button)
  multiSelect?: boolean;

  className?: string;
}

// ─── Komponen ─────────────────────────────────────────────────────────────────

// Generic function component (bukan arrow) agar TypeScript generic bekerja di .tsx
function FiltersCarousel<T>({
  options,
  selectedValues,
  onChange,
  multiSelect = true,
  className,
}: FiltersCarouselProps<T>) {
  // Apakah tidak ada filter aktif (state "All")
  const isAllActive = selectedValues.length === 0;

  // Handler untuk klik filter button
  const handlePress = useCallback(
    (value: T | 'all') => {
      // Klik "All" → reset semua pilihan
      if (value === 'all') {
        onChange([]);
        return;
      }

      if (!multiSelect) {
        // Mode single-select: toggle — jika sudah aktif, klik lagi → deselect (back to All)
        const isCurrentlySelected = selectedValues.includes(value as T);
        onChange(isCurrentlySelected ? [] : [value as T]);
        return;
      }

      // Mode multi-select: toggle value dalam array
      const isSelected = selectedValues.includes(value as T);
      if (isSelected) {
        // Sudah dipilih → hapus dari array
        const next = selectedValues.filter((v) => v !== value);
        onChange(next);
      } else {
        // Belum dipilih → tambah ke array
        onChange([...selectedValues, value as T]);
      }
    },
    [selectedValues, onChange, multiSelect]
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      nestedScrollEnabled // ✅ Wajib di Android: cegah konflik scroll horizontal vs vertical FlatList
      decelerationRate="fast"
      className={cn('w-full pb-3', className)}>
      {options.map((option, index) => {
        // Tentukan apakah button ini dalam state aktif/selected
        const isActive =
          option.value === 'all'
            ? isAllActive // "All" aktif jika tidak ada filter yang dipilih
            : selectedValues.includes(option.value as T);

        return (
          <FilterButton
            key={`filter-${String(option.value)}-${index}`}
            label={option.label}
            icon={option.icon}
            isActive={isActive}
            onPress={() => handlePress(option.value)}
          />
        );
      })}
    </ScrollView>
  );
}

// ─── FilterButton Sub-component ───────────────────────────────────────────────
// Dipisah agar mudah dikustomisasi style-nya tanpa ubah logika carousel

interface FilterButtonProps {
  label: string;
  icon?: LucideIcon;
  isActive: boolean;
  onPress: () => void;
}

function FilterButton({ label, icon, isActive, onPress }: FilterButtonProps) {
  return (
    <Button
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
      className={cn(
        'active:opacity-80',
        isActive
          ? 'h-fit flex-row items-center gap-1.5 rounded-full border border-primary bg-primary px-4 py-2'
          : 'h-fit flex-row items-center gap-1.5 rounded-full border border-border bg-transparent px-4 py-2'
      )}>
      {isActive && label !== 'Semua' && (
        <Icon
          as={XCircleIcon}
          size={15}
          className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
        />
      )}
      <Text
        className={
          isActive
            ? 'font-poppins_semibold text-xs text-primary-foreground'
            : 'font-poppins_medium text-xs text-muted-foreground'
        }>
        {label}
      </Text>
    </Button>
  );
}
// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 12,
    gap: 8,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'hsl(var(--border))',
    backgroundColor: 'transparent',
  },
  buttonActive: {
    // Saat aktif: background primary, border hilang / sama dengan bg
    backgroundColor: 'hsl(var(--primary))',
    borderColor: 'hsl(var(--primary))',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  iconWrapper: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
    lineHeight: 18,
  },
  buttonTextActive: {
    // Sudah di-handle via className di Text component (NativeWind)
  },
});

export default FiltersCarousel;
