import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const EmailIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={17}
    style={{marginLeft: 10}}
    fill="none"
    {...props}>
    <Path
      stroke="#111920"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M.667 1.451h16.666v14.167H.667V1.45Z"
    />
    <Path
      stroke="#111920"
      strokeWidth={1.25}
      d="M.667 4.368 9 8.534l8.333-4.166"
    />
  </Svg>
);
export default EmailIcon;
