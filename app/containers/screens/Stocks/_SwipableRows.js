import React, { Component } from 'react';
import Interactable from 'react-native-interactable';
import {
    StyleSheet,
    Animated,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import * as globals from '../../../lib/globals';

var _this = null;

export default class SwipableRows extends Component {

    constructor(props) {
        super(props);
        this._deltaX = new Animated.Value(0);
        this.state = { isMoving: false, position: 1 };
        _this = this
    }

    render() {
        return (
            <View style={{ backgroundColor: this.props.themeColor }}>
                <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    {this.renderActionItem('Delete', 'red', [-80, -40])}
                </View>
                <Interactable.View
                    style={{ backgroundColor: this.props.themeColor }}
                    ref={el => _this.interactableElem = el}
                    horizontalOnly={true}
                    snapPoints={[
                        { x: 0, damping: 1 - this.props.damping, tension: this.props.tension },
                        { x: -80, damping: 1 - this.props.damping, tension: this.props.tension },
                        { x: -(globals.WINDOW.width), damping: 1 - this.props.damping, tension: this.props.tension }
                    ]}
                    boundaries={{ right: 0 }}
                    onSnap={this.onSnap.bind(this)}
                    onDrag={this.onDrag.bind(this)}
                    onStop={this.onStopMoving.bind(this)}
                    dragToss={0.01}
                    animatedValueX={this._deltaX}>
                    <View style={{ left: 0, right: 0, flex: 1, backgroundColor: this.props.themeColor }}>
                        {this.props.children}
                    </View>
                </Interactable.View>
            </View>
        );
    }

    onSnap({ nativeEvent }) {
        const { index } = nativeEvent;
        if (index == 2) {
            this.onButtonPress()
        }
        this.setState({ position: index });
    }

    onRowPress() {
        _this.interactableElem.snapTo({ index: 0 });
        const { isMoving, position } = this.state;
        if (!isMoving && position !== 1) {
            _this.interactableElem.snapTo({ index: 1 });
        }
    }

    onDrag({ nativeEvent }) {
        const { state } = nativeEvent;
        if (state === 'start') {
            this.setState({ isMoving: true });
        }
    }

    onStopMoving() {
        this.setState({ isMoving: false });
    }

    onButtonPress(name) {
        _this.interactableElem.changePosition({ x: 0 });
        this.props.btnDeletePressed(this.props.stock_id, this.props.rowIndex)
    }

    static onRowClicked() {
        _this.interactableElem.snapTo({ index: 0 });
    }

    renderActionItem(text, inOutRange) {
        return (
            <Animated.View style={[styles.buttonImage, {backgroundColor: 'red', width: this._deltaX.interpolate({inputRange: [-250, -80, -45],outputRange: [250, 80, 45],})}]}>
                <TouchableOpacity style={[styles.button]} onPress={this.onButtonPress.bind(this, 'trash')}>
                    <Text style={styles.text}>{text}</Text>
                </TouchableOpacity>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    rowContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#eeeeee'
    },
    rowIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#73d4e3',
        margin: 20
    },
    rowTitle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    rowSubtitle: {
        fontSize: 18,
        color: 'gray'
    },
    button: {
        width: 75,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: 'white',
        marginLeft: 7.5,
    }
});