import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import GlyphIcon from '../../components/GlyphIcon';

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      placeholderVis: true,
      placeholderValue: this.props.placeholder,
    };
  }

  handlePlaceholderPress = () => {
    if (this.state.placeholderValue === this.props.placeholder) {
      this.textInput.focus();
      this.setState({placeholderVis: false});
    }
  };

  onBlur = () => {
    this.setState({
      placeholderVis: true,
      inputValue: '',
    });
  }

  render() {
    const Placeholder =
      <TouchableOpacity onPress={this.handlePlaceholderPress} style={[ styles.placeholderWrapper ]}>
        {GlyphIcon.icon({iconClass: 'zoom-split', iconStyle: styles.placeholderIcon})}
        <Text style={[ styles.placeholder ]}>{this.state.placeholderValue}</Text>
      </TouchableOpacity>;

    return (
      <View style={[ styles.container ]}>
        {this.state.placeholderVis && Placeholder}
        <TextInput style={[ styles.input ]} ref={(input) => { this.textInput = input }}
          value={this.state.inputValue}
          onChangeText={(value) => this.setState({inputValue: value})}
          onBlur={this.onBlur}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    fontSize: 17,
    backgroundColor: 'rgba(255,255,255,.3)',
    height: 35,
    borderRadius: 10,
    paddingLeft: 10,
    textAlign: 'center',
    color: 'rgba(255,255,255,1)'
  },
  placeholderWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  placeholder: {
    fontSize: 17,
    color: 'rgba(255,255,255,.6)',
  },
  placeholderIcon: {
    fontSize: 13.5,
    marginRight: 10,
    marginLeft: 10,
    color: 'rgba(255,255,255,.6)',
  }
});

export default SearchBar;
