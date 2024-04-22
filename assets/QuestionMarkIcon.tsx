import * as React from 'react';
import Svg, {SvgProps, Circle, Path} from 'react-native-svg';

const QuestionMarkIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}>
    <Circle
      cx={11}
      cy={11}
      r={10}
      stroke="#111920"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      stroke="#111920"
      strokeWidth={1.5}
      d="M8.5 9a2.5 2.5 0 1 1 2.5 2.5v2m0 1.5v1.5"
    />
  </Svg>
);
export default QuestionMarkIcon;
