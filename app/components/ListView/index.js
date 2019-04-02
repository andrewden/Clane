import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Switch } from 'react-native';
import { FormattedCurrency } from 'react-native-globalize';
import ListViewWrapper from './components/ListViewWrapper/';
import ICONS from '../../assets/images/ICONS';
import baseStyles from '../../assets/styles';
import { grey, grey1, colorBlue, green } from '../../assets/styles/color';
import GlyphIcon from '../../components/GlyphIcon';

const measurement = baseStyles.measurement.units.gutter.default;

class ListView extends PureComponent {
  onPress = () => {
    this.props.onPress && this.props.onPress();
  }

  render() {
    let LeftVisual = this.props.iconIndex &&
      <View style={[styles.itemPadding, styles.leftVisual, { paddingLeft: 0 }]}>
        <Image
          source={ICONS[this.props.iconIndex].image}
          style={[styles.iconLeft]}
        />
      </View>;
    const Content = {
      title: this.props.title && <Text style={[styles.title]}>{this.props.title}</Text>,
      sub: this.props.sub && <Text style={[styles.sub]}>{this.props.sub}</Text>,
    };
    let SumRight = null;
    if (this.props.sumRight) {
      const sum = this.props.sumRight;
      const arrowStyles = { fontSize: 9, marginLeft: 5, color: grey1 };
      const ArrowUp = GlyphIcon.icon({
        iconClass: 'triangle-up-19',
        iconStyle: arrowStyles,
      });
      const ArrowDown = GlyphIcon.icon({
        iconClass: 'triangle-down-20',
        iconStyle: arrowStyles,
      });
      SumRight =
        (<View style={[styles.rightSum, styles.itemPadding,
          !this.props.iconUxRight ?
            { paddingRight: 0 } :
            '',
        ]}
        >
          <Text
            style={[
              styles.rightSumText,
              sum.color && { color: sum.color },
              sum.color === green ? styles.rightSumGreenWrapper : null,
            ]}
          ><FormattedCurrency value={sum.value} /></Text>
          {sum.arrow === 'up' ? ArrowUp : null}
          {sum.arrow === 'down' ? ArrowDown : null}
        </View>);
    }
    if (this.props.switch) {
      SwitchRight = <Switch />;
    }
    switch (this.props.type) {
      case 'alpha':
        if (this.props.keyProfileImage) {
          LeftVisual =
            (<View style={[styles.itemPadding, styles.leftVisual, { paddingLeft: 0 }]}>
              <Image source={this.props.keyProfileImage} style={[styles.keyProfileImage]} />
            </View>);
        } else {
          LeftVisual = this.props.keyLeft &&
            (<View style={[styles.itemPadding, styles.leftVisual, { paddingLeft: 0 }]}>
              <View style={[styles.key]}>
                <Text style={[styles.keyText]}>
                  {this.props.keyLeft}
                </Text>
              </View>
            </View>);
        }
        break;

      case 'charlie':
        break;

      default:
    }

    return (
      <View>
        <ListViewWrapper>
          <TouchableOpacity style={[styles.container]} onPress={this.onPress} activeOpacity={this.props.onPress ? 0.2 : 1}>
            {LeftVisual}
            <View style={[styles.itemPadding, styles.content, !LeftVisual ? { paddingLeft: 0 } : '']}>
              {Content.title}
              {Content.sub}
            </View>
            <View style={[styles.itemPadding, styles.rightWrapper, { paddingRight: 0 }]}>
              {SumRight}
            </View>
          </TouchableOpacity>
        </ListViewWrapper>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  // global
  itemPadding: {
    paddingLeft: measurement,
    paddingRight: measurement,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // center
  content: {
    flex: 1,
  },
  title: {
    ...baseStyles.font.h4,
    lineHeight: null,
  },
  sub: {
    ...baseStyles.font.text,
    color: grey1,
    lineHeight: null,
  },

  // left
  leftVisual: {
    width: 40,
  },
  iconLeft: {
    width: 30,
    height: 30,
  },
  keyProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colorBlue,
  },
  key: {
    width: 32,
    height: 32,
    borderRadius: 30,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colorBlue,
  },
  keyText: {
    ...baseStyles.font.fontSmall,
    width: 32,
    lineHeight: null,
    textAlign: 'center',
    color: colorBlue,
  },

  // right
  rightWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSum: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSumText: {
    ...baseStyles.font.text,
    ...baseStyles.font.medium,
    lineHeight: null,
    color: grey,
  },
  rightSumGreenWrapper: {
    paddingTop: 3,
    paddingRight: 6,
    paddingBottom: 3,
    paddingLeft: 6,
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: '#F4FAF6',
    marginRight: -6,
  },
});

export default ListView;
