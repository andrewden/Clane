import { Dimensions, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { grey, blackColor } from './color';

let device = DeviceInfo.getModel();
const os = DeviceInfo.getSystemName();
const  width  = Dimensions.get('window').width;
const  height = Dimensions.get('window').height;
 
if (os === 'iOS' && height === 812) {
  device = 'iPhone X';
}

const lineheightHeading = 1.5;
const lisViewStaticHeight = 35;
const lineheight = 1.5;
const letterSpacing = 0.05;
const gutter = 10;
const headerHeight = 55;
const headerSubHeight = 70;
// const headerAlphaHeight = 70;
const footerHeight = 70;
let listViewHeight = 65;
let heroHeight = 200;
let statusBarHeight = StatusBar.currentHeight;

switch (os) {
  case 'iOS':
    switch (device) {
      case 'iPhone X':
        statusBarHeight = 33;
        break;
      default:
        statusBarHeight = 20;
    }
    break;
  default:
}

// large phone styles
if (height > 750) {
  heroHeight = 225;
  listViewHeight = 70;
}

const em = 12.5;
const fontBaseLineheight = em * lineheight;
const fontSmallSize = em * 0.9;
const fontSmallLineheight = fontSmallSize * lineheight;
const fontMiniSize = 0.8;
const fontMiniLineheight = fontMiniSize * lineheightHeading;
const fontH1Size = em * 2;
const fontH1Lineheight = fontH1Size * lineheightHeading;
const fontH2Size = em * 1.5;
const fontH2Lineheight = fontH2Size * lineheightHeading;
const fontH3Size = em * 1.25;
const fontH3Lineheight = fontH3Size * lineheightHeading;
const fontH4Size = em * 1.125;
const fontH4Lineheight = fontH4Size * lineheightHeading;
const fontH5Size = em;
const fontH5Lineheight = fontH5Size * lineheightHeading;
const fontH6Size = em * 0.9;
const fontH6Lineheight = fontH6Size * lineheightHeading;
const defaultFamily = 'System';
const FonWeightLight = '400';
const FonWeightRegular = '500';
const FonWeightBold = '600';

const light = {
  fontFamily: defaultFamily,
  fontWeight: '300',
};
const regular = {
  fontFamily: defaultFamily,
  fontWeight: '400',
};
const medium = {
  fontFamily: defaultFamily,
  fontWeight: '500',
};
const bold = {
  fontFamily: defaultFamily,
  fontWeight: '600',
};
const black = {
  fontFamily: defaultFamily,
  fontWeight: '800',
};

const font = {
  ...regular,
  fontSize: em,
  backgroundColor: 'transparent',
  lineHeight: fontBaseLineheight,
};
const fontSmall = {
  ...regular,
  fontSize: fontSmallSize,
  backgroundColor: 'transparent',
  lineHeight: fontSmallLineheight,
};
const fontMini = {
  ...regular,
  fontSize: fontMiniSize,
  backgroundColor: 'transparent',
  lineHeight: fontMiniLineheight,
};
const h1 = {
  ...bold,
  fontSize: fontH1Size,
  lineHeight: fontH1Lineheight,
  backgroundColor: 'transparent',
  letterSpacing: 0,
};
const h2 = {
  ...bold,
  fontSize: fontH2Size,
  lineHeight: fontH2Lineheight,
  backgroundColor: 'transparent',
  letterSpacing: 0,
};
const h3 = {
  ...bold,
  fontSize: fontH3Size,
  lineHeight: fontH3Lineheight,
  backgroundColor: 'transparent',
  letterSpacing: 0,
};
const h4 = {
  ...bold,
  fontSize: fontH4Size,
  lineHeight: fontH4Lineheight,
  backgroundColor: 'transparent',
  letterSpacing: 0,
};
const h5 = {
  ...bold,
  fontSize: fontH5Size,
  lineHeight: fontH5Lineheight,
  backgroundColor: 'transparent',
};
const h6 = {
  ...bold,
  fontSize: fontH6Size,
  lineHeight: fontH6Lineheight,
  letterSpacing: 0,
  backgroundColor: 'transparent',
};


function fontMargins(heading) {
  switch (heading) {
    case 'h1':
      return ({
        marginTop: em * 0.67,
        marginBottom: em * 0.67,
      });
    case 'h2':
      return ({
        marginTop: em * 0.83,
        marginBottom: em * 0.83,
      });
    case 'h3':
      return ({
        marginTop: em,
        marginBottom: em,
      });
    case 'h4':
      return ({
        marginTop: em * 1.33,
        marginBottom: em * 1.33,
      });
    case 'h5':
      return ({
        marginTop: em * 1.67,
        marginBottom: em * 1.67,
      });
    case 'h6':
      return ({
        marginTop: em * 2.33,
        marginBottom: em * 2.33,
      });
    default:
      return ({
        marginTop: em,
        marginBottom: em,
      });
  }
}


export default {
  measurement: {
    units: {
      em,
      gutter: {
        default: gutter,
        large: gutter * 2,
        xLarge: gutter * 3,
        small: gutter * 0.5,
      },
      radius: {
        default: 6,
      },
    },
    window: {
      width,
      height,
    },
    statusBar: {
      height: statusBarHeight,
    },
    nav: {
      main: {
        height: 80,
      }
    },
    header: {
      default: {
        sub: {
          height: headerSubHeight,
        },
        main: {
          height: headerHeight,
        },
      },
    },
    hero: {
      offset: 50,
      default: {
        height: heroHeight,
      },
      payment: {
        height: 300,
      },
      wallet: {
        height: heroHeight,
      },
      loader: {
        offset: {
          page: 100,
        },
      },
    },
    visual: {
      default: {
        width: 150,
      },
    },
    circle: {
      xLarge: {
        diameter: 110,
        radius: 55,
      },
      large: {
        diameter: 92,
        radius: 46,
      },
      small: {
        diameter: 66,
        radius: 33,
      },
      mini: {
        diameter: 50,
        radius: 25,
      },
    },
    footer: {
      default: {
        height: footerHeight,
      },
    },
    listView: {
      alpha: {
        height: listViewHeight,
      },
    },
    listStatic: {
      alpha: {
        height: lisViewStaticHeight,
      },
    },
  },

  helpers: {
    textClearFix: {
      textWrap: {
        flexDirection: 'row',
      },
      textFlow: {
        width: 0,
        flexGrow: 1,
        flex: 1,
      },
    },
  },

  radio: {
    radioButton: {
      marginRight: 20,
    },
    radioButtonInput: {
      paddingRight: 10,
    },
    radioButtonLabel: {
      ...font,
      fontWeight: FonWeightRegular,
    },
    buttonSize: 22,
    buttonOuterSize: 34,

  },

  page: {
    // header & footer
    default: {
      paddingTop: 0,
    },
  },

  shadow: {
    default: {
      shadowOffset: { width: 0, height: 5 },
      shadowColor: blackColor,
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 3,
    },
  },

  // fonts
  font: {
    family: {
      headline: bold,
    },
    weight: {
      light: {
        fontWeight: FonWeightLight,
      },
      regular: {
        fontWeight: FonWeightRegular,
      },
      bold: {
        fontWeight: FonWeightBold,
      },
    },
    text: font,
    fontSmall,
    fontMini,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    h1Default: {
      ...h1,
      ...regular,
      fontWeight: FonWeightBold,
    },
    h2Default: {
      ...h2,
      ...regular,
      fontWeight: FonWeightBold,
    },
    h3Default: {
      ...h3,
      ...regular,
      fontWeight: FonWeightBold,
    },
    h4Default: {
      ...h4,
      ...regular,
      fontWeight: FonWeightBold,
    },
    h5Default: {
      ...h5,
      ...regular,
      fontWeight: FonWeightBold,
    },
    h6Default: {
      ...h6,
      ...regular,
      fontWeight: FonWeightBold,
    },
    h1Margin: fontMargins('h1'),
    h2Margin: fontMargins('h2'),
    h3Margin: fontMargins('h3'),
    h4Margin: fontMargins('h4'),
    h5Margin: fontMargins('h5'),
    h6Margin: fontMargins('h6'),
    light: {
      ...light,
    },
    regular: {
      ...regular,
    },
    medium: {
      ...medium,
    },
    bold: {
      ...bold,
      color: grey,
    },
    black: {
      ...black,
      color: grey,
    },
  },
};
