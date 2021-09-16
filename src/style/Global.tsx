import { createGlobalStyle } from "styled-components";
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from "cryption-uikit/dist/theme";
import DirtyBg from "images/dirty-white-grunge-texture.png";
import CatCafeTTF from "../fonts/catcafe/CatCafe.ttf";

declare module "styled-components" {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  @font-face{
    font-family: 'Korean';
    src: url(${CatCafeTTF}) format("opentype");
  }
  * {
    font-family: 'Korean';
  }
  body {
    font-family: 'Korean';
    background-image: url(${DirtyBg});

    img {
      height: auto;
      max-width: 100%;
    }
  }
`;

export default GlobalStyle;
