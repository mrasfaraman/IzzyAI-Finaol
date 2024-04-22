import * as React from 'react';
import Svg, {SvgProps, G, Path, Defs, ClipPath} from 'react-native-svg';

const GoogleIcon = (props: SvgProps) => (
  <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={25}
    fill="none"
    {...props}>
    <G clipPath="url(#a)">
      <Path
        fill="#3878E5"
        d="M24.266 12.81c0-.815-.066-1.635-.207-2.437H12.74v4.62h6.482a5.555 5.555 0 0 1-2.399 3.647v2.998h3.867c2.271-2.09 3.576-5.176 3.576-8.827Z"
      />
      <Path
        fill="#34A853"
        d="M12.74 24.535c3.237 0 5.966-1.062 7.955-2.897l-3.867-2.998c-1.076.732-2.465 1.146-4.083 1.146-3.131 0-5.786-2.112-6.738-4.951h-3.99v3.09a12.002 12.002 0 0 0 10.723 6.61Z"
      />
      <Path
        fill="#FBBC04"
        d="M6.003 14.835a7.188 7.188 0 0 1 0-4.595V7.15H2.017a12.01 12.01 0 0 0 0 10.776l3.986-3.091Z"
      />
      <Path
        fill="#FC4343"
        d="M12.74 5.284a6.52 6.52 0 0 1 4.603 1.8l3.427-3.427A11.533 11.533 0 0 0 12.74.535 11.998 11.998 0 0 0 2.017 7.15l3.986 3.091c.948-2.844 3.606-4.956 6.737-4.956Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.5.534h24v24H.5z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default GoogleIcon;
