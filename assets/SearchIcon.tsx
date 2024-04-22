import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';

const SearchIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={23}
    height={22}
    style={{marginLeft: 10}}
    fill="none"
    {...props}>
    <Path
      stroke="#111920"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m17 16.5 4.5 4.5M19.5 10a9 9 0 1 0-18 0 9 9 0 0 0 18 0Z"
    />
  </Svg>
);
export default SearchIcon;
