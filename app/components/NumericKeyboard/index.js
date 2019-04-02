import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import IconFea from 'react-native-vector-icons/Feather';
import baseStyles from '../../assets/styles';
import { SMALL_DEVICE_H} from '../../lib/globals';
import { white } from '../../assets/styles/color';

class NumericKeyboard extends Component {
  render() {
    const Item = (value, itemStyles) => (
        <TouchableOpacity style={[styles.keyboardItem]} onPress={() => { this.props.onPress(value) }}>
          <Text ref={(value == '.') ? component => this._text = component : ''}
            style={[styles.keyboardText, itemStyles]}>{value === 'del' ? <IconFea style={styles.deleteIcon} name='delete' /> : value}</Text>
          <View style={[styles.keyboardTextBoarder]} />
        </TouchableOpacity>
      );
    return (
      <View style={[styles.keyboardWrapper]}>
        <View style={[styles.keyboardRow]}>
          {Item(1)}
          {Item(2)}
          {Item(3)}
        </View>
        <View style={[styles.keyboardRow]}>
          {Item(4)}
          {Item(5)}
          {Item(6)}
        </View>
        <View style={[styles.keyboardRow]}>
          {Item(7)}
          {Item(8)}
          {Item(9)}
        </View>
        <View style={[styles.keyboardRow]}>
          {Item()}
          {Item(0)}
          {Item('del')}

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    keyboardWrapper: {
        paddingTop: 20
    },
    keyboardRow: {
        flexDirection: 'row',
    },
    keyboardText: {
        ...baseStyles.font.h1,
        fontSize: 25,
        lineHeight: null,
        color: white,
        marginBottom: 10,
    },
    keyboardItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: SMALL_DEVICE_H ? 50 : 70,
        opacity: 1,
    },
    deleteIcon: {
        fontSize: 25
    },
    keyboardTextBoarder: {
        height: 1,
        width: 50
    },
})
export default NumericKeyboard;