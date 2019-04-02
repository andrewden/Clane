
// @flow
// import firebase from 'react-native-firebase';
// import * as colors from './app/assets/styles/color';
// // Optional flow type
// import  { RemoteMessage } from 'react-native-firebase';
// export default async (message: RemoteMessage) => {
//     // handle your message
//   console.log("Data Android--->",message);
//   if (message.data.body != null) {
//     const notification = new firebase.notifications.Notification()
//     .setNotificationId(message.messageId)
//     .setTitle(message.data.title)
//     .setBody(message.data.body)
//     .setData(message.data);
//     notification
//     .android.setChannelId('clane-channel')
  //   .android.setSmallIcon('@drawable/notification_c')
  //  .android.setColor(colors.blue)
//     .android.setAutoCancel(true);
//     firebase.notifications().displayNotification(notification);
//   }
//     return Promise.resolve();
// }

// @flow
import firebase from 'react-native-firebase';
import * as colors from './app/assets/styles/color';
import { RemoteMessage } from 'react-native-firebase';
const channel1 = new firebase.notifications.Android.Channel('test-channel1', 'Test Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel')
      .setSound('@raw/cheerful.mp3');
firebase.notifications().android.createChannel(channel1);
export default async (message: RemoteMessage) => {
  console.log("Data--->", message);
    const notification = new firebase.notifications.Notification()
      .setNotificationId(message.messageId)
      .setTitle(message.data.title)
      .setBody(message.data.body)
      .setSound(channel1.sound)
      .setData(message.data);
    notification
      .android.setChannelId('test-channel1')
      .android.setSmallIcon('@drawable/notification_c')
      .android.setColor(colors.blue)
      .android.setAutoCancel(true);
    firebase.notifications().displayNotification(notification);
  return Promise.resolve();
}
