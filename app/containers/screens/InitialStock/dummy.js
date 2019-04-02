import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView
} from 'react-native';
import styles from './style';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeTheme } from '../../../redux/actions/changeTheme';
import globalStyles from '../../../assets/styles/globalStyles'; 
import * as globals from '../../../lib/globals';

var themeStyle = null;

class Dummy extends Component {

    constructor(props) {
        super(props);
        themeStyle = this.props.theme;
    }

    render() {
        return (
            <SafeAreaView style={globalStyles.safeviewStyle}>
                <View style={[styles.searchScreenItemLeftView, {backgroundColor: 'white', padding:10}]}>
                     
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 10}}>Clane App font 10</Text>
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 11}}>Clane App font 11</Text>
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 12}}>Clane App font 12</Text>
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 13}}>Clane App font 13</Text>
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 14}}>Clane App font 14</Text>
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 15}}>Clane App font 15</Text>
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 16}}>Clane App font 16</Text>
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 17}}>Clane App font 17</Text>
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 18}}>Clane App font 18</Text>
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 19}}>Clane App font 19</Text>
                    <Text style={{fontFamily:globals.fontClaneLetteraTextTTBold, fontSize: 20, fontWeight:'600'}}>Clane App font 20</Text>


                </View>
            </SafeAreaView>
        )
    }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    return {
        theme: state.changeTheme_red.theme,
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    changeTheme,
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(Dummy);