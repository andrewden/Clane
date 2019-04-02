import React from 'react';
import { bindActionCreators } from 'redux';
import { changeTabColor } from '../../redux/actions/changeTabColorModel';
import { checkMarketStatus } from '../../redux/actions/checkMarketStatusModel';
import { connect } from 'react-redux';
import { BottomTabBar } from 'react-navigation-tabs';
import * as colors from '../../assets/styles/color';

// check state.index
const TabBar = (props) => {
    const { navigationState } = props;
    let newProps = props;
    newProps = Object.assign(
        {},
        props,
        {
            style: {
                backgroundColor: props.color,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
            },
            showLabel: false,
            showIcon: true,
            activeTintColor: (props.marketStatus) ?  colors.blue : colors.white,
            inactiveTintColor: (props.marketStatus) ?  colors.darkGray : colors.darkTabInactive,
        },
    );
    return <BottomTabBar {...newProps}    />;
};

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    return {
        loader: state.claneLoader_red.loader,
        color: state.changeTabColor_red.color, 
        marketStatus: state.checkMarketStatus_red.marketStatus
    }
}

const mapDispatchToProps = dispatch => (bindActionCreators({
    changeTabColor,
    checkMarketStatus
}, dispatch));

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);