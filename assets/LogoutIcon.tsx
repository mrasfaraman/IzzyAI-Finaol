import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const LogoutIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}>
    <Path
      stroke="#FC4343"
      strokeWidth={1.5}
      d="M14 3.095A10.312 10.312 0 0 0 12.6 3C7.298 3 3 7.03 3 12s4.298 9 9.6 9c.476 0 .943-.032 1.4-.095M21 12H11m10 0-3-3m3 3-3 3"
    />
  </Svg>
);
export default LogoutIcon;
