import { StyleSheet, Platform } from 'react-native'
import { WINDOW, iPhoneX } from '../../lib/globals';

import {
    blue,
    gray
} from '../styles/color';

const style = StyleSheet.create({
    view: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        ...Platform.select({
            ios: {
                paddingTop: (iPhoneX) ? 44 : 20,
                height: (iPhoneX) ? 88 : 64
            },
            android: {
                paddingTop: 0,
                height: (WINDOW.height * 0.1)
            }
        })
    },
    headerStyle: {
        paddingRight: 5,
        paddingLeft: 5,
        backgroundColor: blue,
        elevation: 0, 
        shadowOpacity: 0, 
        borderBottomWidth: 0 
    },
    tabTitle: {
        color: 'white',
        lineHeight: null,
        textAlign: 'center',
    },
});

export default style;
