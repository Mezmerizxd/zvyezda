import { colorH2A } from '../lib/utils';

const theme: Zvyezda.Client.Styled.Theme = {
  colors: {
    primary: {
      hex: '#000000',
    },
    secondary: {
      hex: '#ffffff',
    },
    accent: {
      hex: '#00ffa6',
    },
    accentDarken: {
      hex: '#00DF91',
    },
    error: {
      hex: '#3F2323',
    },
    background: {
      hex: '#262929',
    },
    lightBackground: {
      hex: '#2B2F2F',
    },
  },
  text: {
    primary: {
      hex: '#E6E6E6',
    },
    secondary: {
      hex: '#131313',
    },
    accent: {
      hex: '#00ffa6',
    },
    error: {
      hex: '#FE3B46',
    },
    hyperlink: {
      hex: '#3aa1ff',
    },
  },
};

for (const [name, color] of Object.entries(theme.colors)) {
  const colorRGB = colorH2A(color.hex);
  theme.colors[name].rgb = colorRGB.join(', ');
  theme.colors[name].rawRgb = colorRGB;
}

for (const [name, color] of Object.entries(theme.text)) {
  const colorRGB = colorH2A(color.hex);
  theme.text[name].rgb = colorRGB.join(', ');
  theme.text[name].rawRgb = colorRGB;
}

export default theme;
