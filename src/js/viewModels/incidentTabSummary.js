/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['jquery', 'appController', 'ojs/ojknockout', 'ojs/ojlistview'], function($, app) {
  function summaryViewModel() {
    var self = this;

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

  }

  return summaryViewModel;
});
