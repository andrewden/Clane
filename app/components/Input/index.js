import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import GlyphIcon from '../../components/GlyphIcon';
import { grey, grey1, colorBorder, blue } from '../../assets/styles/color';
import baseStyles from '../../assets/styles';

const measurement = baseStyles.measurement.units.gutter.default;
const largeFontSize = 14;
const smallFontSize = 12;
const labelFontSize = { large: largeFontSize, small: smallFontSize };

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      label: props.label,
      value: null,
      animatedLabelColor: new Animated.Value(0),
      animatedLabelX: new Animated.Value(0),
      animatedLabelY: new Animated.Value(0),
      animatedLabelFontSize: new Animated.Value(0),
    };
  }

  onFocus = () => {
    const { input, iconClass } = this.props;
    input.onFocus();
    this.setState({ active: true });
    iconClass && this.animatePos(-31.5, 'x');
    this.animatePos(-23, 'y');
    Animated.timing(this.state.animatedLabelColor, {
        toValue: 1,
        duration: 200,
      },).start();
    Animated.timing(this.state.animatedLabelFontSize, {
        toValue: 1,
        duration: 200,
      },).start();
  }

  onBlur = (value) => {
    const { input } = this.props;
    input.onBlur(value);
    this.setState({ active: false });
    if (!this.state.value) {
      this.animatePos(0, 'x');
      this.animatePos(0, 'y');
    }
    if (!this.state.value) {
      Animated.timing(this.state.animatedLabelColor,{
          toValue: 0,
          duration: 200,
        },).start();
      Animated.timing(this.state.animatedLabelFontSize,{
          toValue: 0,
          duration: 200,
        },).start();
    }
  }

  onChangeText = (value) => {
    const { input } = this.props;
    input.onChange(value);
    this.setState({ value });
    this.props.onChangeText && this.props.onChangeText(value);
  }

  onLabelTouch = () => {
    if (!this.state.active) {
      this.onFocus();
      this.textInput.focus();
    }
  }

  setValue = () => {
    console.log('set value');
  }

  animatePos(value, pos) {
    Animated.timing(pos === 'x' ? this.state.animatedLabelX : this.state.animatedLabelY,{
        toValue: value,
        duration: 150,
        useNativeDriver: true,
      },).start();
  }

  render() {
    const { iconClass, ...inputProps } = this.props;
    return (
      <View style={[styles.container, this.props.disabled && {opacity: 0.35,}, this.props.hidden && {display: 'none',},]}>
        { this.props.disabled && <View style={[styles.disabledOverlay]} />}
        {iconClass &&
        <View style={[styles.itemPadding, styles.iconWrapper]}>
          {GlyphIcon.icon({ iconClass, iconStyle: styles.iconStyle })}
        </View>
        }
        <View style={[styles.itemPadding, styles.textWrapper]}>
          <TextInput
            {...inputProps}
            underlineColorAndroid="transparent"
            style={[styles.textInput]}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChangeText={this.onChangeText}
            value={this.state.value}
            setValue={value => this.setState({ value })}
            ref={this.props.includeRef}
          />
          <Animated.Text style={[styles.text,{
                transform: [
                  { translateX: this.state.animatedLabelX },
                  { translateY: this.state.animatedLabelY }],
              },]}
          >{this.state.label}</Animated.Text>
        </View>
        {this.props.link &&
        <TouchableOpacity
          onPress={this.props.linkOnPress && this.props.linkOnPress}
          activeOpacity={this.props.linkOnPress ? 0.2 : 1}
          style={[styles.itemPadding, { paddingRight: 0 }]}
        >
          <Text style={[styles.link]}>{this.props.link}</Text>
        </TouchableOpacity>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemPadding: {
    paddingLeft: measurement,
    paddingRight: measurement,
  },
  iconWrapper: {
    paddingLeft: 0,
    marginRight: 5,
  },
  iconStyle: {
    fontSize: 16,
    color: grey1,
  },
  container: {
    backgroundColor: '#fff',
    height: baseStyles.measurement.listView.alpha.height,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colorBorder,
    paddingTop: 20,
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  textInput: {
    flex: 1,
    flexDirection: 'row',
    ...baseStyles.font.text,
    fontSize: largeFontSize,
    color: grey,
  },
  text: {
    position: 'absolute',
    left: 0,
    bottom: 15,
    ...baseStyles.font.text,
    color: grey1,
    fontWeight: '500',
  },
  textWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 0,
    marginTop: 3,
    flex: 1,
  },
  link: {
    ...baseStyles.font.text,
    ...baseStyles.font.medium,
    fontSize: labelFontSize.small,
    color: blue,
    marginBottom: 8,
  },
});

export default Input;
