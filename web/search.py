from flask import Blueprint, render_template, request, current_app
from web import db
from bson.objectid import ObjectId
import json

search_bp = Blueprint('search', __name__)

# main search function
@search_bp.route('/', methods=('GET', 'POST'))
def search():
    keywords = ''
    collection = db.get_db()['inventory']
    index_type = 'all'

    if request.method == 'POST' and request.form['keywords']:
        index_type = request.form['search_type']
        keywords = request.form['keywords']
        batch = collection.find({"$text": {"$search": keywords}})

    else:
        batch = collection.find(None)
    return render_template('search.html', results=batch, keywords=keywords, searchType=index_type)


# ajax: suggestions for partial keywords
@search_bp.route('/ajax/search_bar_suggestion/<index>/<keywords>')
def search_bar_suggestion(keywords, index):
    collection = db.get_db()['inventory']
    if index == 'all':
        index = 'name'
    batch = collection.find({index: {'$regex': keywords, '$options': 'i'}}, limit=5)
    return json.dumps([result['name'] for result in batch])
    # return json.dumps([result['name'] for result in batch]), 200, {'ContentType': 'application/json'}


# ajax: change search type
@search_bp.route('/ajax/change_search_filter/<search_type>')
def change_search_filter(search_type):
    collection = db.get_db()['inventory']

    # dropping old index and creating new one for each search
    # (mongodb allows only 1 text index per collection)
    collection.drop_index("text_index")

    # all possible options for index and weights
    text_indexes = dict(
        all=[("tags", "text"), ("name", "text"), ("overview", "text"), ("key_features", "text")],
        name=[("name", "text")],
        key_features=[("key_features", "text")],
        key_applications=[("key_applications", "text")],
        tags=[("tags", "text")]
    )
    text_index_weights = dict(
        all={"tags": 10, "name": 5},
        name={"name": 1},
        key_features={"key_features": 1},
        key_applications={"key_applications": 1},
        tags={"tags": 1},
    )
    collection.create_index(text_indexes[search_type],
                            weights=text_index_weights[search_type],
                            name="text_index")

    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


# get detailed document
@search_bp.route('/doc/<obj_id>')
def document(obj_id):
    collection = db.get_db()['inventory']
    item = collection.find_one({'_id': ObjectId(obj_id)})
    return render_template('document.html', result=item)


# mask full image url when serving
@search_bp.route('/doc/full_images/<image>')
def full_images(image):
    return current_app.send_static_file('user_uploads/full_images/'+image)


# about page
@search_bp.route('/about')
def about():
    return render_template('about.html')
