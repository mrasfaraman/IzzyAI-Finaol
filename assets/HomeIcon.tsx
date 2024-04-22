import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const HomeIcon = (props: any) => {
  const stroke = props.active ? '#111920' : '#888C90';

  return (
    <Svg
      // xmlns="http://www.w3.org/2000/svg"
      width={23}
      height={20}
      fill="none"
      {...props}>
      <Path stroke={stroke} strokeWidth={1.5} d="M19.25 8v11h-15V8" />
      <Path stroke={stroke} strokeWidth={1.5} d="M19.25 9h1.5l-9-8-9 8h1.5" />
      <Path
        stroke={stroke}
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.75 14h.009"
      />
    </Svg>
  );
};
export default HomeIcon;
