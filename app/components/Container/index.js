/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { View } from 'react-native';
import basesStyles from '../../assets/styles';

class Container extends Component {

  padding(size) {
    const gutter = basesStyles.measurement.units.gutter;
    switch (size) {
      case 'small':
        return gutter.small;
      case 'medium':
        return gutter.default;
      case 'xLarge':
        return gutter.xLarge;
      default:
        return gutter.large;
    }
  }

  margin(size) {
    const gutter = basesStyles.measurement.units.gutter;
    switch (size) {
      case 'small':
        return gutter.small;
      case 'medium':
        return gutter.default;
      case 'xLarge':
        return gutter.xLarge;
      default:
        return gutter.large;
    }
  }

  render() {
    const {
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      containerStyles,
    } = this.props;
    return (
      <View style={[
        paddingTop && { paddingTop: this.padding(paddingTop) },
        paddingRight && { paddingRight: this.padding(paddingRight) },
        paddingBottom && { paddingBottom: this.padding(paddingBottom) },
        paddingLeft && { paddingLeft: this.padding(paddingLeft) },
        marginTop && { marginTop: this.margin(marginTop) },
        marginRight && { marginRight: this.margin(marginRight) },
        marginBottom && { marginBottom: this.margin(marginBottom) },
        marginLeft && { marginLeft: this.margin(marginLeft) },
        { backgroundColor: '#fff' },
        containerStyles,
      ]}
      >
        {this.props.children}
      </View>
    );
  }
}

export default Container;
