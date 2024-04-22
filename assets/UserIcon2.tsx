import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const UserIcon2 = (props: any) => {
  const stroke = props.active ? '#111920' : '#888C90';

  return (
    <Svg
      // xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={22}
      fill="none"
      {...props}>
      <Path
        stroke={stroke}
        strokeWidth={1.5}
        d="M1.25 21h18c0-4.418-4.03-8-9-8s-9 3.582-9 8ZM14.75 5.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
      />
    </Svg>
  );
};
export default UserIcon2;
