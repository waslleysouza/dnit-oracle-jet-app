/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojinputtext'], function() {
  function createIncidentSummaryViewModel() {
    var self = this;

    var categoryDic = {'appliance': 'Notificação entregue fora do prazo', 'electrical': 'Aferição do Radar / Balança', 'heatingcooling': 'Outros', 'plumbing': 'Plumbing', 'general': 'Falta de sinalização'};

    self.categoryLabel = function(categoryID) {
      return categoryDic[categoryID];
    };

    self.priorityLabel = function(priorityID) {
      return priorityID.charAt(0).toUpperCase() + priorityID.slice(1);
    };

  }

  return createIncidentSummaryViewModel;

});
