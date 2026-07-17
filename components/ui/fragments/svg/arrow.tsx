import * as React from 'react';
import Svg, { SvgProps, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
const ArrowSvg = (props: SvgProps) => (
  <Svg  width={40} height={87} fill="none" {...props}>
    <Path fill="#F7AF5F" d="m21.322 0 10.322 50.873-10.322-2.212L11 50.873 21.322 0Z" />
    <Path fill="url(#a)" d="M21.5 1 32 52l-11-4.594L21.5 1Z" />
    <Circle cx={19.907} cy={67.093} r={19.169} fill="url(#b)" stroke="#fff" strokeWidth={1.475} />
    <Defs>
      <LinearGradient
        id="a"
        x1={21.368}
        x2={20.631}
        y1={-60.008}
        y2={56.483}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F7AF5F" />
        <Stop offset={1} stopColor="#F98C41" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={19.907}
        x2={19.907}
        y1={47.186}
        y2={87}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F3A43B" />
        <Stop offset={1} stopColor="#FD6E41" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default ArrowSvg;
