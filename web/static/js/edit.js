// edit form behavior


// helper function to add event listener to each element in the class
function addEventListenerByClass(className, event, f){
    var arr = Array.from(document.getElementsByClassName(className));
    arr.forEach(element=>{
        element.addEventListener(event, e=>f(e))
    })
}


function makeJsonHeader(fetchUrl, jsonData){
    let hdr = new Headers();
    hdr.append('Content-Type', 'application/json');
    let req = new Request(fetchUrl, {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: hdr
    });
    return req;
}


// preventDefault for existing buttons
addEventListenerByClass('edit-remove-li', 'click', e=>e.preventDefault());
addEventListenerByClass('edit-add-li', 'click', e=>e.preventDefault());

// attach handler to parent node
addEventListenerByClass('edit-dynamic-ul', 'click', e=>{
    var ul = e.currentTarget;
    var button = e.target
    if (button.className=="edit-remove-li" && button.parentNode.nodeName=="LI"){
        ul.removeChild(button.parentNode)
    } else if (button.className=="edit-add-li") {
        var newLi = document.createElement("li");
        newLi.innerHTML = '<button class="edit-remove-li">&times;</button>'+
                            '<input type="text" name="features" value=""/>'
        ul.insertBefore(newLi, button.parentNode);
    }
});


// fetch options from backend and insert them as children of <select>
function fetchInsertOptions(selectDom, prevSelections, selectedOption=null) {
    var req = makeJsonHeader("/fetch/edit/cat", prevSelections);
    fetch(req)
    .then(response => response.json())
    .then(listOfOptions => {
        selectDom.innerHTML = "";
        listOfOptions.map(option => {
            var optionDom = document.createElement('option');
            optionDom.setAttribute('value', option);
            optionDom.innerHTML = option;
            if (option==selectedOption) optionDom.selected = true;
            selectDom.appendChild(optionDom);
        });
    })
}

// initialize options, run once each refresh
var editCat = document.getElementById('edit-cat');
var editBucket = document.getElementById('edit-bucket');
var editItem = document.getElementById('edit-item');
(function (){
    var selectedCat = editCat.getAttribute('data-selected');
    var selectedBucket = editBucket.getAttribute('data-selected');
    var selectedItem = editItem.getAttribute('data-selected');
    
    for (child of editCat.children) {
        if (child.value == selectedCat) child.selected=true;
    };

    fetchInsertOptions(editBucket, {'cat':selectedCat}, selectedBucket);
    fetchInsertOptions(editItem, {'cat':selectedCat, 'bucket': selectedBucket}, selectedItem);
})();


// detect change in selections
addEventListenerByClass('edit-cat-select', 'change', e=>{
    var curCat = editCat.options[editCat.selectedIndex].value;
    if (e.target.id == "edit-cat") {
        fetchInsertOptions(editBucket, {'cat':curCat});
        editItem.innerHTML = "";
    } else if (e.target.id == "edit-bucket") {
        var curBucket = editBucket.options[editBucket.selectedIndex].value;
        fetchInsertOptions(editItem, {'cat':curCat, 'bucket': curBucket});
    }
})


// auto update google map
// var timeout = null;
// var editLocation = document.getElementById('edit-location');
// var mapApi = document.getElementById('edit-location-api');
// editLocation.addEventListener('keyup', e => {
//     clearTimeout(timeout);
//     timeout = setTimeout(function () {
//         mapApi.src;
//     }, 1000);
// });


function formToJson( form ) {
    var obj = {};
    var elements = form.querySelectorAll( "input, select, textarea" );
    for( var i = 0; i < elements.length; ++i ) {
        var element = elements[i];
        var name = element.name;
        var value = element.value;
        if( name ) {
            if (name in obj) {
                obj[name] = obj[name] instanceof Array ? [...obj[name], value] : [obj[name], value]
            }
            else obj[name] = value;
        } 
    }
    return JSON.stringify( obj );
}


// submit form
var editForm = document.getElementById('edit-form');
editForm.addEventListener('submit', e=>{
    e.preventDefault();
    var currentUrl = window.location.href;
    var formData = formToJson(editForm);
    var req = makeJsonHeader(currentUrl, formData);
    console.log(formData);
    fetch(req)
    .then(response=>response.json())
    .then(data => {
        if (data['success'])
            window.location.href = data['return_url'];
    })
})

	