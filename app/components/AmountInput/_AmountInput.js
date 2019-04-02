import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Animated,
    Image,
    SafeAreaView,
} from 'react-native';
import IconFea from 'react-native-vector-icons/Feather';
import IconEv from 'react-native-vector-icons/EvilIcons';
import style from './style';
import { WINDOW } from '../../lib/globals';
import globalStyles from '../../assets/styles/globalStyles';
import * as colors from '../../assets/styles/color';

//Animation durations
const defaultFontSize = 60;
const textAnimation = 300;
const btnAnimation = 100;

calculateFontSize = (height) => {
    return (height - ((Math.ceil(height / 3)) / 2))
};

class AmountInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            amount: '0',
            newInput: '0',
            buttonColorIndicator: new Animated.Value(0),
            textOpacity: new Animated.Value(1),
            textPosition: new Animated.Value(0),
            buttonTitle:this.props.buttontitle,
            fontSize: defaultFontSize
        }
        this.formatAmount = this.formatAmount.bind(this);
        this.callback = this.callback.bind(this);
    }

    formatAmount = (number, decimals = 2, dec_point = ".", thousands_sep = ",") => {
        const value = parseFloat(number);
        if (isNaN(value)) {
            return "";
        }
        var exponent = "",
            numberstr = number.toString(),
            eindex = numberstr.indexOf("e"),
            temp,
            sign,
            integer,
            fractional,
            i,
            z;
        if (eindex > -1) {
            exponent = numberstr.substring(eindex);
            number = parseFloat(numberstr.substring(0, eindex));
        }
        if (decimals !== null) {
            temp = Math.pow(10, decimals);
            number = Math.round(number * temp) / temp;
        }
        sign = number < 0 ? "-" : "";
        integer = (number > 0 ? Math.floor(number) : Math.abs(Math.ceil(number))).toString();
        fractional = number.toString().substring(integer.length + sign.length);
        dec_point = dec_point !== null ? dec_point : ".";
        fractional = (decimals !== null && decimals > 0) || fractional.length > 1 ? (dec_point + fractional.substring(1)) : "";
        if (decimals !== null && decimals > 0) {
            for (i = fractional.length - 1, z = decimals; i < z; ++i) {
                fractional += "0";
            }
        }
        thousands_sep = (thousands_sep !== dec_point || fractional.length === 0) ? thousands_sep : null;
        if (thousands_sep !== null && thousands_sep !== "") {
            for (i = integer.length - 3; i > 0; i -= 3) {
                integer = integer.substring(0, i) + thousands_sep + integer.substring(i);
            }
        }
        return sign + integer + fractional + exponent;
    }

    input = (val) => {
        if ((this.state.amount.length === 1 && val === 0) || this.state.amount.length === 11) {
            return;
        }
        if (this.state.amount.length === 1) {
            Animated.timing(this.state.buttonColorIndicator, {
                toValue: 1,
                duration: btnAnimation
            }).start();
        }
        Animated.parallel([
            Animated.timing(this.state.textOpacity, {
                toValue: 0,
                duration: 0
            }),
            Animated.timing(this.state.textPosition, {
                toValue: 1,
                duration: 0
            })
        ]).start();

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(this.state.textOpacity, {
                    toValue: 1,
                    duration: textAnimation
                }),
                Animated.timing(this.state.textPosition, {
                    toValue: 0,
                    duration: textAnimation
                })
            ]).start();
            this.setState({
                amount: this.state.amount + this.state.newInput,
                newInput: val
            })
        }, 50)

        setTimeout(() => {
            this.amountInput.measure((ox, oy, width, height, px, py) => { this.setState({ fontSize: calculateFontSize(height) }) });
        }, 150);
    }

    del() {
        if (this.state.amount.length === 2) {
            Animated.timing(this.state.buttonColorIndicator, {
                toValue: 0,
                duration: btnAnimation
            }).start();
        }
        if (this.state.amount.length > 1) {
            this.setState({
                newInput: this.state.amount[this.state.amount.length - 1],
                amount: this.state.amount.substring(0, this.state.amount.length - 1)
            })
        }
        setTimeout(() => {
            this.amountInput.measure((ox, oy, width, height, px, py) => { this.setState({ fontSize: calculateFontSize(height) }) });
        }, 10);
    }

    callback() {
        if (this.props.callback && (this.state.amount.length > 1 || this.state.newInput !== '0')) {
            let retValue = parseInt(this.state.amount + this.state.newInput) / 100;
            this.props.callback(retValue)
        }
    }

    renderClose() {
        if (this.props.close) {
            return (
                <TouchableOpacity style={style.closeButton} onPress={this.props.close}>
                    <IconEv style={style.closeIcon} name='close' />
                </TouchableOpacity>
            )
        }
    }

    renderImage() {
        if (this.props.picture) {
            let imageDimensions = {
                width: WINDOW.height > 700 ? 80 : 60,
                height: WINDOW.height > 700 ? 80 : 60,
                borderRadius: WINDOW.height > 700 ? 40 : 30,
            }
            return (
                <View style={style.imageView}>
                    <Image
                        source={this.props.picture}
                        style={[style.image, imageDimensions]} />
                </View>
            )
        }
    }

    renderName() {
        if (this.props.name) {
            return (
                <View style={style.nameView}>
                    <Text style={style.nameLabel}>{this.props.name}</Text>
                </View>
            )
        }
    }

    renderInput() {
        let textTransform = {
            transform: [
                {
                    translateY: this.state.textPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -30],
                    })
                }
            ]
        }
        return (
            <View style={style.inputView}>
                <Text adjustsFontSizeToFit ref={(el) => this.amountInput = el} numberOfLines={1} style={style.inputText}>₦ {this.formatAmount(this.state.amount / 10, 1)}</Text>
                <Animated.View style={[textTransform, { opacity: this.state.textOpacity, height: this.state.inputHeight }]}>
                    <Text style={[style.inputText, { fontSize: this.state.fontSize }]}>{this.state.newInput}</Text>
                </Animated.View>
            </View >
        )
    }

    renderButton() {
        let buttonColor = {
            backgroundColor: this.state.buttonColorIndicator.interpolate({
                inputRange: [0, 1],
                outputRange: ['#FFFFFF20', '#FFFFFF55'],
            }),
        }
        let textColor = {
            color: this.state.buttonColorIndicator.interpolate({
                inputRange: [0, 1],
                outputRange: ['#FFFFFF55', '#FFFFFFFF'],
            }),
        }
        return (
            <View style={style.buttonView}>
                <TouchableOpacity style={[style.button, { backgroundColor: 'transparent' }]} onPress={this.callback} activeOpacity={this.state.amount.length > 1 ? 0.5 : 1}>
                    <Animated.View style={[style.button, buttonColor]}>
                        <Animated.Text style={[style.buttonText, textColor]}>{this.state.buttonTitle}</Animated.Text>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        )
    }

    renderKeyboard() {
        return (
            <View style={style.keyboardView}>
                <View style={style.keyboardRow}>
                    <TouchableOpacity style={style.key} onPress={() => { this.input(1) }} ripple><Text style={style.keyText}>1</Text></TouchableOpacity>
                    <TouchableOpacity style={style.key} onPress={() => { this.input(2) }} ripple><Text style={style.keyText}>2</Text></TouchableOpacity>
                    <TouchableOpacity style={style.key} onPress={() => { this.input(3) }} ripple><Text style={style.keyText}>3</Text></TouchableOpacity>
                </View>
                <View style={style.keyboardRow}>
                    <TouchableOpacity style={style.key} onPress={() => { this.input(4) }} ripple><Text style={style.keyText}>4</Text></TouchableOpacity>
                    <TouchableOpacity style={style.key} onPress={() => { this.input(5) }} ripple><Text style={style.keyText}>5</Text></TouchableOpacity>
                    <TouchableOpacity style={style.key} onPress={() => { this.input(6) }} ripple><Text style={style.keyText}>6</Text></TouchableOpacity>
                </View>
                <View style={style.keyboardRow}>
                    <TouchableOpacity style={style.key} onPress={() => { this.input(7) }} ripple><Text style={style.keyText}>7</Text></TouchableOpacity>
                    <TouchableOpacity style={style.key} onPress={() => { this.input(8) }} ripple><Text style={style.keyText}>8</Text></TouchableOpacity>
                    <TouchableOpacity style={style.key} onPress={() => { this.input(9) }} ripple><Text style={style.keyText}>9</Text></TouchableOpacity>
                </View>
                <View style={style.keyboardRow}>
                    <TouchableOpacity style={[style.key, style.noBorder]} ripple><Text style={style.keyText}></Text></TouchableOpacity>
                    <TouchableOpacity style={[style.key, style.noBorder]} onPress={() => { this.input(0) }} ripple><Text style={style.keyText}>0</Text></TouchableOpacity>
                    <TouchableOpacity style={[style.key, style.noBorder]} onPress={this.del.bind(this)} ripple><IconFea style={style.keyText} name='chevron-left' /></TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={[globalStyles.safeviewStyle, { backgroundColor: colors.blue }]}>
            <View style={{ flex: 1,}}>
                {this.renderClose()}
                <View style={style.topViewStyle}>
                    {this.renderImage()}
                    {this.renderName()}
                    {this.renderInput()}
                </View>
                {this.renderKeyboard()}
                {this.renderButton()}
            </View>
            </SafeAreaView>
        )
    }
}

export default AmountInput;
