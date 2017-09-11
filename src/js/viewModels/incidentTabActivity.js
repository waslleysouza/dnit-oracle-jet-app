/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore', 'knockout', 'jquery',
        'dataService',
        'appController',
        'ojs/ojknockout',
        'ojs/ojlistview',
        'ojs/ojarraytabledatasource',
        'ojs/ojinputtext',
        'ojs/ojpulltorefresh',
        'ojs/ojjquery-hammer',
        'ojs/ojtoolbar'], function(oj, ko, $, data, app) {
  function activityViewModel(params) {

    var self = this;

    // retrieve incident id
    self.incidentId = params['ojRouter']['parentRouter']['parent'].currentState().id;

    self.scrollElem = document.body;

    self.allActivities = ko.observableArray([]);
    self.dataSource = new oj.ArrayTableDataSource(self.allActivities, { idAttribute: 'id' });

    function setupPullToRefresh() {
      var root = $('#activityListView').ojListView('widget').get(0);
      oj.PullToRefreshUtils.setupPullToRefresh(root, function() {
        return getActivities();
      }, {
        'primaryText': 'Verificando novas atividades…',
        'secondaryText': self.lastUpdate ? 'Last Updated at ' + new Date(self.lastUpdate).toUTCString() : '', 'threshold': 100
      });
    }

    function getActivities() {
      // check for new activities
      return new Promise(function (resolve, reject) {
        data.getIncidentActivities(self.incidentId).then(function(response) {
          var data = JSON.parse(response);
          var results = data.activities;

          self.lastUpdate = data.lastUpdate;

          processActivities(results);
          setupPullToRefresh();

          resolve();
        }).catch(function (e) {
          reject(e);
        });
      });
    }

    function processActivities(results) {
      results.sort(function(a, b) {
        return (a.createdOn < b.createdOn) ? 1 : (a.createdOn > b.createdOn) ? -1 : 0;
      });

      self.allActivities(results);

      self.dataSource.reset();

      if(results.length === 0) {
        $('#activityListView').ojListView({'translations': { msgNoData: 'No Activity' }});
        $('#activityListView').ojListView('refresh');
      }
    }

    // ajudst content padding top
    self.handleAttached = function(info) {
      app.appUtilities.adjustContentPadding();

      $('#upload-activity-pic').change({ imgHolder: self.imageSrc }, function(event) {
        app.photoOnChange(event);
      });

    };

    self.handleActivated = function (info) {
      getActivities();

      $('#activityListView').on({
        'ojcomplete': function() {
          setupPullToRefresh();
        }
      });

      $('#activityListView').on({
        'ojdestroy': function() {
          var root = $('#activityListView').ojListView('widget').get(0);
          oj.PullToRefreshUtils.tearDownPullToRefresh(root);
        }
      });
    }

    app.refreshActivities = function (response) {
      var data = JSON.parse(response);
      var results = data.activities;
      self.lastUpdate = data.lastUpdate;

      processActivities(results);
    }

    self.textValue = ko.observable();
    self.imageSrc = ko.observable();

    // handler for photo change
    self.changePhoto = function() {

      if(!navigator.camera) {
        $('#upload-activity-pic').trigger('click');
      } else {
        return app.openBottomDrawer(self.imageSrc);
      }
    };

    // post to activity list
    self.postActivity = function(input, imageSrc) {

      var userProfile = ko.mapping.toJS(app.userProfileModel);

      var new_activity = {
        id: Math.floor(Date.now() / 1000),
        userId: userProfile.id,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        role: userProfile.role,
        createdOn: new Date(Date.now()).toISOString(),
        picture: ''
      };

      if(input) {
        new_activity.comment = input;
        new_activity.picture = imageSrc;

        self.textValue('');
        self.imageSrc('');

        // reset file upload input
        $('#upload-activity-pic').val('');

        data.postIncidentActivity(self.incidentId, new_activity.comment, new_activity.picture).then(function(response){
          self.allActivities.unshift(JSON.parse(response));
        }).fail(function(response) {
          oj.Logger.error('Failed to post activity', response);
        });
      }
    };

  }

  return activityViewModel;
});
