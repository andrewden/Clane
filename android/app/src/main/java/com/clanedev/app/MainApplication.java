package com.clanedev.app;

import android.app.Application;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.horcrux.svg.SvgPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import cl.json.RNSharePackage;
import com.sha256lib.Sha256Package;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.opensettings.OpenSettingsPackage;
import com.robinpowered.react.Intercom.IntercomPackage;
import com.wix.interactable.Interactable;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.branch.rnbranch.RNBranchPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.instabug.reactlibrary.RNInstabugReactnativePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.horcrux.svg.SvgPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import cl.json.RNSharePackage;
import com.sha256lib.Sha256Package;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.opensettings.OpenSettingsPackage;
import com.robinpowered.react.Intercom.IntercomPackage;
import com.wix.interactable.Interactable;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import io.branch.rnbranch.RNBranchPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.instabug.reactlibrary.RNInstabugReactnativePackage;
import io.branch.referral.Branch;
import io.intercom.android.sdk.Intercom;

import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.links.RNFirebaseLinksPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;


import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
          		new RNInstabugReactnativePackage.Builder("33e6c52c8b06b4e5fe0249fd8d132471",MainApplication.this)
							.setInvocationEvent("shake")
							.setPrimaryColor("#1D82DC")
							.setFloatingEdge("left")
							.setFloatingButtonOffsetFromTop(250)
							.build(),
            new RNFetchBlobPackage(),
              new IntercomPackage(),
            new ReactNativeYouTube(),
            new SvgPackage(),
            new SplashScreenReactPackage(),
            new RNSharePackage(),
            new Sha256Package(),
            new ReactNativeRestartPackage(),
            new OpenSettingsPackage(),
            new Interactable(),
            new RNGestureHandlerPackage(),
            new RNFirebasePackage(),
            new RNDeviceInfo(),
            new RNBranchPackage(),
            new BackgroundTimerPackage(),
            new LottiePackage(),
            new RNFirebaseAnalyticsPackage(),
            new RNFirebaseCrashlyticsPackage(),
            new VectorIconsPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNFirebaseLinksPackage(), // <-- Add this line
            new RNFirebasePerformancePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Intercom.initialize(this, "android_sdk-aff13e1d1119a9dc72299174e8873a2e8d780c79", "xcpid1v0");
    Branch.getAutoInstance(this);
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
