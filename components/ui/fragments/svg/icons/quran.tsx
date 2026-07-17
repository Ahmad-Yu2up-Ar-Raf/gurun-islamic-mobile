import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
const QuranIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill={props.fill || '#141B34'} {...props}>
    <Path
      stroke={props.fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m18.398 2.687-.659-1.043c-.364-.577-.546-.865-.785-.892-.238-.027-.505.247-1.038.795-1.722 1.77-3.444 1.508-5.166 4.691-1.722-3.183-3.444-2.921-5.166-4.691-.533-.548-.8-.822-1.038-.795-.239.027-.421.315-.785.892l-.658 1.043c-.255.403-.382.604-.347.816.034.212.217.357.584.648l6.182 4.897c.591.468.887.702 1.228.702.341 0 .637-.234 1.228-.702L18.16 4.15c.367-.29.55-.436.584-.648.035-.212-.092-.413-.346-.816ZM20.75 5.75l-16 12v-4.696m-4-7.304 16 12v-4.696"
    />
  </Svg>
);
export default QuranIcon;
