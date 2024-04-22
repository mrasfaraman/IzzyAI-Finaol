import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"


const BellIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      fill="#111920"
      d="M16.842 10.491h.75v-.02l-.001-.02-.75.04Zm0 2.509h-.75v.279l.182.211.568-.49ZM19 18v.75h.75V18H19Zm0-2.5h.75a.75.75 0 0 0-.182-.49L19 15.5ZM3.158 10.491l-.749-.04v.04h.75Zm0 2.509.568.49.182-.211V13h-.75ZM1 18H.25v.75H1V18Zm0-2.5-.568-.49a.75.75 0 0 0-.182.49H1Zm9-10.75a6.101 6.101 0 0 1 6.093 5.78l1.498-.078A7.601 7.601 0 0 0 10 3.25v1.5Zm6.092 5.741V13h1.5v-2.509h-1.5Zm.182 3 2.158 2.5 1.136-.981-2.159-2.5-1.135.98ZM18.25 15.5V18h1.5v-2.5h-1.5ZM10 3.25a7.601 7.601 0 0 0-7.59 7.202l1.497.078A6.101 6.101 0 0 1 10 4.75v-1.5Zm-7.592 7.241V13h1.5v-2.509h-1.5ZM1 18.75h18v-1.5H1v1.5Zm1.59-6.24-2.158 2.5 1.136.98 2.158-2.5-1.135-.98ZM.25 15.5V18h1.5v-2.5H.25Z"
    />
    <Path
      stroke="#111920"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.5 2.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM13 18a3 3 0 1 1-6 0"
    />
  </Svg>
)
export default BellIcon
