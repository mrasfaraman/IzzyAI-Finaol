import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
const UserBioIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={20}
    fill="none"
    {...props}>
    <Path
      stroke="#111920"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13 7h5M13 10.5h3M1 1.5h20v17H1v-17Z"
    />
    <Path
      stroke="#111920"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 14.5c1.208-2.581 5.712-2.751 7 0m-1.5-7a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
    />
  </Svg>
);
export default UserBioIcon;
