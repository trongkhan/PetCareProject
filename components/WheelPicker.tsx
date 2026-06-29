import React, { useRef, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

const ITEM_H = 44;

interface Props {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  flex?: number;
}

export function WheelPicker({ items, selectedIndex, onChange, flex = 1 }: Props) {
  const theme = useTheme();
  const ref = useRef<ScrollView>(null);
  // -1 so the mount effect always fires the initial scroll
  const internalIdx = useRef(-1);

  useEffect(() => {
    // Skip if this selectedIndex change came from us (internal scroll)
    if (internalIdx.current === selectedIndex) return;
    internalIdx.current = selectedIndex;
    setTimeout(() => {
      ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
    }, 80);
  }, [selectedIndex]);

  const settle = useCallback((y: number) => {
    const idx = Math.max(0, Math.min(items.length - 1, Math.round(y / ITEM_H)));
    if (idx === internalIdx.current) return;
    internalIdx.current = idx;
    onChange(idx);
    // No scrollTo here — snapToInterval handles snapping, calling scrollTo causes the loop
  }, [items.length, onChange]);

  return (
    <View style={[styles.container, { flex }]}>
      <View
        style={[styles.selector, { borderColor: theme.colors.outlineVariant }]}
        pointerEvents="none"
      />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        onMomentumScrollEnd={e => settle(e.nativeEvent.contentOffset.y)}
        onScrollEndDrag={e => settle(e.nativeEvent.contentOffset.y)}
        contentContainerStyle={styles.content}
      >
        {items.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text
              style={[
                styles.text,
                { color: theme.colors.onSurfaceVariant },
                i === selectedIndex && { color: theme.colors.onSurface, fontWeight: '700', fontSize: 19 },
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: ITEM_H * 5, overflow: 'hidden' },
  selector: {
    position: 'absolute',
    left: 0, right: 0,
    top: ITEM_H * 2,
    height: ITEM_H,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    zIndex: 1,
  },
  content: { paddingVertical: ITEM_H * 2 },
  item: { height: ITEM_H, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 17 },
});
