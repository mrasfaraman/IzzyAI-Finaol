import * as React from 'react';
import Svg, {SvgProps, G, Path} from 'react-native-svg';

const UserIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={17}
    fill="#000"
    style={{marginLeft: 10}}
    stroke="currentColor"
    strokeWidth={1}
    viewBox="0 0 24 24"
    {...props}>
    <G stroke="#111920">
      <Path d="M17.438 21.937H6.562a2.5 2.5 0 0 1-2.5-2.5v-.827c0-3.969 3.561-7.2 7.938-7.2s7.938 3.229 7.938 7.2v.827a2.5 2.5 0 0 1-2.5 2.5ZM12 12.412c-3.826 0-6.938 2.78-6.938 6.2v.827a1.5 1.5 0 0 0 1.5 1.5h10.876a1.5 1.5 0 0 0 1.5-1.5v-.829c0-3.418-3.112-6.198-6.938-6.198ZM12 9.911a3.924 3.924 0 1 1 3.923-3.924A3.927 3.927 0 0 1 12 9.911Zm0-6.847a2.924 2.924 0 1 0 2.923 2.923A2.926 2.926 0 0 0 12 3.064Z" />
    </G>
  </Svg>
);
export default UserIcon;
