import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { blue } from '../../assets/styles/color';
import { WINDOW } from '../../lib/globals';

class ClaneLoader extends Component {

    componentDidMount() {
       if(this.props.loading) {
            this.animation.play();
       }
    }

    componentDidUpdate(){
        if(this.props.loading) {
            this.animation.play();
        }
    }

    render() {
        if(this.props.loading){
            return (
                <View style={styles.loaderWrapper} pointerEvents="box-only">
                    <View style={styles.loaderInner} >
                        <View >
                            <LottieView
                                // style={[{ height: 75, width: 75 }]}
                                style={(Platform.OS == 'ios') ? styles.iosLoader : styles.iosLoader}
                                // source={require('../../animations/clane-circle-loader.json')}
                                source={require('../../animations/lf20_oWd6xH.json')}
                                ref={animation => {
                                    this.animation = animation;
                                  }}
                                loop={true} />
                        </View>
                    </View>
                </View>
            )
        } else {
            return <View />
        }
    }
}

const styles = StyleSheet.create({
    loaderWrapper: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: blue
    },
    iosLoader:{
      height: 500, width: 100
    },
    androidLoader:{
      height: 2500, width: 2500
    },
    loaderInner: {
        alignItems: 'center',
        justifyContent: 'center', 
        height: WINDOW.height, 
        width: WINDOW.width
    },
})

export default ClaneLoader;