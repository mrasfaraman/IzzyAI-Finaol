import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const ChevronDownWhite = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={10}
    height={6}
    fill="none"
    {...props}>
    <Path stroke="#fff" strokeWidth={1.5} d="m1 1.105 3.79 3.79 3.79-3.79" />
  </Svg>
);
export default ChevronDownWhite;
