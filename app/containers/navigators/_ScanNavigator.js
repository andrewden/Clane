import { createStackNavigator } from 'react-navigation';
import mainStyles from '../../assets/styles/app';
import Scan from '../screens/Scan/index';

const ScanNavigator = createStackNavigator({
    Scan: {
        screen: Scan,
        navigationOptions: {
            title: 'Scan',
            headerStyle: mainStyles.headerStyle,
            headerTitleStyle: mainStyles.tabTitle
        }
    }
});

export default ScanNavigator;
