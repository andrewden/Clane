import { StyleSheet, PixelRatio } from 'react-native'
import { getHeightPercent } from './ratio'
import * as colors from './../../../../../assets/styles/color';
import * as globals from './../../../../../lib/globals';

export default StyleSheet.create({
  container: {},
  modalContainer: {
    backgroundColor: colors.white,
    flex: 1
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    height: 48,
    width: '70%'
  },
  inputOnly: {
    marginLeft: '15%'
  },
  touchFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 19
  },
  headerTitle:{
    alignSelf:'center', 
    fontSize: globals.font_16, 
    color: colors.white,
    fontWeight:'500',
    marginLeft:-15,
    fontFamily: globals.fontSFProTextRegular
  },
  imgStyle: {
    resizeMode: 'contain',
    width: 25,
    height: 19,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#eee',
    opacity: 0.8
  },
  emojiFlag: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
    width: 30,
    height: 30,
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'transparent',
    backgroundColor: 'transparent'
  },
  itemCountry: {
    flexDirection: 'row',
    height: getHeightPercent(6),
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemCountryFlag: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '7%',
    width: '15%'
  },
  itemCountryName: {
    justifyContent: 'center',
    width: '70%',
    // borderBottomWidth: 2 / PixelRatio.get(),
    // borderBottomColor: 'transparent',
    height: 20
  },
  countryName: {
    fontSize: getHeightPercent(1.6),
    marginTop:2
  },
  scrollView: {
    flex: 1
  },
  letters: {
    marginRight: 10,
    marginTop:(globals.iPhoneX) ? 12 : 6,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  letter: {
    height: (globals.iPhoneX) ? 25 : 20,
    width: 20,
    // marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  letterText: {
    textAlign: 'center',
    fontSize: getHeightPercent(1.5)
  },
  closeButton: {
    height: 48,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeButtonImage: {
    height: 24,
    width: 24,
    resizeMode: 'contain'
  }
})
