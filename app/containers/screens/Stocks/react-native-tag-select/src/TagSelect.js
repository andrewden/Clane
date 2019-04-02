import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  ViewPropTypes,
  StyleSheet
} from 'react-native'
import * as globals from '../../../../../lib/globals';


import TagSelectItem from './TagSelectItem'

class TagSelect extends React.Component {

  static propTypes = {
    // Pre-selected values
    value: PropTypes.array,

    // Objet keys
    labelAttr: PropTypes.string,
    keyAttr: PropTypes.string,

    // Available data
    data: PropTypes.array,

    // validations
    max: PropTypes.number,

    // Callbacks
    onMaxError: PropTypes.func,
    onItemPress: PropTypes.func,

    // Styles
    containerStyle: ViewPropTypes.style,
  }

  static defaultProps = {
    value: [],

    labelAttr: 'name',
    keyAttr: 'id',

    data: [],

    max: null,

    onMaxError: null,
    onItemPress: null,

    containerStyle: {},
  }

  state = {
    value: []
  }

  componentDidMount() {
    console.log("this.porps tabselect : " + JSON.stringify(this.props))
    console.log("DATA ----> " +  JSON.stringify(this.props.data))
    console.log("value ----> " +  JSON.stringify(this.props.value))
    // const value = {}
    // if(this.props.value != null && this.props.value!=undefined){
    //   this.props.value.forEach((val) => {
    //     value[val[[this.props.keyAttr]] || val] = val
    //   })
    // }
    // console.log("value : " + JSON.stringify(value))
    // this.setState({ value },() => this.forceUpdate())
    if(this.props.value != null && this.props.value!=undefined){
      this.setState({value:this.props.value})
    }else{
      this.setState({value:[]})
    }
  }

  /**
   * @description Return the number of items selected
   * @return {Number}
   */
  get totalSelected() {
    return Object.keys(this.state.value).length
  }

  /**
   * @description Return the items selected
   * @return {Array}
   */
  get itemsSelected() {
    const items = []

    Object.entries(this.state.value).forEach(([key]) => {
      if(this.state.value[key].id != null && this.state.value[key].id != undefined){
        items.push(this.state.value[key].id)
      }
      else{
        items.push(this.state.value[key])
      }
    })

    return items
  }

  //previous one - change name of function
  get itemsSelectedObject() {
    const items = []
    Object.entries(this.state.value).forEach(([key]) => {
      items.push(this.state.value[key])
    })

    return items
  }

  /**
   * @description Callback after select an item
   * @param {Object} item
   * @return {Void}
   */
  handleSelectItem = (item) => {
    console.log("== handleSelectItem:" + JSON.stringify(item));
    if(this.props.isEdit == true){
      if (globals.isLoggedIn == 'false') {
        this.checkLogin();
        globals.globalVars.dashboardTitle = globals.screenTitle_TagPrefrence
  
      }
      else {
        // const key = item[this.props.keyAttr] || item
  
        // const value = { ...this.state.value }
        // const found = this.state.value[key]
  
        // // Item is on array, so user is removing the selection
        // if (found) {
        //   delete value[key]
        // } else {
        //   // User is adding but has reached the max number permitted
        //   if (this.props.max && this.totalSelected >= this.props.max) {
        //     if (this.props.onMaxError) {
        //       return this.props.onMaxError()
        //     }
        //   }
  
        //   value[key] = item
        // }
  
        // return this.setState({ value }, () => {
        //   if (this.props.onItemPress) {
        //     this.props.onItemPress(item)
        //   }
        // })
        if(this.isExist(item.id)){
          //unselect it
          let finalArr = this.state.value;
          console.log("== finalArr bf: " + JSON.stringify(finalArr))
          let nIndex = (finalArr.findIndex((value)=> value == item.id));
          if(nIndex > -1){
            finalArr.splice(nIndex,1);
          }          
          console.log("== finalArr af: " + JSON.stringify(finalArr))
          this.setState({value:finalArr},()=>{
            this.forceUpdate();
          })
        }else{
          //selecte it
          this.state.value.push(item.id);
          this.forceUpdate();
        }

      }
    }
    else{

    }
   
  }

  /**
    * Method for check user already login or not
    */
   checkLogin() {
     this.props.navigate("ModalNavigator")
  }

  isExist(value){
    console.log("== isExist:" + value)
    let avail = false;
    console.log("== this.state.value:" + JSON.stringify(this.state.value))
    for(let i=0;i<this.state.value.length;i++){
      let val = this.state.value[i];
      if(val == value){
        avail = true;
        break;
      }
    }
    return avail;
  }
  render() {
    //console.log("this.props. selected value----->  : " + JSON.stringify(this.props.value)) 
    console.log("this.state.value : " + JSON.stringify(this.state.value))
    return (
      <View
        style={[
          styles.container,
          this.props.containerStyle
        ]}
      >

        {(this.props.data!=null && this.props.data!=undefined) ? this.props.data.map((item) => {
          console.log("== item : " + JSON.stringify(item));
          //console.log("== this.state.value[i[this.props.keyAttr]] : " + this.state.value[item[this.props.keyAttr]]);
          //console.log("== this.state.value[i] : " + this.state.value[item]);
          //console.log("== this.props.keyAttr : " + this.props.keyAttr);
          console.log("== value : " + JSON.stringify(this.state.value));
         
          return (
            <TagSelectItem
              {...this.props}
              label={item[this.props.labelAttr] ? item[this.props.labelAttr] : item}
              key={item[this.props.keyAttr] ? item[this.props.keyAttr] : item}
              onPress={this.handleSelectItem.bind(this, item)}
              //selected={(this.state.value[item[this.props.keyAttr]] || this.state.value[item]) && true}
              selected={this.isExist(item.id)}
            />
          )
        }) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }
})

export default TagSelect
