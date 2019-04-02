import React, { Component } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import baseStyles from '../../assets/styles';
import { shade1 } from '../../assets/styles/color';

let HERO_HEIGHT = null;

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      paddingTop: null,
      scrollY: new Animated.Value(0),
    };
  }

  handleScroll = (e) => {
    this.setState({ scrollY: new Animated.Value(e.nativeEvent.contentOffset.y) });
  }

  renderHero(translate, height) {
    return (
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, width: baseStyles.measurement.window.width, height, transform: [{ translateY: translate, }],}}
      >
        {this.props.hero}
      </Animated.View>
    );
  }

  render() {
    if (this.props.hero) {
      HERO_HEIGHT = baseStyles.measurement.hero.default.height;
      if (this.props.heroHeight) {
        HERO_HEIGHT = this.props.heroHeight;
      }
    } else {
      HERO_HEIGHT = 0;
    }

    const HERO_TRANSLATE = this.state.scrollY.interpolate({
      inputRange: [0, HERO_HEIGHT],
      outputRange: [0, -HERO_HEIGHT / 4],
    });

    const HERO_TRANSLATE_BEFORE = this.state.scrollY.interpolate({
      inputRange: [0, HERO_HEIGHT],
      outputRange: [0, -HERO_HEIGHT],
    });

    const ScrollOrView = this.props.scrollEnabled ? ScrollView : View;

    return (
      <View style={{ flex: 1, }}>
        {this.props.heroBefore &&
          <Animated.View style={{
            position: 'absolute',
            width: baseStyles.measurement.window.width,
            top: 0,
            left: 0,
            height: HERO_HEIGHT,
            zIndex: 10,
            alignItems: 'center',
            transform: [{
              translateY: HERO_TRANSLATE_BEFORE,
            }],
          }}>
            {this.props.heroBefore}
          </Animated.View>
        }
        {this.props.hero &&
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: baseStyles.measurement.window.width,
              height: HERO_HEIGHT,
              transform: [{
                translateY: HERO_TRANSLATE,
              }],
            }}>
            {this.props.hero}
          </Animated.View>
        }
        <ScrollOrView style={[!this.props.scrollEnabled && {flex: 1,},]}
          ref={this.props.withRef}
          scrollEventThrottle={16}
          contentContainerStyle={this.props.contentContainerStyle}
          scrollEnabled={!!this.props.scrollEnabled}
          onScroll={Animated.event([{ nativeEvent: {
                contentOffset: {
                  y: this.state.scrollY,
                },
              },}],)}>
          <View style={[ styles.container, this.props.contentContainerChildStyle, {
                marginTop: HERO_HEIGHT,
                backgroundColor: this.props.backgroundColor ?
                  this.props.backgroundColor :
                  'transparent',
              },]}>
            {this.props.children}
          </View>
        </ScrollOrView>
        {this.props.footer}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  page: {
    flex: 1,
    backgroundColor: shade1,
  },
});

export default Page;
