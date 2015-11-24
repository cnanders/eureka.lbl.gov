var handleBeginFullscreen = function(e) {
	//console.log(e);
	e.target.play();
}

var handleEndFullscreen = function(e) {
	//console.log(e);
	e.target.stop();
}

var playOnFullscreen = function() {

	//console.log('playOnFullscreen');

	var els = document.getElementsByTagName("video");

	/*
	var handlePlay = function(e) {

		console.log('handlePlay');
		e.target.removeEventListener('play', handlePlay);
		e.target.src = 'videos/mp4/1/1/C-Major-Scale.mp4';
       	e.target.load();
        e.target.play();
	}
	*/

	for (var i = 0; i < els.length; i++) {

		//console.log('playOnFullscreen adding listener');
		//console.log(els[i]);
		els[i].addEventListener('webkitbeginfullscreen', handleBeginFullscreen, false);
		els[i].addEventListener('webkitEndFullscreen', handleEndFullscreen, false);
		//els[i].addEventListener('play', handlePlay, false);
	}

}
