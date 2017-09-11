/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'dataService', 'appController', 'ojs/ojknockout', 'ojs/ojlistview'], function(oj, ko, $, data, app) {
  function driverDetailsViewModel() {
    var self = this;
    
    self.driverData = ko.observable();

    app.refreshDriver = function (response) {
      var driverData = JSON.parse(response);
      driverData.statusSelection = ko.observableArray([driverData.status]);
      driverData.prioritySelection = ko.observableArray([driverData.priority]);
      self.driverData(driverData);
    };

    self.handleActivated = function(params) {

      var parentRouter = params.valueAccessor().params['ojRouter']['parentRouter'];

      self.router = parentRouter.createChildRouter('driver').configure(function(stateId) {

        if(stateId) {

          var state = new oj.RouterState(stateId, {
            enter: function () {
              data.getDriver(stateId).then(function(response) {
                var driverData = JSON.parse(response);
                driverData.statusSelection = ko.observableArray([driverData.status]);
                driverData.prioritySelection = ko.observableArray([driverData.priority]);
                self.driverData(driverData);
              });
            }
          });

          return state;
        }

      });

      return oj.Router.sync();
    };

    self.dispose = function(info) {
      self.router.dispose();
    };

    self.locationId = ko.computed(function() {
      if (self.driverData()) {
        return self.driverData().locationId;
      }
    });

    // update incident when status or priority changes
    self.updateDriver = function(id, driver) {
      data.updateDriver(id, driver).then(function(response){
        // update success
      }).fail(function(response) {
        oj.Logger.error('Failed to update incident.', response);
      });
    };

    // priority selection change
    self.priorityChange = function(event, data) {
      updatePriorityStatus('priority', data);
    };

    // status selection change
    self.statusChange = function(event, data) {
      updatePriorityStatus('status', data);
    };

    function updatePriorityStatus(option, data) {
      if(data.option === "value") {
        if(data.value) {
          var driver = {};
          driver[option] = data.value;
          self.updateDriver(self.router.stateId(), driver);
        }
      }
    }

    // adjust content padding top
    self.handleAttached = function(info) {
      app.appUtilities.adjustContentPadding();
    };

    self.handleBindingsApplied = function(info) {
      if (app.pendingAnimationType === 'navParent' || app.pendingAnimationType === 'navChild') {
        app.preDrill();
      }
    };

    self.handleTransitionCompleted = function(info) {
      if (app.pendingAnimationType === 'navParent' || app.pendingAnimationType === 'navChild') {
        app.postDrill();
      }
    };

    // trigger click when selection changes
    self.optionChange = function (event, ui) {
      if(ui.option === 'selection') {
        $(ui.items[0]).trigger('click');
      }
    };
    
    var categoryDic = {'appliance': 'Notificação entregue fora do prazo', 'electrical': 'Aferição do Radar / Balança', 'heatingcooling': 'Outros', 'plumbing': 'Outros', 'general': 'Falta de sinalização'};

    self.categoryLabel = function(categoryID) {
      return categoryDic[categoryID];
    };
    
    var statusDic = {'accepted': 'Deferido', 'open': 'Em Análise', 'closed': 'Indeferido'};

    self.statusLabel = function(statusID) {
      return statusDic[statusID];
    };
    
    var leftClickAction = function() {
      //if(self.editMode()) {
      //  self.revertCustomerData();
      //  self.editMode(false);
      //} else {
        app.pendingAnimationType = 'navParent';
        window.history.back();
      //}
    };

    var rightClickAction = function() {
      //if(self.editMode()) {
      //  self.updateCustomerData();
      //  self.editMode(false);
      //} else {
      //  self.editMode(true);
      //}
    };

    var rightBtnLabel = ko.computed(function() {
      //if(self.editMode()) {
      //  return 'Save';
      //} else {
      //  return 'Edit';
      //}
    });

    var leftBtnLabel = ko.computed(function() {
      //if(self.editMode()) {
      //  return 'Cancel';
      //} else {
        return 'Back';
      //}
    });

    // customer details page header
    self.driverDetailsHeaderSettings = {
      name:'basicHeader',
      params: {
        title: 'Indicação de Condutor Infrator',
        startBtn: {
          id: 'backBtn',
          click: leftClickAction,
          display: 'icons',
          label: leftBtnLabel,
          icons: {start:'oj-hybrid-applayout-header-icon-back oj-fwk-icon'},
          visible: true
        },
        endBtn: {
          id: 'nextBtn',
          click: rightClickAction,
          display: 'all',
          label: rightBtnLabel,
          icons: {},
          visible: true,
          disabled: false
        }
      }
    };

  }

  return driverDetailsViewModel;
});
