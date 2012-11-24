from django.template import RequestContext, Context, loader
from django.http import HttpResponse
from django.db.models import Q
from django.shortcuts import render_to_response, get_object_or_404
import json
from place import *
import api_views
import datetime
import isodate
from gazetteer.shortcuts import get_place_or_404


def index(request):
    places_count = Place.objects.count("*")
    context = RequestContext(request, {
        'total_count': places_count
    })
    return render_to_response("index.html", context)

def search(request):
    query = request.GET.get('query', '')
    results = ''
    if query:
        results = Place.objects.search(query)["places"]
        total = Place.objects.search(query)["total"]
    context = RequestContext(request, {
        'results': results,
        'total': total
    })
    return render_to_response("search.html", context)
    

def detail(request, place_id):
    place = get_place_or_404(place_id)
    updated = isodate.isodates.parse_date(place.updated)
    geojson = json.dumps(place.to_geojson())

    #Call the similar api_view and get the content from the response object - FIXME: more elegant way to do this?
    similar_geojson = api_views.similar(request, place_id).content 
    similar_places = json.loads(similar_geojson) 
    feature_code = FeatureCode.objects.get(typ=place.feature_code)

    revisions_json = api_views.history(request, place_id).content
    revisions = json.loads(revisions_json)

    context = RequestContext(request, {
        'place': place,
        'updated': updated,
        'place_geojson': geojson,
        'feature_code': feature_code,
        'similar_places': similar_places,
        'similar_geojson': similar_geojson,
        'revisions': revisions,
        'revisions_json': revisions_json        
    })
    return render_to_response("detail.html", context)

    
def edit_place(request, place_id):
    place = get_place_or_404(place_id)
    geojson = json.dumps(place.to_geojson())
    context = RequestContext(request, {
        'place': place,
        'place_geojson': geojson
    })
    return render_to_response("edit_place.html", context)  



