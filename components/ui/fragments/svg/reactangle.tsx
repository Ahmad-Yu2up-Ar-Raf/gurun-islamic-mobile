import * as React from 'react';
import Svg, { SvgProps, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
const ReactangleSVG = (props: SvgProps) => (
  <Svg width={414} height={358} fill="none" {...props}>
    <Path fill="url(#a)" d="M0 0h416v358H179C80.141 358 0 277.859 0 179V0Z" />
    <Defs>
      <LinearGradient
        id="a"
        x1={598.377}
        x2={77.523}
        y1={434.886}
        y2={29.024}
        gradientUnits="userSpaceOnUse">
        <Stop offset={0.408} stopColor="#BB1624" />
        <Stop offset={0.965} stopColor="#450A00" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default ReactangleSVG;
