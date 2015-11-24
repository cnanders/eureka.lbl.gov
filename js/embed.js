
function Embed(oParams_in){

  // Extend user-supplied parameters over the default

  var oParams = defaultParams();
  objectMerge(oParams, oParams_in);

  if(	oParams.sVideoPath !== undefined &&
    oParams.sVideoPath !== ""){

    // .m4v or .webm file living on our own servers

    // Store browser version
    var browser = {};

    // Mobile
    browser.ios 		= ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
    browser.android 	= ( navigator.userAgent.match(/(Android)/g) ? true : false );
    browser.fireos 		= navigator.userAgent.indexOf("amazon-fireos") > -1;

    // Desktop
    browser.chrome = navigator.userAgent.indexOf('Chrome') > -1;
    browser.explorer = navigator.userAgent.indexOf('MSIE') > -1;
    browser.firefox = navigator.userAgent.indexOf('Firefox') > -1;
    browser.safari = navigator.userAgent.indexOf("Safari") > -1;
    browser.opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
    if ((browser.chrome)&&(browser.safari)) {browser.safari=false;}
    if ((browser.chrome)&&(browser.opera)) {browser.chrome=false;}

    /*
    for (var prop in browser) {
      if (browser.hasOwnProperty(prop)) {
        console.log(prop + ': ' + browser[prop]);
      }
    }
    */

    var wrap = document.getElementById("ng-content-wrap");
      var width = 'width="' + wrap.offsetWidth + '" ';
    sHTML = '';

    //sHTML += '<div style="width:100%;" class="hooktheory">';
    // With poster
    //sHTML += '<video ar="' + oParams.ar + '" poster="videos/png/' + oParams.sVideoPath + '.m4v.png" controls width="' + wrap.offsetWidth + '">';

    // Without poster
    //sHTML += '<video  ar="' + oParams.ar + '" controls width="' + wrap.offsetWidth + '">'; //

    //sHTML += '<video controls="controls" width="' + oParams.nWidth + '" height="' + oParams.nHeight + '">';
    // mp4 must be first

    browser.ios = true;

    if (browser.ios) {

      // iOS Safari

      // m4v (has problems on iPhone4)
      //sHTML += '<video ar="' + oParams.ar + '" poster="videos/png/' + oParams.sVideoPath + '.png" controls width="' + wrap.offsetWidth + '" src="videos/m4v/' + oParams.sVideoPath + '.m4v" type="video/x-m4v"></video>';


      var poster = 'poster="videos/png/' + oParams.sVideoPath + '.png" ';
      var src = 'src="videos/mp4/' + oParams.sVideoPath + '.mp4" ';
      var ar = 'ar="' + oParams.ar + '" ';
      var width = 'width="' + wrap.offsetWidth + '" ';
      var type = 'type="video/mp4"';

      // Add attribute "webkit-playsinline" to play inline on iPhone
      //sHTML += '<video ar="' + oParams.ar + '" poster="videos/png/' + oParams.sVideoPath + '.png" controls width="' + wrap.offsetWidth + '" src="videos/mp4/' + oParams.sVideoPath + '.mp4" type="video/mp4"></video>';
      sHTML += '<video controls ' + ar + src + poster + width + type + '></video>';


      /*
      var src = 'src="videos/png/' + oParams.sVideoPath + '.png" ';
      var ngClick = 'ng-click="playVideo(\'videos/mp4/' + oParams.sVideoPath + '.mp4\')" ';

      sHTML += '<p>';
        sHTML += '<img ' + src + ngClick + '>';
      sHTML += '<p/>';
      */

      // + oParams.sVideoPath +
      //sHTML += '<video ar="' + oParams.ar + '" poster="videos/png/' + '1/1/C-Major-Scale' + '.png" controls width="' + wrap.offsetWidth + '" src="videos/mp4-android-comp/' + oParams.sVideoPath + '.mp4" type="video/mp4"></video>';
      //sHTML += '<video ar="' + oParams.ar + '" poster="videos/png/' + oParams.sVideoPath + '.png" controls width="' + wrap.offsetWidth + '" src="videos/mp4-android/' + oParams.sVideoPath + '.mp4"></video>
      //sHTML += '<video ar="' + oParams.ar + '" poster="videos/png/' + '1/1/C-Major-Scale' + '.png" controls width="' + wrap.offsetWidth + '" src="videos/mp4-android-comp/' + oParams.sVideoPath + '.mp4" type="video/mp4"></video>';

    }
    else if (browser.android) {  // || fireos
      //sHTML += '<p><img src="videos/png-water/' + oParams.sVideoPath + '.png" onclick="playVideo(\'file:///android_asset/www/videos/' + 'test.mp4' + '\')"><p/>';
      sHTML += '<p><img src="videos/png/' + oParams.sVideoPath + '.png" onclick="playVideo(\'file:///android_asset/www/videos/mp4/' + oParams.sVideoPath + '.mp4\')"><p/>';
    } else {

      // Desktop browser
      /*
      sHTML += '<video ar="' + oParams.ar + '" poster="videos/png/' + oParams.sVideoPath + '.png" controls width="' + wrap.offsetWidth + '">';
        // Safari, Chrome
        sHTML += '<source src="videos/mp4/' + oParams.sVideoPath + '.mp4" type="video/mp4" />';
        // Firefox
        sHTML += '<source src="videos/webm/' + oParams.sVideoPath + '.webmhd.webm" type="video/webm" />';
      sHTML += '</video>';
      */

      sHTML += '<video ar="' + oParams.ar + '" controls width="' + wrap.offsetWidth + '">';
        // Safari, Chrome
        sHTML += '<source src="videos/mp4/' + oParams.sVideoPath + '.mp4" type="video/mp4" />';
        // Firefox
        sHTML += '<source src="videos/webm/' + oParams.sVideoPath + '.webmhd.webm" type="video/webm" />';
      sHTML += '</video>';

    }




  }
  else if(oParams.sYouTubeVideoID !== undefined &&
      oParams.sYouTubeVideoID !== ""){

    // Video hosted by YouTube

    sHTML = '';
    sHTML += '<div class="youtube-container">';
      sHTML += '<iframe width="560" height="340" src="http://www.youtube.com/embed/' + oParams.sYouTubeVideoID + '?&autohide=1&rel=0" frameborder="0"  allowfullscreen></iframe>';
    sHTML += '</div>';
  }

  document.getElementById(oParams.id).innerHTML = sHTML;
}


function defaultParams(){

		var sThisURI = window.location.href;
		var sThisHost = window.location.host;
		var sHTRelID = sThisURI.substring(('http://'+sThisHost).length);

		return {
			aFlashVars: {
				HTID: 'Default HTID',
				bClickToLoad: true,
				noEditEnableYouTube: false
			},
			bShare: false,
			sHTRelID: sHTRelID,
			sServer: '',
			ar: 1
	};

}



