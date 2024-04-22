import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const VerticalThreeDots = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}>
    <Path
      stroke="#111920"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M11.992 12.634h.009M11.984 18.634h.01M12 6.634h.009"
    />
  </Svg>
);
export default VerticalThreeDots;
