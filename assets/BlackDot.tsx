import * as React from 'react';
import Svg, {SvgProps, Circle} from 'react-native-svg';
const BlackDot = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={5}
    height={4}
    style={props.style}
    fill="none"
    {...props}>
    <Circle cx={2.82} cy={2} r={2} fill="#111920" />
  </Svg>
);
export default BlackDot;
