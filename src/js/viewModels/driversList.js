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
        'ojs/ojoffcanvas',
        'ojs/ojlistview',
        'ojs/ojswipetoreveal',
        'ojs/ojjquery-hammer',
        'promise',
        'ojs/ojpulltorefresh',
        'ojs/ojmodel',
        'ojs/ojcheckboxset',
        'ojs/ojarraytabledatasource',
        'ojs/ojpopup',
        'ojs/ojanimation'],
function(oj, ko, $, data, app) {
  function driversListViewModel(params) {

    var self = this;

    function setupPullToRefresh() {
      oj.PullToRefreshUtils.setupPullToRefresh($('body')[0], function() {
        return new Promise(function(resolve, reject) {
          // check for new incidents
          data.getDrivers().then(function(response) {
            var driversData = JSON.parse(response);
            processDriversData(driversData);
            resolve();
          }).fail(function(response){
            // TODO
            reject();
          });
        });
        // TODO fix refresh issue on transition
      }, {
        'primaryText': 'Atualizando lista de condutores…',
        'secondaryText': self.lastUpdate ? 'Última Atualização em ' + (new Date(self.lastUpdate)).toUTCString() : '', 'threshold': 100
      });

      // adjust position for pull to refresh panel
      // adjust z-index to overlay on the padding of .oj-applayout-content
      // because .oj-hybrid-applayout-page now has white background
      var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
      var contentElems = document.getElementsByClassName('oj-pulltorefresh-panel');

      for(var i=0; i<contentElems.length; i++) {
        if (topElem) {
          contentElems[i].style.position = 'relative';
          contentElems[i].style.top = topElem.offsetHeight+'px';
          contentElems[i].style.zIndex = 100;
        }
      }

    }

    // load incidents on activation
    self.handleActivated = function(params) {

      self.parentRouter = params.valueAccessor().params['ojRouter']['parentRouter'];

      app.refreshDrivers = function (response) {
        var driversData = JSON.parse(response);
        processDriversData(driversData);
      };

      self.driversPromise = data.getDrivers();

      self.driversPromise.then(function(response) {

        var driversData = JSON.parse(response);

        processDriversData(driversData);

        setupPullToRefresh();
      });

      return self.driversPromise;
    };

    self.handleBindingsApplied = function(info) {
      if (app.pendingAnimationType === 'navParent') {
        app.preDrill();
      }
    };

    self.handleAttached = function(info) {

      app.appUtilities.adjustContentPadding();

      $('body').on({
        'ojcomplete': function() {
          setupPullToRefresh();
        }
      });

      $('#driversListView').on({
        'ojdestroy': function() {
          oj.PullToRefreshUtils.tearDownPullToRefresh('body');
        }
      });
    };

    self.handleTransitionCompleted = function(info) {

      if (app.pendingAnimationType === 'navParent') {
        app.postDrill();
      }

      // invoke zoomIn animation on floating action button
      var animateOptions = { 'delay': 0, 'duration': '0.3s', 'timingFunction': 'ease-out' };
      oj.AnimationUtils['zoomIn']($('#addDriver')[0], animateOptions);

    };

    function processDriversData(driversData) {

      self.lastUpdate = driversData.lastUpdate;

      driversData.result.forEach(function(driver){
        driver.statusObservable = ko.observable(driver.status);
      });

      //app.unreadDriversNum(unreadDriversNum);

      driversData.result.sort(function(a, b) {
        return (a.createdOn < b.createdOn) ? 1 : (a.createdOn > b.createdOn) ? -1 : 0;
      });


      driversData.result.forEach(function (driver) {
        driver.cached = false;
      });

      self.allDrivers = driversData.result;

      var results = self.filterDrivers();

      // show message when no data is available.
      if(results.length === 0) {
        $( "#driversListView" ).ojListView({ "translations": { msgNoData: "new message" }} );
      }

      // update observable
      self.filteredDrivers(results);
      // trigger listview to reload (skipping model change event animation)
      self.driversTableData.reset();


    }

    self.scrollElem = document.body;

    self.priorityFilterArr = ko.observable(['high', 'normal', 'low']);
    self.statusFilterArr = ko.observable(['open', 'accepted', 'closed']);

    self.allDrivers = [];

    self.filteredDrivers = ko.observableArray([]);
    self.driversTableData = new oj.ArrayTableDataSource(self.filteredDrivers, { idAttribute: 'id' });

    self.filterDrivers = function() {
      return self.allDrivers.filter(function(driver) {
        return self.priorityFilterArr().indexOf(driver.priority) > -1 && self.statusFilterArr().indexOf(driver.statusObservable()) > -1;
      });
    };

    // update incidents list when priority or status filter changes
    self.priorityFilterArr.subscribe(function(newValue) {
      var filteredResults = self.filterDrivers();
      self.filteredDrivers(filteredResults);
    });

    self.statusFilterArr.subscribe(function(newValue) {
      var filteredResults = self.filterDrivers();
      self.filteredDrivers(filteredResults);
    });

    self.selectHandler = function(event, ui) {
      if(ui.option === 'selection' && ui.value[0]) {
        event.preventDefault();

        // todo investigate pull-to-refresh and android drill in/out animation
        app.pendingAnimationType = 'navChild';
        app.goToDriver(ui.value[0]);
      }
    };

    self.handleMenuItemSelect = function(event, ui) {
      var id = ui.item.prop("id");
      if (id == "return")
        self._handleReturn();
      else if (id == "open")
        self._handleOpen();
      else if (id == "accept")
        self._handleAccept();
      else if (id == "close")
        self._handleClose();
    };

    self.goToAddDriver = function() {
      self.parentRouter.go('driverCreate');
    };

    self.handleReady = function() {
      // register swipe to reveal for all new list items
      $("#driversListView").find(".demo-item-marker").each(function(index) {
        var id = $(this).prop("id");
        var startOffcanvas = $(this).find(".oj-offcanvas-start").first();
        var endOffcanvas = $(this).find(".oj-offcanvas-end").first();

        // setup swipe actions
        oj.SwipeToRevealUtils.setupSwipeActions(startOffcanvas);
        oj.SwipeToRevealUtils.setupSwipeActions(endOffcanvas);

        // make sure listener only registered once
        endOffcanvas.off("ojdefaultaction");
        endOffcanvas.on("ojdefaultaction", function() {
          // No default action
        });
      });
    };

    self.handleDestroy = function() {
      // register swipe to reveal for all new list items
      $("#driversListView").find(".demo-item-marker").each(function(index) {
        var startOffcanvas = $(this).find(".oj-offcanvas-start").first();
        var endOffcanvas = $(this).find(".oj-offcanvas-end").first();

        oj.SwipeToRevealUtils.tearDownSwipeActions(startOffcanvas);
        oj.SwipeToRevealUtils.tearDownSwipeActions(endOffcanvas);
      });
    };

    self.closeToolbar = function(which, item) {
      var toolbarId = "#"+which+"_toolbar_"+item.prop("id");
      var drawer = {"displayMode": "push", "selector": toolbarId};

      oj.OffcanvasUtils.close(drawer);
    };

    self.handleAction = function(which, action, model) {

      if (model !== null && model.id) {
        // offcanvas won't be open for default action case
        if (action != "default") {
          self.closeToolbar(which, $(model));
        }

        var index = self.allDrivers.map(function(e) { return e.id; }).indexOf(model.id);
        self.allDrivers[index].statusObservable(action);

        data.updateDriver(model.id, {status: action}).then(function(response) {
          // update success
          // re-apply filter to incidents after changing status
          self.filterDrivers();
        }).fail(function(response){
          oj.Logger.error('Failed to update driver.', response);
        });

      } else {
        id = $("#driversListView").ojListView("option", "currentItem");
      }
    };

    self._handleAccept = function(model) {
      self.handleAction('second', 'accepted', model);
    };

    self._handleOpen = function(model) {
      self.handleAction('second', 'open', model);
    };

    self._handleReturn = function(model) {
      self.handleAction('second', 'open', model);
    };

    self._handleTrash = function(model) {
      self.handleAction('second', 'closed', model);
    };

    self._handleOKCancel = function() {
      $("#modalDialog1").ojDialog("close");
    };

    self.removeModel = function(model) {
      self.allDrivers.remove(function(item) {
        return (item.id == model.id);
      });
    };
    
    var statusDic = {'accepted': 'Deferido', 'open': 'Em Análise', 'closed': 'Indeferido'};

    self.statusLabel = function(statusID) {
      return statusDic[statusID];
    };
    
    var statusColorDic = {'accepted': 'green', 'open': 'blue', 'closed': 'red'};

    self.statusColor = function(statusID) {
      return statusColorDic[statusID];
    };
  }

  return driversListViewModel;

});
