(function(){

var audioPlayer = new AudioPlayer();
audioPlayer.init();

function AudioPlayer(){
	//value for progress bar
	var value = 0;

	var self = this;

	var firtSong = $('#playlist li:first-child');
	var lastSong = $('#playlist li:last-child');
	var next = $('#next');
	var prev = $('#prev');
	var pause = $('#pause');
	var stop = $('#stop');
	var play = $('#play');
	var volume = $('#volume');
	var activeAudio = $('#playlist li.active');
	var audioInList = $('#playlist li');
	var duration = $('#duration');
	var progress = $('#progress');
	var progressbar = $('#progressbar');

	var volumeValue;

	this.audio = null;

	this.init = function(){
			//Set default volume value in DOM element
			volume.val($(this).data("default"));
			
			//Get default volume value
			volumeValue = volume.val() / 10;

			//Hide pause button
			pause.hide();

			//Initialize first song
			self.initAudio(firtSong);

			//Initialize events
			play.click(self.actions.play);
			pause.click(self.actions.pause);
			stop.click(self.actions.stop);
			next.click(self.actions.next);
			prev.click(self.actions.prev);
			volume.change(self.actions.volumeChange);
			audioInList.click(self.actions.playAudioInList);
			progressbar.click(self.actions.rewind);﻿
	};

	this.initAudio = function(elem){
		var song = elem.attr('song');
		var title = elem.text();
		var cover = elem.attr('cover');
		var artist = elem.attr('artist');

		//Create audio object
		self.audio = new Audio('media/' + song);

		if (!self.audio.currentTime){
			$('#duration').html('0.00');
		}

		$('#audio-player .title').text(title);
		$('#audio-player .artist').text(artist);

		//Insert cover image
		$('img.cover').attr('src', 'img/covers/' + cover);

		activeAudio.removeClass('active');
		activeAudio = $(elem);
		elem.addClass('active');
	};
	this.actions = {
		next: function(){
			self.audio.pause();
			var next = activeAudio.next();
			if(next.length ==0){
				next = firtSong;
			}
			self.initAudio(next);
			self.audio.volume = volumeValue;
			// if (!audio.paused){

			// }
			self.audio.play();
			self.actions.togglePlayButton();
			self.actions.showDuration();
		},
		prev: function(){
			self.audio.pause();
			var prev = activeAudio.prev();
			if(prev.length ==0){
				prev = lastSong;
			}
			self.initAudio(prev);
			self.audio.volume = volumeValue;
			self.audio.play();
			self.actions.togglePlayButton();
			self.actions.showDuration();
		},
		play: function(){
				self.audio.volume = volumeValue;
				self.audio.play();
				self.actions.togglePlayButton();
				self.actions.showDuration();
		},
		stop: function(){
				self.audio.pause();
				self.audio.currentTime = 0;
				self.actions.togglePlayButton();
				value = 0;
		},
		pause: function(){
				self.audio.pause();
				self.actions.togglePlayButton();
		},
		playAudioInList: function(){
				self.audio.pause();
				self.initAudio($(this));
				self.audio.volume = volumeValue;
				self.audio.play();
				self.actions.togglePlayButton();
				self.actions.showDuration();
		},
		volumeChange: function(){
				volumeValue = self.audio.volume = this.value / 10;
		},
		togglePlayButton: function (){
				if (!self.audio.paused){
					play.hide();
					pause.show();
				} else {
					pause.hide();
					play.show();
				}
		},
		showDuration: function(){
			$(self.audio).on('timeupdate', function(){
				//Get Hours & Minutes
				var s = parseInt(self.audio.currentTime % 60);
				var m = parseInt(self.audio.currentTime / 60) % 60;
				//Add 0 if less than 10
				if (s < 10){
					s = '0' + s;
				}
				duration.html(m + ':' + s);
				if(self.audio.currentTime > 0){
					value = Math.floor((100 / self.audio.duration) *self.audio.currentTime);
						if(value > 50){
							value +=1;
						}
				}
				progress.css('width', value + '%');

				//play next song after current song have just played
				if( self.audio.currentTime >= self.audio.duration) {
					next.trigger('click');
				}﻿
			});
		},
		rewind: function(e){
				barWidth = $(this).width();
				var offset = $(this).offset().left;
				value = parseInt(((e.pageX - offset)/ barWidth)*100);
				self.audio.pause();
				self.audio.currentTime = parseInt(self.audio.duration*value/100);
				progress.css('width', value + '%');
				self.audio.play();
				self.actions.togglePlayButton();
			}
		};
	};
})();