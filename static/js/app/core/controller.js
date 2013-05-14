define(['jquery', 'app/core/mediator', 'app/collections/places', 'app/models/place', 'require'], function($, mediator, Places, Place, require) { 
    return {
        "home": function() {
            console.log("home");
            
        },

        "search": function(queryString) {
            var app = require("app/app");
            console.log("search route called");
            var searchHelper = require("app/helpers/search");
            var queryJSON = searchHelper.queryStringToJSON(queryString);
            var places = app.collections.places = new Places().setServerApi(queryJSON);
            mediator.commands.execute("search:updateUI", queryJSON);
            mediator.commands.execute("fetchPlaces", places);
        },

        "detail": function(id, tab) {
            console.log(id);
            if (typeof(tab) == 'undefined') {
                tab = false;
            }
            var app = require("app/app");
            mediator.commands.execute("getPlaceAsync", id, function(place) {
                mediator.commands.execute("openPlace", place, tab);
            });
            console.log("app required");
        }
    }   

});
