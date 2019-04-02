import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import style from './style';

class TileContainer extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    renderCaption() {
        if (this.props.caption) {
            return (
                <View style={style.caption}>
                    <Text style={style.captionText}>{this.props.caption}</Text>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={[style.wrapper, { height: this.props.height || 150 }]}>
                {this.renderCaption()}
                {this.props.children}
            </View>
        )
    }
}

export default TileContainer;
