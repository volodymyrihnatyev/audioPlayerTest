var audio;
var volume =0.5;
// $('#volume').value = 5;


//hide pause button
$('#pause').hide();

//Initialize first song
initAudio($('#playlist li:first-child'));

//Initializer function
function initAudio(elem){
	var song = elem.attr('song');
	var title = elem.text();
	var cover = elem.attr('cover');
	var artist = elem.attr('artist');

	//Create audio object
	audio = new Audio('media/' + song);

	if (!audio.currentTime){
		$('#duration').html('0.00');
	}

	$('#audio-player .title').text(title);
	$('#audio-player .artist').text(artist);

	//Insert cover image
	$('img.cover').attr('src', 'img/covers/' + cover);

	$('#playlist li.active').removeClass('active');
	elem.addClass('active');
};

//Play button
$('#play').click(function(){
	audio.volume = volume;
	audio.play();
	$('#play').hide();
	$('#pause').show();
	showDuration();
});

//Pause button
$('#pause').click(function(){
	audio.pause();
	$('#pause').hide();
	$('#play').show();
});

//Stop Button
$('#stop').click(function(){
	audio.pause();
	audio.currentTime = 0;
	$('#pause').hide();
	$('#play').show();
});

//Next Button
$('#next').click(function(){
	audio.pause();
	var next = $('#playlist li.active').next();
	if(next.length ==0){
		next = $('#playlist li:first-child')
	}
	initAudio(next);
	$('#play').hide();
	$('#pause').show();
	audio.volume = volume;
	audio.play();
	showDuration();
});

//Prev Button
$('#prev').click(function(){
	audio.pause();
	var prev = $('#playlist li.active').prev();
	if(prev.length ==0){
		prev = $('#playlist li:last-child')
	}
	initAudio(prev);
	$('#play').hide();
	$('#pause').show();
	audio.volume = volume;
	audio.play();
	showDuration();
});

//Click on list item
$('#playlist li').click(function(){
	audio.pause();
	initAudio($(this));
	$('#play').hide();
	$('#pause').show();
	audio.volume = volume;
	audio.play();
	showDuration();
});

//Volume Control
$('#volume').change(function(){
	volume = audio.volume = this.value / 10;
});

//Time Duration
function showDuration(){
	$(audio).on('timeupdate', function(){
		//Get Hours & Minutes
		var s = parseInt(audio.currentTime % 60);
		var m = parseInt(audio.currentTime / 60) % 60;
		//Add 0 if less than 10
		if (s < 10){
			s = '0' + s;
		}
		$('#duration').html(m + ':' + s);
		var value = 0;
		if(audio.currentTime > 0){
			value = Math.floor((100 / audio.duration) * audio.currentTime);
		}
		$('#progress').css('width', value + '%');

		//play next song after current song have just played
		if( audio.currentTime >= audio.duration) {
			$('#next').trigger('click');
		}﻿
	});
};