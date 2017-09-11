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
        'appController',
        'dataService',
        'ojs/ojknockout',
        'ojs/ojinputtext'],
function(oj, ko, $, app, data) {
  function driverCreateViewModel() {
    var self = this;

    // adjust content padding
    self.handleTransitionCompleted = function(info) {
      app.appUtilities.adjustContentPadding();
    };

     self.driver = {
      violationNumber: ko.observable(),
      name: ko.observable(),
      mobile: ko.observable(),
      doc1: ko.observable(),
      doc2: ko.observable()
    };

    // create new customer
    // TODO upload customer pic
    self.createCustomer = function() {
      data.createDriver(ko.toJS(self.driver)).then(function(response){
        var result = JSON.parse(response);
        app.goToDriver(result.id);
      }).fail(function(response) {
        oj.Logger.error('Failed to create driver.', response);
        oj.Router.rootInstance.go('drivers');
      });
    };

    // go to previous page
    self.goToPrevious = function() {
      window.history.back();
    };

    // create customer page header settings
    self.driverCreateHeaderSettings = function(){
      return {
        name:'basicHeader',
        params: {
          title: 'Indicação de Condutor Infrator',
          startBtn: {
            id: 'backBtn',
            click: self.goToPrevious,
            display: 'icons',
            label: 'Back',
            icons: {start:'oj-hybrid-applayout-header-icon-back oj-fwk-icon'},
            visible: true
          },
          endBtn: {
            id: 'saveBtn',
            click: self.createDriver,
            display: 'all',
            label: 'Salvar',
            icons: {},
            visible: true,
            disabled: app.isReadOnlyMode
          }
        }
      };
    };

  }

  return driverCreateViewModel;

});
