//settings that are customizable per instance

define([], function() {
    return {
        origins: [],
        styles: {
            geojsonDefaultCSS: {
                    radius: 7,
                    fillColor: "#7CA0C7",
                    color: "#18385A",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.6
            },
            geojsonHighlightedCSS: {
                radius: 7,
                fillColor: '#F15913',
                color: '#f00',
                weight: 1,
                opacity: 1,
                fillOpacity: 1
            },
            similarPlacesDefaultCSS: {
                radius: 6,
                fillColor: 'green',
                color: 'green',
                weight: 1,
                opacity: 0.8,
                fillOpacity: 0.5
            },
            similarPlacesHighlightedCSS: {
                radius: 8,
                opacity: 1,
                weight: 1,
                fillOpacity: 1,
                color: '#000'
            }
        },
        relationChoices: {
            'conflates'     : 'Conflates',
            'contains'      : 'Contains',
            'replaces'      : 'Replaces',
            'supplants'     : 'Supplants',
            'comprises'     : 'Comprises',
            'conflated_by'  : 'Is Conflated By',
            'contained_by'  : 'Is Contained By',
            'replaced_by'   : 'Is Replaced By',
            'supplanted_by' : 'Is Supplanted By',
            'comprised_by'  : 'Is Comprised By'
        }        

    };


});
