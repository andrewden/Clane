import React, { Component } from 'react';
import { TextInput, StyleSheet, Animated, TouchableWithoutFeedback,Dimensions } from 'react-native';
import { me } from '../../assets/images/map';
import * as colors from '../../assets/styles/color';
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
export default class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            label: props.label,
            value: null,
        };

        const { width } = Dimensions.get('window');
        this.contentWidth = width - 40;
        this.middleWidth = (width - 60) / 2;
        /**
         * Animated values
         */
        this.iconSearchAnimated = new Animated.Value(this.middleWidth - 45);
        this.iconDeleteAnimated = new Animated.Value(0);
        this.inputFocusWidthAnimated = new Animated.Value(this.contentWidth - 10);
        this.inputFocusPlaceholderAnimated = new Animated.Value(this.middleWidth - 25);
        this.btnCancelAnimated = new Animated.Value(this.contentWidth);
    }

     /**
      * onFocus async await
      */
    onFocus = async () => {
        this.refs.input_keyword._component.isFocused && await this.refs.input_keyword._component.focus();
        await this.setState(prevState => {
            return {
                expanded: !prevState.expanded
            };
        });
        await this.expandAnimation();
    }

     /**
      * Method for expand Animation
      */
    expandAnimation = () => {
        return new Promise((resolve, reject) => {
            Animated.parallel([Animated.timing(this.inputFocusPlaceholderAnimated, {
                    toValue: 20,
                    duration: 200
                }).start(),
                Animated.timing(this.iconSearchAnimated, {
                    toValue: 2,
                    duration: 200
                }).start()
            ]);
            this.shadowHeight = 4;
            resolve();
        });
    }

    /**
     * Method for blur 
     */
    onBlur = async () => {
        if (this.props.value == '') {
            await this.collapseAnimation(true);
        }
    }

    /**
     * Method for collapse Animation 
     */
    collapseAnimation = (isForceAnim = false) => {
        return new Promise((resolve, reject) => {
            Animated.parallel([
                ((this.props.keyboardShouldPersist === false) ? Keyboard.dismiss() : null),
                Animated.timing(this.inputFocusWidthAnimated, {
                    toValue: this.contentWidth - 10,
                    duration: 200
                }).start(),
                Animated.timing(this.inputFocusPlaceholderAnimated, {
                    toValue: this.middleWidth - 15,
                    duration: 200
                }).start(),
                Animated.timing(this.iconSearchAnimated, {
                    toValue: this.middleWidth - 35,
                    duration: 200
                }).start(),
            ]);
            this.shadowHeight = 2;
            resolve();
        });
    }

    /**
     * onChangeText
     * async await
     */
    onChangeText = async (text) => {
        await this.setState({
            searchText: text
        });
    }

    render(){
        const { ...inputProps } = this.props;
        return(
            <Animated.View ref="searchContainer" style={styles.searchFiedlcontainer}>
                <AnimatedTextInput ref="input_keyword" style={[styles.searchTextField, {width: this.inputFocusWidthAnimated, paddingLeft: this.inputFocusPlaceholderAnimated},]}
                    {...inputProps}
                    onSubmitEditing={this.onSearch}
                    autoCorrect={false}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    underlineColorAndroid='transparent'
                />
                <TouchableWithoutFeedback onPress={this.onFocus}>
                    <Animated.Image source={me.search} style={[styles.iconSearch,styles.iconSearchDefault, {left: this.iconSearchAnimated,}]}/>
                </TouchableWithoutFeedback>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    searchFiedlcontainer: {
        backgroundColor: colors.white,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: colors.white
    },
    searchTextField: {
        height: 25,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 20,
        borderColor: colors.gray,
        backgroundColor: colors.white,
        borderRadius: 5,
        fontSize: 14,
        borderRadius: 10,
    },
    iconSearch: {
        flex: 1,
        position: 'absolute',
        height: 14,
        width: 14,
    },
    iconSearchDefault: {
        tintColor: 'grey',
    },
})