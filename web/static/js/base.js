// script for navbar, loaded in every page


// helper: parse a single dom node from string
function parseDOM(str) {
    var parser = new DOMParser();
    return parser.parseFromString(str, "text/html").body.firstChild;
}

// Toggle login overlay
var loginButton = document.querySelector('#login-trigger');
if (loginButton != null) {
    loginButton.addEventListener('click', ()=>{
        overlayWrapper.style.display = 'block';
    })
}

// Toggle display of overlay
var overlayWrapper = document.querySelector('.overlay');
document.querySelector('.overlay').addEventListener('click', (e)=>{
    if (e.target.id=="overlay-background")
        overlayWrapper.style.display = 'none';
})
document.getElementById('cancel-btn').addEventListener('click', (e)=>{
    overlayWrapper.style.display = 'none';
})




// login form submit
var loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e)=>{    
    e.preventDefault();
    var formData = new FormData(loginForm);
    fetch('/fetch/login', {
        method: 'POST',
        body: formData,
    })
    .then((response) => response.json())
    .then(result => {
        if (result['success']) {
            location.reload()
        } else {
            document.getElementById('login-fail').style.display = 'block';
        }
    })
})