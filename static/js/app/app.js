define(['Backbone', 'marionette', 'jquery', 'app/views/map', 'app/views/search', 'app/views/header', 'app/views/navigation', 'app/core/router', 'app/core/mediator', 'app/helpers/search', 'app/helpers/ajax', 'app/collections/recentplaces', 'app/collections/selectedplaces', 'app/views/layouts/selectedplaces'], function(Backbone, Marionette, $, MapView, SearchView, HeaderView, NavigationView, GazRouter, mediator, searchHelper, ajaxHelper, RecentPlaces, SelectedPlaces, SelectedPlacesLayout) {

    var app = new Marionette.Application({
        views: {},
        models: {},
        collections: {},
        user: {},
        ui_state: {
            'resultsScroll': 0
        },
        helpers: {
            'search': searchHelper
        },
        mediator: mediator
    });

    app.addRegions({
        'map': '#mapBlock',
        'search': '#searchBlock',
        'navTabs': '#tabNavigation',
        'results': '#mainResultsContent',
        'placeDetail': '#placeDetailContent',
        'selectedPlaces': '#selectedPlacesContent',
        'modal': '#lightBoxContent'
        //'results': '#resultsBlock'
    });
    
    app.on('initialize:after', function() {
        $.getJSON("/user_json", {}, function(user) {
            app.user = user;
            app.views.search = new SearchView().render();
            app.views.header = new HeaderView();
            app.views.navigation = new NavigationView();
            //app.collections.recentPlaces = new RecentPlaces();
            app.collections.selectedPlaces = new SelectedPlaces();
            app.views.selectedPlaces = new SelectedPlacesLayout({'selectedCollection': app.collections.selectedPlaces});
            app.selectedPlaces.show(app.views.selectedPlaces);
            app.views.map = new MapView().render();
            ajaxHelper.setupAjax(); //set csrf token headers
            app.router = new GazRouter();
            $('#loadingPage').hide();
            Backbone.history.start();
        });
    });

    
    return app;
});
