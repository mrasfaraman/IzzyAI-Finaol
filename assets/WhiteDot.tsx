import * as React from 'react';
import Svg, {SvgProps, Circle} from 'react-native-svg';
const WhiteDot = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={5}
    height={4}
    fill="none"
    style={props.style}
    {...props}>
    <Circle cx={2.82} cy={2} r={2} fill="#111920" opacity={0.2} />
  </Svg>
);
export default WhiteDot;
