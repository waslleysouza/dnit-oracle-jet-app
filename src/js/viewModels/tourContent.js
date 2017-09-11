/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

 // view model for the tour content with filmstrip
'use strict';
define(['jquery', 'ojs/ojfilmstrip', 'ojs/ojpagingcontrol'], function($) {
  function tourContentViewModel() {
    var self = this;

    self.steps = [
      {
        'title': 'painel',
        'description': 'Informações sobre os recursos que você abriu.',
        'imgSrc': 'css/images/dashboard_image@2x.png',
        'color': '#4493cd'
      },
      //{
      //  'title': 'maps',
      //  'description': 'Abra e acompanhe seus recursos rapidamente.',
      //  'imgSrc': 'css/images/maps_image@2x.png',
      //  'color': '#FFD603'
      //},
      {
        'title': 'recursos',
        'description': 'Abra e acompanhe seus recursos rapidamente.',
        'imgSrc': 'css/images/incidents_image@2x.png',
        'color': '#E5003E'
      },
      {
        'title': 'condutores',
        'description': 'Indique o correto condutor de uma infração.',
        'imgSrc': 'css/images/customers_image@2x.png',
        'color': '#009636'
      }
    ];

    self.pagingModel = null;

    self.getItemInitialDisplay = function(index) {
      return index < 1 ? '' : 'none';
    };

    self.getPagingModel = function() {
      if (!self.pagingModel) {
        var filmStrip = $("#filmStrip");
        var pagingModel = filmStrip.ojFilmStrip("getPagingModel");
        self.pagingModel = pagingModel;
      }
      return self.pagingModel;
    };

  }
  return tourContentViewModel;
});
