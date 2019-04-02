import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import baseStyles from '../../assets/styles';
import * as colors from  '../../assets/styles/color';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/fonts/glyph/selection.json';

var Icon = createIconSetFromIcoMoon(icoMoonConfig);

function Button(props) {
  return (
    <View>
      <TouchableOpacity underlayColor={'#6792FF'} onPress={() => props.onPress()} style={[styles.container, props.colorLight && styles.containerColorLight, props.borderLight && styles.containerBorderLight, props.buttonStyles]}>
        {(props.iconName != undefined)
          ? <View style={styles.viewContainer}>
            <Icon style={props.iconStyle} name={props.iconName} />
            <Text
              style={(props.textStyle == undefined)
                ? [styles.text]
                : props.textStyle}>{props.text}</Text>
          </View>
          : <View style={styles.viewContainer}>
            <Text
              style={(props.textStyle == undefined)
                ? [styles.text]
                : props.textStyle}>{props.text}</Text>
          </View>
        }
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: colors.blue,
    borderRadius: baseStyles.measurement.units.radius.default
  },
  containerColorLight: {
    backgroundColor: colors.colorBlue2
  },
  containerBorderLight: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.white
  },
  text: {
    ...baseStyles.font.h3,
    lineHeight: null,
    color: colors.white,
    letterSpacing: 2.5
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center'

  },
});

export default Button;
