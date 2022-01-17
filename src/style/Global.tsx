import { createGlobalStyle } from "styled-components";
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from "yugen-uikit/dist/theme";
import CatCafeTTF from "../fonts/catcafe/CatCafe.ttf";

declare module "styled-components" {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  @font-face{
    font-family: 'Korean';
    src: url(${CatCafeTTF}) format("opentype");
    font-display: swap;
  }
  * {
    font-family: 'Korean';
    font-display: swap;
  }
  body {
    font-family: 'Korean';
    background-image: url("/images/dirty-white-bg.jpg");

    img {
      height: auto;
      max-width: 100%;
    }
  }
  @supports (
  background-image: -webkit-image-set(url("/images/dirty-white-bg.webp"))
) {
  body {
    background-image: -webkit-image-set(url("/images/dirty-white-bg.webp"));
  }
}
`;

export default GlobalStyle;
