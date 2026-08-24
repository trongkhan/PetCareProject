import React, { useMemo } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SegmentedButtons, useTheme } from 'react-native-paper';

type Buttons = React.ComponentProps<typeof SegmentedButtons>['buttons'];

interface Props {
  value: string;
  onValueChange: (value: string) => void;
  buttons: Buttons;
  style?: StyleProp<ViewStyle>;
}

/**
 * SegmentedButtons with the selected segment recoloured to the primary (teal)
 * container. Paper defaults to secondaryContainer, which in this app is peach —
 * that made "selected" read in a different colour from every other selected
 * state (chips, tabs, CTAs). Wrapping it here keeps the rule in one place.
 */
export function SegmentedControl({ value, onValueChange, buttons, style }: Props) {
  const theme = useTheme();

  const segmentedTheme = useMemo(
    () => ({
      colors: {
        secondaryContainer: theme.colors.primaryContainer,
        onSecondaryContainer: theme.colors.onPrimaryContainer,
      },
    }),
    [theme],
  );

  return (
    <SegmentedButtons
      style={style}
      value={value}
      onValueChange={onValueChange}
      buttons={buttons}
      theme={segmentedTheme}
    />
  );
}
