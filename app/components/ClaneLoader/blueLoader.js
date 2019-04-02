import React, { Component } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { blue } from '../../assets/styles/color';
import { WINDOW, CollectSaveQRCodeAsImage } from '../../lib/globals';

class BlueLoader extends Component {

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
                                style={[{height: 80, width: 80,  alignSelf: 'center' }]}
                                source={require('../../animations/latestloader_blue.json')}
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
        backgroundColor: 'white'
    },
    iosLoader:{
      height: 500, width: 100,alignSelf : 'center'
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

export default BlueLoader;