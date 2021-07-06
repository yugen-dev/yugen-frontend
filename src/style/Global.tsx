import { createGlobalStyle } from "styled-components";
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from "cryption-uikit/dist/theme";
import WavehausOTF from "../fonts/wavehaus/Wavehaus-66Book.otf";

declare module "styled-components" {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  @font-face{
    font-family: 'Wavehaus';
    src: url(${WavehausOTF}) format("opentype");
  }
  * {
    font-family: 'Wavehaus';
  }
  body {
    font-family: 'Wavehaus';
    background-color: #100C18;

    img {
      height: auto;
      max-width: 100%;
    }
  }
`;

export default GlobalStyle;
