import * as React from 'react';
import Svg, { SvgProps, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
const PollyGon = (props: SvgProps) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={15} height={13} fill="none" {...props}>
    <Path
      fill="url(#a)"
      d="M8.405 12.334c-.484.843-1.699.846-2.187.005L.173 1.926A1.263 1.263 0 0 1 1.262.029L13.303 0a1.263 1.263 0 0 1 1.098 1.892L8.405 12.334Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={7.271}
        x2={7.316}
        y1={-4.725}
        y2={14.231}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#F49C3C" />
        <Stop offset={1} stopColor="#FC7540" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default PollyGon;
