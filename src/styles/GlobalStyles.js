import { css } from '@emotion/react';

export const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }

  section {
    padding: 100px 0;
    background: transparent;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .section-title {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 60px;
    background: linear-gradient(45deg, #2563eb, #1d4ed8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`; 