import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';

// Full-screen branded splash. `contentFit="cover"` fills any screen size
// (SE → Max → iPad) without hardcoding dimensions, so it stays responsive.
// The native launch screen is just the cream background, so this in-app splash
// is the only branded image the user sees — no small-then-large flash.
const splash = require('../assets/images/SENLY.png');

export function AppSplash() {
  return <Image source={splash} style={StyleSheet.absoluteFill} contentFit="cover" />;
}
