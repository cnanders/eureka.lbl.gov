// This adjusts the height of any Embedded swf so that it stays
// proportional with the width on browser resize events.


var updateVideos = function(){

	var els = document.getElementsByTagName("video");
	var wrap = document.getElementById("ng-content-wrap");
	//console.log('videosizer.updateVideos() found ' + els.length + ' videos');

	var parent;
	var width;
	var padding;

	for (var i = 0; i < els.length; i++) {

		parent = els[i].parentNode;
		padding = window.getComputedStyle(parent, null).getPropertyValue('padding-left');

		//console.log('updateVideos() padding = ' + padding);

		//padding = padding.substring(0, padding.length - 2 - 1);
		width = parent.offsetWidth;

		//console.log('updateVideos() width = ' + width);
		//console.log('updateVideos() padding = ' + padding);
		console.log('video ' + i + ' offsetWidth = ' + els[i].offsetWidth);
		console.log('video ' + i + ' height = ' + els[i].height);
		console.log('video ' + i + ' ar = ' + els[i].getAttribute('ar'));

		els[i].setAttribute('height', Math.round(width*els[i].getAttribute('ar')));
		els[i].setAttribute('width', Math.round(width));

		//els[i].setAttribute('height', els[i].getAttribute('ar') + '%');
		//els[i].setAttribute('width', '100%');

		//els[i].height = 300;

	}
}


window.addEvent('onresize', updateVideos);

