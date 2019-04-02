import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import baseStyles from '../../../../assets/styles';
import { colorBorder } from "../../../../assets/styles/color";

class ListViewWrapper extends Component {
  
  render() {
    return (
      <View style={[styles.container, this.props.listViewWrapperStyles]}>
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: baseStyles.measurement.listView.alpha.height,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colorBorder,
    backgroundColor: '#fff',
  },
})

export default ListViewWrapper;
