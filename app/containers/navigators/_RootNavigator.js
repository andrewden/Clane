import React, {Component} from 'react';
import { View,  } from "react-native";
import ClaneLoader from '../../components/ClaneLoader/index'
import { getshowLoader } from "../../redux/actions/showLoaderModal";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InitalRootStack from './_InitialStackNavigator';

class RootNavigation extends Component{
 
    constructor(props){
        super(props);
        this.state = {
            loading : this.props.loader
          };
    }

    /**
     * Method for receive props 
     * @param {*} newProps 
     */
    componentWillReceiveProps(newProps) {
        this.setState({
            loading: newProps.loader
        })
    }

    render() {
            return (
            <View style={{ flex: 1 }}>
                <InitalRootStack />
                <ClaneLoader loading={this.props.loader} />
            </View>
        )
    }
}

// ********************** Model mapping method **********************

const mapStateToProps = (state, ownProps) => {
    return { loader:state.claneLoader_red.loader }
  }
  const mapDispatchToProps = dispatch => (bindActionCreators({
    getshowLoader
  }, dispatch));
  
export default connect(mapStateToProps, mapDispatchToProps)(RootNavigation);
