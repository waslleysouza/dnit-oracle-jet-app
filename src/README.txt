ADDITIONAL INSTALLATION INFORMATION
-----------------------------------

Having scaffolded a web app using this template zip, follow these instructions to build and serve the app.

1. Theming - the app requires a custom theme
  a. Install node-sass:
    yo oraclejet:add-sass
  b. Build app with custom theme:
    grunt build --theme=fif:android
  c. Serve app with custom theme:
    grunt serve --theme=fif:android

2. Hybrid App Configuration
  a. Extend to hybrid project:
    yo oraclejet:add-hybrid --platforms=android,ios,windows --appid=com.jet.fixitfast --appname=FixItFast

    * If you intend to deploy to an iOS device, specify an appid that matches your iOS provisioning profile
    * If you have already scaffolded the app and wish to change the appid, you can edit hybrid/config.xml
    * You can only deploy to iOS from a Mac and you can only deploy to Windows from Windows 10

  b. Install required cordova plugins manually:
    cd hybrid
    cordova plugin add cordova-plugin-camera --save
    cordova plugin add cordova-plugin-contacts --save
    cordova plugin add cordova-plugin-geolocation --save
    cordova plugin add cordova-plugin-splashscreen --save

    * The following plugin versions have been tested with Cordova CLI v6.5.0:
      cordova-plugin-camera@2.4.0
      cordova-plugin-contacts@2.3.0
      cordova-plugin-geolocation@2.4.2
      cordova-plugin-splashscreen@4.0.2

  c. Add the following preferences to hybrid/config.xml
     Within <platform name="android”>:
       <preference name="ShowSplashScreenSpinner" value="false" />
       <preference name="FadeSplashScreen" value="false" />
       <preference name="AutoHideSplashScreen" value="false" />
     Within <platform name="ios”>:
       <preference name="SplashScreenDelay" value="2000" />
       <preference name="ShowSplashScreenSpinner" value="false" />
       <preference name="FadeSplashScreen" value="true" />
       <preference name="AutoHideSplashScreen" value="true" />

  d. If you wish to use Google maps rather than Oracle maps, follow the instructions in tabmap.js and incidentTabMap.js

3. Enable a full-access backend (optional)
    * By default, the app has read-only access to a public instance of an Oracle Mobile Cloud Service (MCS) mobile backend (MBE)
    * The app supports full read-write access, which can be enabled as follows:
  a. Implement your own MCS MBE that provides PUT, POST, PATCH and DELETE APIs in addition to the GET APIs required by the client app
  b. Enable create & update features in the app by setting self.isReadOnlyMode = false; in src/js/appController.js
  c. Edit src/js/appConfigExternal.js to specify the connection details of the MBE you have implemented in step a

4. Enable push notifications (optional)
    * The app supports push notifications, which can be enabled as follows:
  a. Follow all the steps 3a-3c above
  b. Create a Google Project that uses Google Cloud Messaging and/or create an iOS provisioning profile with push capability
  c. Add Android & iOS mobile clients to your MCS MBE and in their profiles specify the requisite GCM & APNs details obtained in step b
  d. In your MBE call the MCS API to initiate a push notification to registered devices when an incident is created
  e. Edit src/js/appConfigExternal.js to specify the Google Project ID obtained in step b as the 'senderID' for your MBE
  f. Edit src/js/PushClient.js to uncomment lines 100-104
  g. Add the phonegap-plugin-push Cordova plugin to the app and specify the Google Project ID obtained in step b as the SENDER_ID
  h. On iOS, build the app using the push-enabled provisioning profile you created in step b

  * Version 1.10.0 of the phonegap-plugin-push plugin has been tested with Cordova CLI v6.5.0

5. Build and serve the app
  a. To serve web app with fif android theme
    grunt serve --theme=fif:android --platform=web
  b. To serve hybrid app with fif theme to emulator
    grunt serve --theme=fif --platform=android|ios
  b. To serve hybrid app with fif theme to device
    grunt serve --theme=fif --platform=android|ios --device
  c. To serve hybrid app with fif android theme to browser
    grunt serve --theme=fif --platform=android|ios --browser

    * To deploy to an iOS device or to deploy in release mode to Android, you will require a buildConfig.xml file that specifies
      your signing credentials.  For more information about this, refer to the JET Developer Guide.
