/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Example of Require.js boostrap javascript
 */
'use strict';
requirejs.config({
  // Path mappings for the logical module names
  paths:
  //injector:mainReleasePaths
  {
    'knockout': 'libs/knockout/knockout-3.4.0.debug',
    'mapping': 'libs/knockout/knockout.mapping-latest',
    'jquery': 'libs/jquery/jquery-3.1.1',
    'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.0',
    'promise': 'libs/es6-promise/es6-promise',
    'hammerjs': 'libs/hammer/hammer-2.0.8',
    'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0',
    'ojs': 'libs/oj/v3.2.0/debug',
    'ojL10n': 'libs/oj/v3.2.0/ojL10n',
    'ojtranslations': 'libs/oj/v3.2.0/resources',
    'signals': 'libs/js-signals/signals',
    'text': 'libs/require/text',
    'oraclemapviewer': 'libs/oraclemapsv2',
    'oracleelocation': 'libs/oracleelocationv3',
    'customElements': 'libs/webcomponents/CustomElements',
    'css': 'libs/require-css/css',
    'fetch' : 'libs/mpf/fetch',
    'pouchdb' : 'libs/mpf/pouchdb-6.1.1',
    'pouchfind' : 'libs/mpf/pouchdb.find',
    'signaturePad' : 'signature_pad',
    'persistenceUtils' : 'libs/mpf/persistenceUtils',
    'persistenceManager' : 'libs/mpf/persistenceManager',
    'simpleJsonShredding' : 'libs/mpf/simpleJsonShredding',
    'oracleRestJsonShredding' : 'libs/mpf/oracleRestJsonShredding',
    'defaultResponseProxy' : 'libs/mpf/defaultResponseProxy',
    'fetchStrategies' : 'libs/mpf/fetchStrategies',
    'cacheStrategies' : 'libs/mpf/cacheStrategies',
    'PersistenceXMLHttpRequest' : 'libs/mpf/PersistenceXMLHttpRequest',
    'persistenceStoreManager' : 'libs/mpf/persistenceStoreManager',
    'PersistenceStore' : 'libs/mpf/PersistenceStore',
    'PersistenceStoreFactory' : 'libs/mpf/persistenceStoreFactory',
    'pouchDBPersistenceStoreFactory' : 'libs/mpf/pouchDBPersistenceStoreFactory',
    'PouchDBPersistenceStore' : 'libs/mpf/pouchDBPersistenceStore',
    'localPersistenceStoreFactory' : 'libs/mpf/localPersistenceStoreFactory',
    'LocalPersistenceStore' : 'libs/mpf/localPersistenceStore',
    'offlineCacheManager' : 'libs/mpf/offlineCacheManager',
    'OfflineCache' : 'libs/mpf/OfflineCache',
    'defaultCacheHandler' : 'libs/mpf/defaultCacheHandler',
    'persistenceSyncManager' : 'libs/mpf/persistenceSyncManager',
    'logger': 'libs/mpf/logger',
    'appConfig': 'appConfigExternal'
  }
  //endinjector
  ,
  // Shim configurations for modules that do not expose AMD
  shim: {
    'jquery': {
      exports: ['jQuery', '$']
    }
  },
  // This section configures the i18n plugin. It is merging the Oracle JET built-in translation
  // resources with a custom translation file.
  // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
  // a path that is relative to the location of this main.js file.
  config: {
    ojL10n: {
      merge: {
        //'ojtranslations/nls/ojtranslations': 'resources/nls/menu'
      }
    }
  },
  // Increase timeout threshold to 30 seconds..
  waitSeconds: 30
});

/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 */
require(['ojs/ojcore', 'knockout', 'appController'], function (oj, ko, app) {

  $(function() {

    function init() {
      oj.Router.sync().then(function () {
        // bind your ViewModel for the content of the whole page body.
        ko.applyBindings(app, document.getElementById('page'));
      }, function (error) {
        oj.Logger.error('Error in root start: ' + error.message);
      });
    }

    // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
    // event before executing any code that might interact with Cordova APIs or plugins.
    if ($(document.body).hasClass('oj-hybrid')) {
      document.addEventListener("deviceready", init);
    } else {
      init();
    }

  });

});
