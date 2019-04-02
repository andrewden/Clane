import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

function Loader(props) {
      return (
         <View style = {styles.container} >
            <ActivityIndicator
               animating = {props.animating}
               color = '#FFF'
               size = "large"
               style = {styles.activityIndicator}/>
         </View>
      )
}

const styles = StyleSheet.create ({
   container: {
      justifyContent: 'center',
      alignItems: 'center',
      height:"100%",
      width:"100%",
      backgroundColor:"rgba(52, 52, 52, 0.8)",
       position: 'absolute',
      left:0,
      right:0,   
      top: 0,
      zIndex : 200,
      bottom: 0,
   },
   activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 80
   }
})

export default Loader;