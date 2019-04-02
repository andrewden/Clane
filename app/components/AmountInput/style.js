import { StyleSheet } from 'react-native'
import { iPhoneX } from '../../lib/globals'
import { white } from '../../assets/styles/color';

const style = StyleSheet.create({
    imageView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop:15
    },
    image: {
        borderWidth: 2,
        borderColor: white
    },
    inputView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 30
    },
    inputText: {
        color: white,
        fontSize: 60,
        fontWeight: '300',
    },
    keyboardView: {
        paddingBottom: 10
    },
    keyboardRow: {
        flexDirection: 'row',
        paddingHorizontal: 30,
        justifyContent: 'space-between'
    },
    key: {
        width: '28%',
        paddingVertical: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#FFFFFF99',
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    keyText: {
        color: white,
        fontSize: 26,
        fontWeight: '400'
    },
    noBorder: {
        borderBottomWidth: 0
    },
    closeBtn: {
        alignItems: 'flex-end',
        paddingRight: 10,
        position: 'absolute',
        right: 10,
        top: 12,
        zIndex: 100
    },
    buttonView: {
        width: '100%',
        paddingHorizontal: 15,
        height: 80,
        paddingBottom: iPhoneX ? 30 : 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: '100%',
        height: 60,
        borderRadius: 8,
        backgroundColor: '#FFFFFFAA',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '800',
    },
    closeIcon: {
        fontSize: 48,
        color: white
    },
    closeButton: {
        height: 40,
        width: 40,
        position: 'absolute',
        left: 20,
        zIndex: 10,
        top: iPhoneX ? 60 : 40
    },
    nameView:{
        alignItems:'center',
        justifyContent:'center',
        marginTop: 10,
    },
    nameLabel:{
        color: white,
        fontSize : 16
    },
    topViewStyle:{
        flex:1,
        alignContent:'center',
        justifyContent:'center'
    }

});

export default style;
