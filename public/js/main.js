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

var navbarHeight = document.querySelector('.navbar').getBoundingClientRect().height;
document.body.style.marginTop = navbarHeight+'px';
document.querySelectorAll('.carousel-item')[0].classList.add('active');