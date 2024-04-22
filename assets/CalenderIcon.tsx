import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const CalenderIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}>
    <Path
      stroke="#111920"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M7.997 9h.006m-.006 2.666h.006M10.66 9h.006M5.333 9h.006m-.006 2.666h.006"
    />
    <Path
      stroke="#111920"
      strokeLinejoin="round"
      d="M11.667 1.333V4M4.334 1.333V4M14 2.667H2v12h12v-12Z"
    />
    <Path
      stroke="#111920"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 6h12"
    />
  </Svg>
);
export default CalenderIcon;
