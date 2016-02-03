/**
 * Created with IntelliJ IDEA.
 * User: jellybelly
 * Date: 1/31/13
 * Time: 9:19 AM
 * To change this template use File | Settings | File Templates.
 */

var timeDifference = function () {
    var laterdate = new Date(2013, 1, 2, 20, 0, 0, 0);
    earlierdate = new Date();
    var difference = laterdate.getTime() - earlierdate.getTime();

    var daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    var hoursDifference = Math.floor(difference/1000/60/60);
    difference -= hoursDifference*1000*60*60

    var minutesDifference = Math.floor(difference/1000/60);
    difference -= minutesDifference*1000*60

    var secondsDifference = Math.floor(difference/1000);

    $('.countdown')[0].innerText = 'difference = ' + daysDifference + ' day/s ' + hoursDifference + ' hour/s ' + minutesDifference + ' minute/s ' + secondsDifference + ' second/s ';
    updateTime();
};

var updateTime = function() {
    window.setTimeout(timeDifference, 1000);
};

function CreateTimer() {
    UpdateTimer()

}

function Tick() {
    TotalSeconds -= 1;
    UpdateTimer()

}



updateTime();