$(document).ready(superbowl.auth.init.bind(superbowl.auth));

$(window).scroll(function() {
    if ($(this).scrollTop() <= 10) {
        $('.header-container').removeClass("drop-shadow");
    } else {
        $('.header-container').addClass("drop-shadow");
    }
});
