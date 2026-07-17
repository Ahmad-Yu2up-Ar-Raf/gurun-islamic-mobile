import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const DuaIcon = ({ title, titleId, ...props }: SvgProps & SVGRProps) => (
  <Svg
 
    width={24}
    height={24}
    fill="none"
    aria-labelledby={titleId}
    {...props}>
    {title ? <title id={titleId}>{title}</title> : null}
    <Path
      stroke="#141B34"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m19 13-.658-.658a2 2 0 0 0-2.752-.073l-2.597 2.337a3 3 0 0 0-.993 2.23V21h2.687a3 3 0 0 0 2.204-.965l4.313-4.673A3 3 0 0 0 22 13.327V6h-1a2 2 0 0 0-2 2v5Zm0 0-3 3"
    />
    <Path
      stroke="#141B34"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m5 13 .658-.658a2 2 0 0 1 2.752-.073l2.597 2.337a3 3 0 0 1 .993 2.23V21H9.313a3 3 0 0 1-2.204-.965l-4.313-4.673A3 3 0 0 1 2 13.327V6h1a2 2 0 0 1 2 2v5Zm0 0 3 3"
    />
    <Path
      stroke="#141B34"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M15 7.434A3.23 3.23 0 1 1 10.566 3"
    />
    <Path
      stroke="#141B34"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 4h.009"
    />
  </Svg>
);
export default DuaIcon;
