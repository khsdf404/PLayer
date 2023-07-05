window.$ = window.jQuery = require("jquery");
$('document').ready(function() {
let win = require('electron').remote.getCurrentWindow();
win.show();
let fs = require("fs");
let trash = 2;

$('.Close').click(function () { win.close() });
$('.Minimize').click(function () { win.minimize(); });
$('.PlayPause, .VideoWrapp, .ControlPanel, .end').fadeOut();
let width2 = $( window ).width();
let height2 = $( window ).height();
$('.main').css({'width': width2, 'height': height2});
//
let Is_Playing = false;
let clicked = false;
let OnControls = false;
let controls = $('.DragArea, .PlayPause, .ControlPanel');
let span = $('.DragArea span');
let time_null, time_null2, time_null3, time_null4, time_null5, time_null6;

// all funcs

function BeautyPause() {
    $(`.PlayPause`).css({'font-size': '5px'});
    setTimeout(function () {
        $(`.PlayPause`).empty();
        if (Is_Playing == false) {
            $(`.PlayPause`).append(`<i class="fas fa-play"></i>`)
        }
        else {
            $(`.PlayPause`).append(`<i class="fas fa-stop"></i>`)
        }
        $(`.PlayPause`).css({'font-size': '100px'});
    }, 100);
}
function ShowControls() {
    controls.fadeIn();
    $('body').mousemove(function () {
        if (Is_Playing) {
            controls.fadeIn();
            clearTimeout(time_null2);
            time_null2 = setTimeout(function () {
                if ((Is_Playing) && (!OnControls)) {
                    controls.fadeOut();
                }
            }, 1000);
        }
    });
}
function PlayPause() {
    let video = document.querySelector('#video');
    BeautyPause();
    if (Is_Playing) {
        video.pause();
        controls.fadeIn();
        Is_Playing = !Is_Playing;
    }
    else if (!Is_Playing) {
        video.play();
        setTimeout(function () {
            if (Is_Playing) {
                controls.fadeOut();
            }
        }, 1010);
        Is_Playing = !Is_Playing
    }
}
function MoreVolume() {
    let video = document.querySelector('#video');
    if (video.volume > 0.9) {
        video.volume = 1;
        span.empty();
        span.fadeIn(400);
        span.append('Звук: 100%');
        clearTimeout(time_null3);
        time_null3 = setTimeout(function () {
            span.fadeOut(1000);
        }, 1500);
    }
    else {
        video.volume = Math.round( (video.volume+0.1)*10 )/10;
        span.empty();
        span.fadeIn(400);
        span.append('Звук: ' + (video.volume*100) + '%')
        clearTimeout(time_null3);
        time_null3 = setTimeout(function () {
            span.fadeOut(1000);
        }, 1500);
    }
}
function WheelVolume(e) {
    let video = document.querySelector('#video');
    let wheelDelta = e.originalEvent.wheelDelta/1200
    wheelDelta > 0 ? MoreVolume() : LessVolume()
}
function LessVolume() {
    let video = document.querySelector('#video');
    if (video.volume < 0.1) {
        video.volume = 0;
        span.empty();
        span.fadeIn(400);
        span.append('Звук: 0%');
        clearTimeout(time_null3);
        time_null3 = setTimeout(function () {
            span.fadeOut(1000);
        }, 1500);
    }
    else {
        video.volume = Math.round( (video.volume-0.1)*10 )/10;
        span.empty();
        span.fadeIn(400);
        span.append('Звук: ' + (video.volume*100) + '%')
        clearTimeout(time_null3);
        time_null3 = setTimeout(function () {
            span.fadeOut(1000);
        }, 1500);
    }
}
function MoreSpeed() {
    let video = document.querySelector('#video');
    if ( video.playbackRate == 0.25 ) {
        video.playbackRate += 0.25;
    }
    else if ( video.playbackRate <= 2.5 )
        { video.playbackRate += 0.5; }
    span.empty();
    span.fadeIn(400);
    span.append('Скорость: ' + video.playbackRate);
    clearTimeout(time_null3);
    time_null3 = setTimeout(function () {
        span.fadeOut(1000);
    }, 1500);
}
function LessSpeed() {
    let video = document.querySelector('#video');
    if ( video.playbackRate == 0.5 ) {
        video.playbackRate -= 0.25;
    }
    else if ( video.playbackRate > 0.5 ) {
        video.playbackRate -= 0.5;
    }
    span.empty();
    span.fadeIn(400);
    span.append('Скорость: ' + video.playbackRate)
    clearTimeout(time_null3);
    time_null3 = setTimeout(function () {
        span.fadeOut(1000);
    }, 1500);
}
function ClickTimeUpdate() {
    let video = document.querySelector('#video');
    let all_w = $("#ProgressBar").width();
    let w = event.pageX;
    document.querySelector("#ProgressBar").value = 100*w/all_w;
    video.currentTime = video.duration * (w/all_w);
}
function ProgressTimeUpdate() {
    let video = document.querySelector('#video');
    let dur = video.duration;
    let cur = video.currentTime;
    progress.value = 100*cur/dur;
    let sec = Math.round(cur) % 60;
    let all_sec = Math.round(cur);
    let min = Math.floor(all_sec/60);
    let hour = Math.floor(min/60);
    $('.sec').empty();
    $('.min').empty();
    $('.hour').empty();
    sec  < 10 ? $('.sec').append('0'+sec) :  $('.sec').append(sec)
    min < 10 ? $('.min').append('0'+min+':') :  $('.min').append(min+':')
    hour > 0 ? $('.hour').append(hour + ':') : '';
    let s = Math.round(dur) % 60;
    let a_s = Math.round(dur);
    let m = Math.floor(a_s/60);
    let h = Math.floor(m/60);
    $('.s').empty();
    $('.m').empty();
    $('.h').empty();
    s  < 10 ? $('.s').append('0'+s) :  $('.s').append(s);
    m < 10 ? $('.m').append('0'+m+':') :  $('.m').append(m+': ');
    h > 0 ? $('.h').append(h + ':') : '';
    let procent = ((cur/dur)*100) - 0.3 +  "%"
    $('.circle').css({'left': procent});
    if (dur == cur) {
        $('.end').fadeIn();
        $('body').off();
        controls.fadeOut();
        setTimeout(function () {
            $('.DragArea').fadeIn();
        }, 1010)
    }
}
function RewindVideo() {
    $(document).mouseup(function() {
        if ( clicked == true) {
            let video = document.querySelector('#video');
            PlayPause();
            let offset = $('#ProgressBar').offset();
            let indicator_height = $('.TimeIndicator').outerHeight();
            let new_top = offset.top - indicator_height - 40;
            $('.TimeIndicator').css({'top': new_top, 'opacity': 0});
            clicked = false;
        }
    });
    $(`.main`).on('mousedown', '.circle', function () {
        let video = document.querySelector('#video');
        PlayPause();
        clicked = true;
    });
    $(`.main`).on('mousemove', '#ProgressBar', function (event) {
        let video = document.querySelector('#video');
        if (clicked == true) {
            let all_w = $("#ProgressBar").width();
            let w = event.pageX;
            document.querySelector("#ProgressBar").value = 100*w/all_w;
            video.currentTime = video.duration * (w/all_w);
            ProgressTimeUpdate();
        }
        let all_w = $("#ProgressBar").width();
        let w = event.pageX;
        let dur = video.duration;
        let cur = video.duration * ( w/all_w );
        let sec = Math.round(cur) % 60;
        let all_sec = Math.round(cur);
        let min = Math.floor(all_sec/60);
        let hour = Math.floor(min/60);
        $('.IndicatorSecs').empty();
        $('.IndicatorMins').empty();
        $('.IndicatorHours').empty();
        sec  < 10 ? $('.IndicatorSecs').append(`0${sec}`) :  $('.IndicatorSecs').append(sec)
        min < 10 ? $('.IndicatorMins').append(`0${min}:`) :  $('.IndicatorMins').append(min+': ')
        hour > 0 ? $('.IndicatorHours').append(`0${hour}:`) : '';
        var x = event.pageX;
        var win_width = $( window ).width();
        var width = $('.TimeIndicator').outerWidth();
        var offset = $('#ProgressBar').offset();
        var indicator_height = $('.TimeIndicator').outerHeight();
        var new_top = offset.top - indicator_height - 15;
        if ((win_width - x) <  (width/2)) {
            $('.TimeIndicator').css({'top': new_top, 'right':  width - 5, 'opacity': 1});
        }
        else if ( x < (width/2) ) {
            $('.TimeIndicator').css({'top': new_top, 'left': 5, 'opacity': 1});
        }
        else {
            $('.TimeIndicator').css({'top': new_top, 'left': x-(width/2), 'opacity': 1});
        }
        $(`.main`).on('mouseleave', '#ProgressBar', function (event) {
            var offset = $('#ProgressBar').offset();
            $('.TimeIndicator').css({'top': new_top - 25, 'opacity': 0});
        });
    });
}
function Reset() {
    let video = document.querySelector('#video');
    video.volume = 0;
    video.playbackRate = 1;
    video.currentTime = 0;
    video.ontimeupdate = ProgressTimeUpdate;
    progress.value = 0;
    let Is_Playing = false;
    let clicked = false;
    let OnControls = false;
    $(`.DragArea`).css({"background": "rgba(0, 0, 0, 0.7)"});
    $('.circle').css({'left': '0'});
    $('.sec').empty();
    $('.min').empty();
    $('.hour').empty();
    $('.s').empty();
    $('.m').empty();
    $('.h').empty();
    video.play();
    // for display a currentTime and Duration
    setTimeout(function () {
        video.pause();
        video.volume = 0.2;
    }, 300);
}
function Restart() {
    var video = document.querySelector('#video');
    video.currentTime = 0;
    video.play();
    Is_Playing = true;
    $('.end').fadeOut();
    $('.VideoWrapp').css({'-webkit-app-region': 'no-drag'});
    ShowControls();
}
function Out() {
    let video = document.querySelector('#video');
    video.pause();
    // css
    $('.VideoWrapp').fadeOut(500);
    $('.end').fadeOut(500);
    controls.fadeOut(500);
    $(`.DragArea`).css({"background": "transparent"});
    // ↓↓↓ off ShowControls(); ↓↓↓
    $('body').off();
    setTimeout(function () {
        $('.VideoWrapp').empty();
        $('.box, .start').fadeIn(500);
        $('#file').prop('value', null);
        setTimeout(function () {
            $(`.DragArea`).fadeIn();
        }, 1500);
    }, 500);
}
function key_events(event) {
    $(window).keydown(function (event) {
        let video = document.querySelector('#video');
        if (video != null) {
            if (event.code == "ArrowRight")
                { video.currentTime+=10; $('body').trigger('mousemove')}
            if (event.code == "ArrowLeft")
                { video.currentTime-=10; $('body').trigger('mousemove')}
            if (event.code == "ArrowUp")
                { MoreVolume(); $('body').trigger('mousemove') }
            if (event.code == "ArrowDown")
                { LessVolume(); $('body').trigger('mousemove') }
            if (event.code == "Space")
                { PlayPause(); $('body').trigger('mousemove') }
            if (event.code == "F7")
                { win.setIgnoreMouseEvents(false) }
            if ((event.code == "F11") || (event.code == "KeyF"))
                { win.isMaximized() == false ? win.maximize() : win.unmaximize() }
        }
    });
}

$(`.main`).on('click', '.PlayPause, #video', function() { PlayPause(); });
$(`.main`).on('click', '#ProgressBar', function() { ClickTimeUpdate(); });
$(`.main`).on('mouseenter', '.ControlPanel, .CloseAndMin', function () { OnControls = true; });
$(`.main`).on('mouseleave', '.ControlPanel, .CloseAndMin', function () { OnControls = false; });
$(`.main`).on('click', '.volume_up', function() { MoreVolume(); });
$(`.main`).on('wheel', '.PlayPause, #video', function(e) { WheelVolume(e); });
$(`.main`).on('click', '.volume_down', function() { LessVolume(); });
$(`.main`).on('click', '.more_speed', function() { MoreSpeed(); });
$(`.main`).on('click', '.less_speed', function() { LessSpeed(); });
$(`.main`).on('click', '.restart', function() { Restart(); });
$(`.main`).on('click', '.out', function() { Out(); });
$('.fullscreen').click(function () {
    win.isMaximized() == false ? win.maximize() : win.unmaximize()
});
$('.ontop').click(function () {
    win.isAlwaysOnTop() == false ?
    win.setAlwaysOnTop(true) : win.setAlwaysOnTop(false)
});
$('.ignore').click(function () {
    win.setIgnoreMouseEvents(true);
    controls.fadeOut();
})

RewindVideo();
key_events();

//  by window
document.getElementById('file').addEventListener("change", function (event) {
    let file = document.getElementById('file').files[0];
    $('.VideoWrapp').fadeIn();
    $('.VideoWrapp').append(
        `<video id="video" class="" >
            <source src="`+ file.path +`" type="`+file.type+`">
        </video> `);
    $('.start').fadeOut();
    Reset();
    ShowControls();
    console.log(file.path);
}, false);

// by FILE
fs.readFile(`${__dirname}/code/path.txt`, function (err, data) {
   if (err) { return }
   var path = data.toString();
   var type = path.replace(/[\s\S]*\./g, "");
   let is_avi = type.indexOf(`avi`) > -1;
   let is_mp4 = type.indexOf(`mp4`) > -1;
   let is_webm = type.indexOf(`webm`) > -1;
   let is_wmv = type.indexOf(`wmv`) > -1;
   let is_flv = type.indexOf(`flv`) > -1;
   let is_3gp = type.indexOf(`3gp`) > -1;
   if ( is_avi || is_mp4 || is_webm || is_wmv || is_flv || is_3gp) {
        $('.VideoWrapp').fadeIn();
        $('.VideoWrapp').append(
            `<video id="video" class="" >
                <source src="${path}">
            </video> `);
        $('.start').fadeOut();
        Reset();
        ShowControls();
   }
   fs.unlinkSync(`${__dirname}/code/path.txt`);
});


// auto-размеры окна
let arr = [];
$(window).bind("resize", function() {
    var width = $( window ).width();
    var correct_height = Math.round(width * 9 / 16);
    var height = $( window ).height();
    var correct_width = Math.round(height * 16 / 9);

    arr.push(width); arr.push(height);
    arr.push(correct_width); arr.push(correct_height);

    arr = arr.slice(arr.length-4, arr.length)
    clearTimeout(time_null);
    time_null = setTimeout(function () {
        if ( arr[0] > arr [1] )
            { win.setSize( arr[0], arr[3] ); $('.main').css({ 'width': arr[0], 'height': arr[3]}) }
        if ( arr[0] < arr [1] )
            { win.setSize( arr[2], arr[1] ); $('.main').css({ 'width': arr[2], 'height': arr[1]}) }
    }, 500);
});

});
