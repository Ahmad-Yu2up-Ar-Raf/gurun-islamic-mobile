import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import Svg, { SvgProps, G, Defs, Path } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */
const Meccah = (props: SvgProps) => {
  const { colorScheme } = useColorScheme();
  const currentTheme = colorScheme ?? 'light';
  const mutedForeground = THEME[currentTheme].mutedForeground;
  const backgroundColor = THEME[currentTheme].background;

  return (
    <Svg
      id="Layer_1"
      data-name="Layer 1"
      viewBox="0 0 24 24"
      stroke={backgroundColor}
      fill={props.fill ?? mutedForeground}
      width={21}
      height={21}
      opacity={currentTheme == 'light' ? 0.4 : 0.6}
      {...props}>
      <G stroke={backgroundColor} fill={props.fill ?? mutedForeground} id="SVGRepo_iconCarrier">
        <Defs></Defs>
        <Path d="M.5 21.58h23M2.42 2.42h19.17v19.17H2.42zM2.42 6.25h19.16" />
        <Path d="M7.21 14.88H12v6.71H7.21zM6.25 10.08h1.92M15.83 10.08h1.92M10.08 10.08h3.84M2.42 10.08h2.87M18.71 10.08h2.87" />
      </G>
    </Svg>
  );
};
export default Meccah;
