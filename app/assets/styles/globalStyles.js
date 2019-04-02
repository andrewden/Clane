import {
  Platform,
  StyleSheet
} from 'react-native';

import { colorBorder, lightwhite_55, purplePlaceholder, blue, white, lightblue_2 } from './color';
import * as globals from '../../lib/globals';
import * as colors from '../../assets/styles/color';

const styles = StyleSheet.create({
  safeviewStyle:{
      flex:1,
  },
  navigationHeaderStyle: {
      backgroundColor: blue,
      borderBottomWidth: 0, 
      elevation: 0,
      shadowOpacity: 0,
      
   },
   categorySearchbarTopView:{
      flexDirection:'row',
      backgroundColor: blue,
      paddingLeft:10,
      height: (Platform.OS == 'ios')? (globals.iPhoneX) ? 95 : 70 : 55,
      paddingTop: (Platform.OS == 'ios')? (globals.iPhoneX) ? 40 : 20 : 0,
      alignItems: 'center',

  },

  navigationHeaderLeft: {
      flex: 1,
      marginLeft: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
  },
  navigationHeaderBackText: {
      color: white,
      fontSize: 16,
      marginLeft: 10
  },

  textInputView: {
      marginTop: 10,
      borderColor: colorBorder,
      marginLeft: 10,
      marginRight: 10,
      flexDirection: 'row',
  },
  buttonStyles: {
      marginTop: 20,
      height: 50,
      justifyContent: 'center',
      backgroundColor: lightwhite_55,
      borderRadius: 7,
      borderColor: blue,
  },

 

  buttonText: {
      color: white,
      textAlign: 'center',
      fontWeight: '800',
      fontSize: 17,
      lineHeight: 17 * 1.5,
      height: '100%',
  },
  underline: {
      borderBottomWidth: 1,
      borderBottomColor: purplePlaceholder,
      paddingBottom: 10
  },
  heading: {
      textAlign: 'center',
      fontSize: 17,
      lineHeight: 17 * 1.5,
      color: white,
      fontWeight: '800',
      fontFamily: globals.fontSFProTextSemibold
  },
  cancelButton: {
      color: white,
      fontSize: 17,
      fontWeight: '400',
      fontFamily: globals.fontSFProTextRegular
  },
  bigTextView: {
      color: white,
      fontSize: 22,
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: 20
  },
  headerTitleStyle:{
    fontSize: globals.font_17,
    color: colors.blackColor
  },

  // Search bar screen style
  mainViewSearchBar: {
      flex: 1,
      backgroundColor: white,
  },
  cancelButtonSearchBarView: {
      width: 70,
      alignItems:'center',
      justifyContent:'center'
  },
  cancelButtonText:{
      color:"white"
  },
  searchbarTopView:{
       flexDirection:'row',
      backgroundColor: blue,
      paddingLeft:15,
      paddingRight:5,
      height: globals.iPhoneX ? 95 : 75,
      paddingTop: globals.iPhoneX ? 40 : 20,
      alignItems: 'center',
      justifyContent: 'space-between'
  },
  newsStocksearchbarTopView:{
      flexDirection : 'row',
      backgroundColor: blue,
      paddingLeft:15,
      paddingRight:5,
      height: globals.iPhoneX ? 95 : 75,
      paddingTop: globals.iPhoneX ? 40 : 20,
      alignItems: 'center',
      justifyContent: 'space-between'
  },
  newsStocksearchHeaderWrapper:{
      backgroundColor: blue,
      paddingLeft:15,
      paddingRight:5,
      paddingBottom:10,
    //   height: (Platform.OS == 'ios')? (globals.iPhoneX) ? 135 : 115 : 107,
      paddingTop: (Platform.OS == 'ios')? (globals.iPhoneX) ? 55 : 35 : 15,
      alignItems: 'center',
     // justifyContent: 'space-between'
  },
  searchbarTopLeftView:{
      flex:1,
      flexDirection:'row',
      backgroundColor:'white',
      justifyContent:'center',
      borderRadius:5,
      paddingHorizontal:5,
      alignItems:'center',
  },

  searchbarTopLeftViewCategory : {
    flex:1,
      flexDirection:'row',
      backgroundColor:'white',
      justifyContent:'center',
      borderRadius:5,
      paddingHorizontal:5,
      alignItems:'center',
      marginLeft : 15
  },
 
  searchbarTextInputStyle:{
      height:(Platform.OS === 'android' ? 38 : 30 ),
      backgroundColor:'white',
      paddingLeft:5,
      flex:1
  },
});

export default styles;