import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView, StyleSheet, Platform
} from 'react-native';
// import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTheme } from '../../../redux/actions/changeTheme';
import globalStyles from '../../../assets/styles/globalStyles';
var themeStyle = null;
import LottieView from 'lottie-react-native';
import * as colors from '../../../assets/styles/color';
import * as globals from '../../../lib/globals';

import { WINDOW } from '../../../lib/globals';


class ClaneBlueLoader extends Component {

    constructor(props) {
        super(props);
        themeStyle = this.props.theme;
        this.state={
            renderHoldText: false,
        }
    }

    componentDidMount() {
        this.animation.play();
    }

    timeOutHoldTextStatusChange() {
        setTimeout(() => { this.setState({ renderHoldText: true }) }, 3000)
      }

    renderHoldTextView() {
        return (
          <View>
            {/* <Text style={{marginTop: 10}}>{globals.holdMessage}</Text> */}
          </View>
        )
      }

    render() {
        return (
            <SafeAreaView style={globalStyles.safeviewStyle}>
                <View style={styles.loaderWrapper} pointerEvents="box-only">
                    <View style={styles.loaderInner} >
                        <View >
                            <LottieView
                                // style={[{ height: 75, width: 75, alignSelf:'center' }]}
                                style={(Platform.OS == 'ios') ? styles.iosLoader : styles.iosLoader}
                                // source={require('../../../animations/clane-circle-loader-blue.json')}
                                source={require('../../../animations/lf20_oWd6xH.json')}
                                ref={animation => {
                                    this.animation = animation;
                                }}
                                loop={true} />
                            {
                                this.timeOutHoldTextStatusChange()
                            }
                            <View>
                                {
                                    (this.state.renderHoldText) ? this.renderHoldTextView() : null
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

// ********************** Model mapping method **********************

const styles = StyleSheet.create({
    loaderWrapper: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
        backgroundColor: colors.blue
       // backgroundColor: colors.white
       // source={require('../../../animations/clane-circle-loader.json')}


    },
    iosLoader :{
      height: 500, width: 100, alignSelf:'center'
    },
    androidLoader:{
      height: 2500, width: 2500, alignSelf:'center'
    },
    loaderInner: {
        alignItems: 'center',
        justifyContent: 'center',
        height: WINDOW.height,
        width: WINDOW.width
    },
})

export default ClaneBlueLoader;