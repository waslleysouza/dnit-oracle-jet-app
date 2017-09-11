/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'jquery', 'knockout'], function (oj, $, ko) {
  function connectionMessageViewModel(app) {
    var self = this;

    // web connection change event
    window.addEventListener('online',  onlineHandler);
    window.addEventListener('offline', offlineHandler);

    // cordova network information plugin connection change event
    document.addEventListener('online', onlineHandler, false);
    document.addEventListener('offline', offlineHandler, false);

    var MESSAGES = {
      'online': 'You are connected to network.',
      'offline': 'You are not connected to network.'
    };

    self.online = ko.observable(true);
    self.message = ko.observable()

    var currentTimer;

    // toggle between primary message and secondary message
    self.toggleMessageContent = function(firstText, secondText) {
      self.message(firstText);
      currentTimer = window.setTimeout(function () {
        self.message(secondText);
        self.toggleMessageContent(secondText, firstText);
      }, 2000)
    }


    function onlineHandler() {
      document.body.classList.remove('offline');

      self.online(true);
      self.message(MESSAGES['online']);

      self.openDrawer();

    }

    function offlineHandler() {
      document.body.classList.add('offline');

      self.online(false);
      self.message(MESSAGES['offline']);

      return self.openDrawer();

    }

    self.openDrawer = function (secondMessage) {
      oj.OffcanvasUtils.open({selector: '#connectionDrawer', modality: 'modaless', displayMode: 'overlay', content: '#pageContent' });
      clearTimeout(currentTimer);

      if(secondMessage)
        self.toggleMessageContent(self.message(), secondMessage)
    }

    self.showAfterUpdateMessage = function () {
      var state = oj.Router.rootInstance.currentState().id;
      self.message('Updates will be applied when online.');
      self.openDrawer();
    }

    self.closeDrawer = function () {
      oj.OffcanvasUtils.close({selector: '#connectionDrawer' });
    };

    // clear timer when drawer is dismissed
    $("#connectionDrawer").on("ojclose", function(event, offcanvas) {
      clearTimeout(currentTimer);
    });

  }
  return connectionMessageViewModel;
})
