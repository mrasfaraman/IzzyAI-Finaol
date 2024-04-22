import * as React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';

const Bar = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={5}
    fill="none"
    style={{marginLeft: 10}}
    {...props}>
    <Rect
      width={108.667}
      height={4}
      x={0.667}
      y={0.534}
      fill="#111920"
      opacity={0.1}
      rx={2}
    />
  </Svg>
);
export default Bar;
