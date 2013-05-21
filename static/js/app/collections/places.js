define(['Backbone','app/models/place', 'app/core/mediator', 'app/helpers/search', 'backbone_paginator'], function(Backbone, Place, mediator, searchHelper) {

    var Places = Backbone.Paginator.requestPager.extend({
        'model': Place,
        'paginator_core': {
            'type': 'GET',
            'url': '/1.0/place/search.json?',
            'dataType': 'json'
        },
        'paginator_ui': {
            'firstPage': 1,
            'currentPage': 1,
            'perPage': 50
//            'sort': '',
//            'q': '',
//            'feature_type': '',
//            'bbox': '',
//            'start_date': '',
//            'end_date': ''
        },
        'server_api': {

        },

        //since our server-side API URL and client-side urls are different, we store the values we need for the client-side url in 'client_api'
        //FIXME: name 'client_api' something better?
        'client_api': {
            'q': '',
            'origins': ''
        },

        //is called from the controller with the URL options
        //FIXME: since we are setting client URL and server URL values, maybe rename to 'setApi' or 'setAPI' ?
        'setServerApi': function(options) {
            this.server_api.q = this.client_api.q = options.q || '';
            this.client_api.origins = options.origins ? options.origins : '';
            this.server_api.q = options.origins ? this.server_api.q + " " + searchHelper.getOriginQuery(options.origins) : this.server_api.q;
            this.server_api.feature_type = options.feature_type || null;
            this.server_api.bbox = options.bbox || null;
            this.server_api.start_date = options.start_date || null;
            this.server_api.end_date = options.end_date || null;
            this.server_api.feature_type = options.feature_type || null;
            this.server_api.page = options.page || null;
            console.log("server api", this.server_api);
            return this;    
        },
       
        'getSearchURL': function() {
            var queryObj = this.getQueryObj();
            queryObj.q = this.client_api.q;
            if (this.client_api.origins) {
                queryObj.origins = this.client_api.origins;
            } else {
                delete(queryObj.origins);
            }
            return '#search' + searchHelper.JSONToQueryString(queryObj);
        },

        'getQueryObj': function() {
            var that = this;
            var queryAttributes = {};
            _.each(_.result(that, "server_api"), function(value, key){
                if( _.isFunction(value) ) {
                    value = _.bind(value, that);
                    value = value();
                }
                if (value) {
                    queryAttributes[key] = value;
                }
            });
            return queryAttributes;
        },
 
        'getQueryString': function() {
            //console.log(queryAttributes);
            return searchHelper.JSONToQueryString(this.getQueryObj());
        },
        'getGeojsonURL': function() {
            var querystring = this.getQueryString();
            return this.url() + querystring.substring(1, querystring.length); 
        },
        'parse': function(res) {
            this.currentPage = parseInt(res.page);
            this.totalResults = parseInt(res.total);
            this.totalPages = parseInt(res.pages);
            var geojson = _.clone(res);
            mediator.commands.execute("map:loadSearchResults", geojson);
            //mediator.events.trigger("search:parse", geojson);
            return res.features;    
        },
        'unselectPlace': function(place) {
            if (this.contains(place)) {
                place.trigger('unselect');
                return;
            }    
            var id = place.id;
            var model = this.get(id);
            if (model) {
                model.trigger('unselect');
            }
            return;
        }
    });
    
    return Places;

});


//define ['Backbone','cs!app/models/place','backbone_paginator'],(Backbone,Place) ->
//  class Place extends Backbone.Paginator.requestPager
//    model: Place
//    paginator_core:
//      type: 'GET'
//      url: '/1.0/search/?'
//    paginator_ui:
//      firstPage:0
//      currentPage:0
//      perPage : 50
//    server_api:
//      'sort' : '-_id'
//    parse: (res) ->
//      console.log res
//      res.items
