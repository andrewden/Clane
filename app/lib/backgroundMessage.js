import firebase from 'react-native-firebase';
// Optional flow type
import  { RemoteMessage } from 'react-native-firebase';

export default async (message) => {
    if (message) {
        const {
            topic, title, body
        } = message.data;
        const notification = new firebase.notifications.Notification()
            .setNotificationId(getRandomNotificationId())
            .setTitle(title)
            .setBody(body)
            .setSound('default')
            .setData(message.data);
        notification
            .android.setChannelId('my_default_channel')
            .android.setSmallIcon('@drawable/ic_launcher');
        firebase.notifications().displayNotification(notification);
    }
    Promise.resolve();
};