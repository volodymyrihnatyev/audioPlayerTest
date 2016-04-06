(function(){

var audioPlayer = new AudioPlayer();
audioPlayer.init();

function AudioPlayer(){
	var self = this;

	var $nextButton = $('#next');
	var $prevButton = $('#prev');
	var $pauseButton = $('#pause');
	var $stopButton = $('#stop');
	var $playButton = $('#play');
	var firtSong = $('#playlist li:first-child');
	var lastSong = $('#playlist li:last-child');
	var volume = $('#volume');
	var activeAudio = $('#playlist li.active');
	var audioInList = $('#playlist li');
	var duration = $('#duration');
	var progress = $('#progress');
	var progressbar = $('#progressbar');

	var progressValue = 0;
	var volumeValue;

	this.audio = null;

	this.init = function(){
			//Set default volume value in DOM element
			volume.val($(this).data("default"));
			
			//Get default volume value
			volumeValue = volume.val() / 10;

			//Hide pause button
			$pauseButton.hide();

			//Initialize first song
			self.initAudio(firtSong);

			//Initialize events
			$playButton.click(self.actions.play);
			$pauseButton.click(self.actions.pause);
			$stopButton.click(self.actions.stop);
			$nextButton.click(self.actions.next);
			$prevButton.click(self.actions.prev);
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
				progressValue = 0;
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
					$playButton.hide();
					$pauseButton.show();
				} else {
					$pauseButton.hide();
					$playButton.show();
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
					progressValue = Math.floor((100 / self.audio.duration) *self.audio.currentTime);
						if(progressValue > 50){
							progressValue +=1;
						}
				}
				progress.css('width', progressValue + '%');

				//play next song after current song have just played
				if( self.audio.currentTime >= self.audio.duration) {
					$nextButton.trigger('click');
				}﻿
			});
		},
		rewind: function(e){
				barWidth = $(this).width();
				var offset = $(this).offset().left;
				progressValue = parseInt(((e.pageX - offset)/ barWidth)*100);
				self.audio.pause();
				self.audio.currentTime = parseInt(self.audio.duration*progressValue/100);
				progress.css('width', progressValue + '%');
				self.audio.play();
				self.actions.showDuration();
				self.actions.togglePlayButton();
			}
		};
	};
})();