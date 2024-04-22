import * as React from 'react';
import Svg, {
  SvgProps,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const GradientChevronRight = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={9}
    height={14}
    fill="none"
    {...props}>
    <Path
      stroke="url(#a)"
      strokeWidth={1.5}
      d="M1.025 12.975 7 7 1.025 1.025"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={1.204}
        x2={10.53}
        y1={12.699}
        y2={7.968}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#0CC8E8" />
        <Stop offset={1} stopColor="#2DEEAA" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default GradientChevronRight;
