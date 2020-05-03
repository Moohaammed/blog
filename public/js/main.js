function justifyContent() {
    var navBarHeight = document.querySelector('.navbar').getBoundingClientRect().height;
    var location = window.location.href;
    var page = location.split('/')[3]; // http://localhost:<port>/<page>/e/t/c
    if (page == "") {
        document.body.style.marginTop = 0+'px';
    } else {
        document.body.style.marginTop = navBarHeight+'px';
    }
}

justifyContent()

function activateLink() {
    var location = window.location.href;
    var page = location.split('/')[3]; // http://localhost:<port>/<page>/e/t/c
    if (page == "") {
        document.querySelector('[data-navigation="home"]').classList.add('focus');
    }
    else {
        document.querySelector('[data-navigation="'+ page+'"]').classList.add('focus')
    }    
}

activateLink()