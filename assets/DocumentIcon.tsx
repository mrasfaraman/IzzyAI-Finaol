import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const DocumentIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={15}
    fill="none"
    {...props}>
    <Path
      stroke="#111920"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.667 14.166V3.5H1.333v10.666h9.334Z"
    />
    <Path
      stroke="#111920"
      strokeLinejoin="round"
      d="M6.667 3.5V.833h8v9.334h-4M4 7.5h2.667M4 10.833h4M6.667.833l4 2.667"
    />
  </Svg>
);
export default DocumentIcon;
