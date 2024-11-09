import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
    * {
        box-sizing: border-box;
    }
    body {
        color: rgb(240,240,240);
        background: #1a1a1a;
        font-family: 'Noto Sans', sans-serif;
        font-size: 1.6rem;
        height: 100%;
        width: 100%;
        display: inline;
        text-align: center;
  }
`

export default GlobalStyles