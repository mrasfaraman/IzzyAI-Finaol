import * as React from 'react';
import Svg, {SvgProps, Rect} from 'react-native-svg';

const WideDot = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={4}
    fill="none"
    style={{marginVertical: 10}}
    {...props}>
    <Rect
      width={22.938}
      height={3.277}
      x={0.531}
      y={0.647}
      fill="#D9D9D9"
      rx={1.638}
    />
  </Svg>
);
export default WideDot;
