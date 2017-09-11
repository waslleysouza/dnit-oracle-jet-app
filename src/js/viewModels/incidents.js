/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

// This incidents viewModel controls dashboard/list/map tabs.

'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'dataService', 'appController', 'ojs/ojknockout', 'ojs/ojpopup'], function(oj, ko, $, data, app) {

  function incidentsViewModel() {

    var self = this;

    self.showFilterBtn = ko.observable(false);

    self.handleActivated = function(params) {

      // setup child router
      var parentRouter = params.valueAccessor().params['ojRouter']['parentRouter'];

      self.router = parentRouter.createChildRouter('incidentsTab').configure({
        'tabdashboard': { label: 'Dashboard', isDefault: true },
        'tablist': { label: 'Incidents List' },
        'tabmap': { label: 'Map' }
      });
      
      // setup animations between nav tabs
      self.pendingAnimationType = ko.observable(null);

      var switcherCallback = function(context) {
        return self.pendingAnimationType();
      };

      self.moduleConfig = ko.computed(function() {
        var animation;
        if(self.pendingAnimationType() === 'navSiblingEarlier') {
          animation = oj.ModuleAnimations.createAnimation({'effect':'slideOut','direction':'end','persist':'all'}, {'effect':'slideIn','direction':'end'}, false)
        } else if(self.pendingAnimationType() === 'navSiblingLater') {
          animation = oj.ModuleAnimations.createAnimation({'effect':'slideOut','direction':'start','persist':'all'}, {'effect':'slideIn','direction':'start'}, false)
        } else {
          animation = oj.ModuleAnimations.switcher(switcherCallback);
        }

        return $.extend(true, {}, self.router.moduleConfig, {
          'animation': animation,
          'cacheKey': self.router.currentValue()
        })
      });

      self.router.currentState.subscribe(function(newState) {
        if(typeof newState !== "undefined") {
          if(newState.id === 'tablist') {
            self.showFilterBtn(true);
          } else {
            self.showFilterBtn(false);
          }
        }
      });

      return oj.Router.sync();
    };

    self.dispose = function(info) {
      self.router.dispose();
    };

    // update nav tabs animation based on selection change
    self.navBarChange = function(event, ui) {

      if(ui.option === 'currentItem') {

        var previousValue = ui.previousValue || self.router.stateId();

        switch(previousValue) {
          case 'tabdashboard':
            self.pendingAnimationType('navSiblingLater');
            break;
          case 'tablist':
            if(ui.value === 'tabdashboard') {
              self.pendingAnimationType('navSiblingEarlier');
            } else {
              self.pendingAnimationType('navSiblingLater');
            }
            break;
          case 'tabmap':
            self.pendingAnimationType('navSiblingEarlier');
        }
      }
    };

    self.closePopup = function() {
      return $('#filterpopup').ojPopup('close', '#filterIncident');
    };

    // settings for headers on incidents page
    self.incidentsHeaderSettings = {
      name: 'basicHeader',
      params: {
        title: 'Recursos',
        startBtn: {
          id: 'navDrawerBtn',
          click: app.toggleDrawer,
          display: 'icons',
          label: 'Navigation Drawer',
          icons: {start: 'oj-fwk-icon oj-fwk-icon-hamburger'},
          visible: true
        },
        endBtn: {
          id: 'filterPopUpBtn',
          click: function() {
            $( "#filterpopup" ).ojPopup( "option", "position", {
              "my": {
                "horizontal": "end",
                "vertical": "top"
              },
              "at": {
                "horizontal": "end",
                "vertical": "bottom"
              },
              "of": ".oj-hybrid-applayout-header-no-border",
              "offset": {
                "x": -10,
                "y": 0
              }
            });

            return $('#filterpopup').ojPopup('open', '#filterIncident');
          },
          display: 'icons',
          label: 'incidents filters',
          icons: { start:'oj-fwk-icon demo-icon-font-24 demo-filter-icon' },
          visible: self.showFilterBtn
        }
      }
    }
  }

  return incidentsViewModel;
});
