import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
  ViewPropTypes,
  ImagePropTypes,
  Linking,
  StyleSheet,
} from 'react-native';

import { DEFAULT_WIDTH, TYPES } from './constants';
import { getVideoId } from '../helpers';
import { YouTubeStandaloneAndroid } from 'react-native-youtube'

export default class Thumbnail extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      videoId: getVideoId(props.url),
    };
  }

  static propTypes = {
    ...ImageBackground.propTypes,
    children: PropTypes.node,
    containerStyle: ViewPropTypes.style,
    imageHeight: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    imageWidth: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    iconStyle: Image.propTypes.style,
    onPress: PropTypes.func,
    onPressError: PropTypes.func,
    style: ViewPropTypes.style,
    type: PropTypes.oneOf(Object.keys(TYPES)),
    url: PropTypes.string.isRequired,
    showPlayIcon: PropTypes.bool
  };

  static defaultProps = {
    type: 'high',
    imageHeight: 200,
    imageWidth: DEFAULT_WIDTH,
    onPressError: () => {},
    showPlayIcon: true
  };

  componentWillUpdate(nextProps) {
    if (this.props.url === nextProps.url || !nextProps.url) {
      return;
    }

    this.setState({
      videoId: getVideoId(nextProps.url),
    });
  }

  getType = () => TYPES[this.props.type];

  onPress = () => {
    const { url, onPress, onPressError } = this.props;

    var youtubeID = url && url.split("=")[1]
    if (youtubeID != null && youtubeID != undefined) {
      YouTubeStandaloneAndroid.playVideo({
        apiKey: 'AIzaSyCDi-2yxRDpRZdTnb47WBUVfAPQGaUYS1s',
        videoId: youtubeID,
        autoplay: false,
        lightboxMode: false,
      })
        .then(() => console.log('Android Standalone Player Finished'))
        .catch(errorMessage => this.setState({ error: errorMessage }))
    }
   
  
    // if (onPress) {
    //   return onPress(url);
    // }

    // Linking.canOpenURL(url).then((supported) => {
    //   if (!supported) {
    //     return;
    //   }

    //   return Linking.openURL(url);
    // }).catch(onPressError);
  };

  render() {
    const { videoId } = this.state;
    const {
      imageWidth,
      imageHeight,
      containerStyle,
      iconStyle,
      children,
      showPlayIcon,
      ...props
    } = this.props;

    const imageURL = `https://img.youtube.com/vi/${videoId}/${this.getType()}.jpg`;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={containerStyle}
        onPress={this.onPress}
      >
        <ImageBackground
          source={{ uri: imageURL }}
          style={[
            styles.imageContainer,
            {
              width: imageWidth,
              height: imageHeight,
            },
          ]}
          resizeMode='cover'
          testId='thumbnail-image-background'
          {...props}
        >
        {
          showPlayIcon ? (
            <Image
              source={require('../assets/youtube.png')}
              style={[styles.playIcon, iconStyle, {right: (this.props.isFrom == 'news') ? 70 : 0}]}
              testId='thumbnail-image'
            />
          ) : (
            null
          )
        }
          

          {children}
        </ImageBackground>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 50,
    height: 50,
    alignItems:'center'
    //right : 70
    //tintColor: 'red',
  },
});
