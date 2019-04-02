/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
#import <react-native-branch/RNBranch.h>
#import "Intercom/intercom.h"
#import "RNFirebaseMessaging.h"
#import "RNFirebaseNotifications.h"
#import <Firebase.h>
#import "AppDelegate.h"

//#import "Orientation.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "RNSplashScreen.h"  // here
#import <React/RCTLinkingManager.h>

#import "RNFirebaseLinks.h"
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>




#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [Intercom setApiKey:@"ios_sdk-306ae2c245588e1da9eaf7192a61c8ac1473c728" forAppId:@"xcpid1v0"];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES]; // <-- add this
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"claneapp"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  [FIRApp configure];
  [FIROptions defaultOptions].deepLinkURLScheme = @"https://claneapp.page.link";
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [Fabric with:@[[Crashlytics class]]];
  [RNSplashScreen show];  // here

  return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  
  // Intercom
  [Intercom setDeviceToken:deviceToken];
  
}

//- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
//  return [Orientation getOrientation];
//}
  
- (BOOL)application:(UIApplication *)application
              openURL:(NSURL *)url
              options:(NSDictionary<NSString *, id> *)options {
  if (![RNBranch.branch application:application openURL:url options:options]) {
    // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
  }
  return YES;
//    return [[RNFirebaseLinks instance] application:application openURL:url options:options];
}
  
- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray *))restorationHandler {
//  return [[RNFirebaseLinks instance] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
return [RNBranch continueUserActivity:userActivity];
}


- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}




//- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
//  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
//{
//  return [RCTLinkingManager application:application openURL:url
//                      sourceApplication:sourceApplication annotation:annotation];
//}
//
//// Only if your app is using [Universal Links](https://developer.apple.com/library/prerelease/ios/documentation/General/Conceptual/AppSearch/UniversalLinks.html).
//- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
// restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
//{
//  return [RCTLinkingManager application:application
//                   continueUserActivity:userActivity
//                     restorationHandler:restorationHandler];
//}

@end
