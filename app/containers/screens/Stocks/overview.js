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
var themeStyle = null;

class Overview extends Component {

    constructor(props) {
        super(props);
        themeStyle = this.props.theme;
    }

    render() {
        return (
            <SafeAreaView style={globalStyles.safeviewStyle}>
                <View style={[styles.searchScreenItemLeftView, themeStyle.mainView]}>
                    <View style={[styles.headingContainer, themeStyle.trendingSection]}>
                        <Text style={[styles.trendingTitle, themeStyle.trendingTitle]}>Overview</Text>
                    </View> 
                    <View style={[styles.horizontalSeprator, themeStyle.horizontalSeprator]} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Overview);