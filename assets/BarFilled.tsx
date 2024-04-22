import * as React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';

const BarFilled = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={60}
    height={5}
    fill="none"
    {...props}>
    <Rect width={108.667} height={4} y={0.534} fill="#111920" rx={2} />
  </Svg>
);
export default BarFilled;
