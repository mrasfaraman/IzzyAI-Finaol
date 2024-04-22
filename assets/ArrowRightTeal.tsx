import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const ArrowRightTeal = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={16}
    fill="none"
    {...props}>
    <Path
      fill="url(#a)"
      d="M1.12 7a1 1 0 0 0 0 2V7Zm16.587 1.707a1 1 0 0 0 0-1.414L11.343.929A1 1 0 1 0 9.93 2.343L15.586 8l-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364ZM1.12 9H17V7H1.12v2Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={1.486}
        x2={1.611}
        y1={8.03}
        y2={9.984}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#0CC8E8" />
        <Stop offset={1} stopColor="#2DEEAA" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default ArrowRightTeal;
