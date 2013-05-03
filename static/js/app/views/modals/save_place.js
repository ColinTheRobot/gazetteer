define(['marionette', 'jquery', 'underscore', 'app/core/mediator', 'text!app/views/modals/save_place.tpl'], function(Marionette, $, _, mediator, template) {
    var SavePlaceView = Marionette.ItemView.extend({
        className: 'modalContent',
        template: _.template(template),
        events: {
            'submit #savePlaceForm': 'submitForm'
        },
        ui: {
            'comment': '#savePlaceComments',
            'message': '.message'
        },

        submitForm: function(e) {
            e.preventDefault();
            var that = this;
            var geojson = this.model.toGeoJSON();
            var comment = this.$el.find('#savePlaceComments').val();
            geojson.comment = comment;
            console.log("save geojson", geojson);
            var data = JSON.stringify(geojson);
            var url = this.model.url();
            console.log(data);
            $.ajax({
                'type': 'PUT',
                'dataType': 'json',
                'url': url,
                'data': data,
                'success': function(response) {
                    if (response.error) {
                        that.ui.message.text(response.error); 
                    } else {
                        require(['app/models/place'], function(Place) {
                            var place = new Place(response);
                            console.log(place);
                            mediator.commands.execute("closeModal");
                            mediator.commands.execute("openPlace", place);
                        });
                    }
                }    
            });
        }    

    });    

    return SavePlaceView;
});
