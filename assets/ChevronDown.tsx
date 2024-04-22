import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const ChevronDownIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={9}
    fill="none"
    {...props}>
    <Path
      stroke="#111920"
      strokeLinecap="round"
      strokeWidth={2}
      d="m1 1.534 6 6 6-6"
    />
  </Svg>
);
export default ChevronDownIcon;
