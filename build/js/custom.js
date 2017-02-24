// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('app', [
	'ui.router',  			// Nested views
]);

angular.module('app')
.config(["$stateProvider", "$urlRouterProvider", "$logProvider", "$locationProvider", function(
	$stateProvider,
	$urlRouterProvider,
	$logProvider,
	$locationProvider
){

  	//$logProvider.debugEnabled(false); // Disable $log.debug() method

	//$locationProvider.html5Mode(true);

	$stateProvider
	.state('app', {
		url: "",
		abstract: true,
		templateUrl: 'templates/body.html',
    	controller: 'BodyCtrl'
    	/*
    	views: {
    		'body': {
    			templateUrl: 'templates/body.html',
    			controller: 'BodyCtrl'
    		}
    	}
    	*/
	})
	.state('app.home', {
		url: "/home",
		templateUrl: 'templates/home.html',
    	controller: 'HomeCtrl'
    	/*
    	views: {
    		'content': {
    			templateUrl: 'templates/home.html',
    			controller: 'HomeCtrl'
    		}
    	}
    	*/
	})
	.state('app.aap', {
		url: "/academic-access-program",
		templateUrl: 'templates/aap.html',
    //controller: 'HomeCtrl'
	})
	.state('app.euv-lithography', {
		url: "/euv-lithography",
		templateUrl: 'templates/euv-lithography.html',
    //controller: 'HomeCtrl'
	})
	.state('app.euv-mask-inspection', {
		url: "/euv-mask-inspection",
		templateUrl: 'templates/euv-mask-inspection.html',
    //controller: 'HomeCtrl'
	})
	.state('app.reflectometry', {
		url: "/reflectometry",
		templateUrl: 'templates/reflectometry.html',
    //controller: 'HomeCtrl'
	})

	.state('app.proceedings', {
    	url: '/proceedings',
    	// Set to true since this isn't a we never go to this state directly, we always
    	// go to one of it's child states.
    	abstract: true,
    	templateUrl: 'templates/proceedings.html',
    	//controller: 'ProceedingsCtrl'

    })
    .state('app.proceedings.year', {
      	url: '/:year',
      	templateUrl: 'templates/proceedings.year.html',
    	controller: 'ProceedingsCtrl'
    	/*
    	controller: function($scope, $stateParams) {
    		$scope.year = $stateParams.year;
    	}
      	*/
      	/*
      	views: {
        	'content': {
    			templateUrl: 'templates/content.html',
    			controller: 'ContentCtrl'
    		}
      	}
      	*/
    });

	// Need to use '/' as first arg of when() in HTML5 mode but this/
	// does not work on Github Pages so I'm using non HTML5 mode

	// Also I think the <base href="/"> needs to be set in index.html

	$urlRouterProvider.when('','/home'); // Redirect
	$urlRouterProvider.otherwise('');
}]);

angular.module('app')

angular.module('app')
.run(["$timeout", "$rootScope", "$log", "$state", "$stateParams", "$window", "$location", function(
	$timeout,
	$rootScope,
	$log,
	$state,
	$stateParams,
	$window,
	$location) {

	// Bind $state and $stateParams to $rootScope so they are
	// accessible inside templates.
	$rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;


	$rootScope.$on(
		'$stateChangeSuccess',
    function(event){
			if (!$window.ga)
      	return;
			$log.debug('stateChangeSuccess: ' + $location.path());
			$window.ga('send', 'pageview', { page: $location.path() });
		}
	);

}]);

angular.module('app');

angular.module('app')
.controller('BodyCtrl', ["$scope", "$state", "$rootScope", "$stateParams", "$log", function(
	$scope,
	$state,
	$rootScope,
	$stateParams,
	$log) {

	$scope.navCollapse = true;

	$scope.toggleNav = function() {
		$scope.navCollapse = !$scope.navCollapse;
		$scope.log('toggleNav()');

	}

	$scope.log = function(msg) {
		$log.debug('BodyCtrl ' + msg);
	}

	/**
	 * Send the application to a new ui-router state
	 * @param  {String} state - the destination state
	 * @return {null}
	 */
	$scope.changeState = function (state) {
    $state.go(state);
  };

}]);

angular.module('app')
.controller('HomeCtrl', ["$scope", "$state", "$rootScope", "$stateParams", "$log", function(
	$scope,
	$state,
	$rootScope,
	$stateParams,
	$log) {
}]);

angular.module('app')
.controller('ProceedingsCtrl', ["$scope", "$state", "$rootScope", "$stateParams", "$log", function(
	$scope,
	$state,
	$rootScope,
	$stateParams,
	$log) {


	$scope.year = $stateParams.year;

	/**
	 * @param {Object} year - year from years[]
	 */

	$scope.selectYear = function(selectedYear) {
		// Execute a function on each item of the array
		$scope.years.forEach(function(year){
			year.selected = false;
			if (year === selectedYear) {
				year.selected = true;
				$scope.year = year.name;
			}
		});
	}

	$scope.init = function() {
		$scope.years = [];
		for (var n = 1999; n < 2016; n++) {
			if (n === 2001) {
				continue;
			}
			$scope.years.push({ name: n.toString() });

			// Select the year passed in through stateParams
			if ($scope.year === n.toString()) {
				$scope.selectYear($scope.years[$scope.years.length - 1]);
			}
		}

	}
	$scope.init();
}]);

angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("templates/aap.html"," <div class=\"container container-post-nav\"> <div class=\"row row-feature row-feature-first\"> <div class=\"col-md-8 col-md-offset-2\"> <h1>ACADEMIC ACCESS PROGRAM (AAP)</h1> <p>The EUREKA AAP welcomes proposals from academic institutions and non-profit research organizations. We strive to support the development and testing of new ideas in lithographic imaging, and related technologies, and to foster student research. Time is available on the MET, lithographic-printing / resist-testing tool, and on the SHARP EUV mask imaging microscope.</p> <p>To apply for access to EUREKA facilities, please fill in the <a>Research Proposal Form</a>, and email it to <a mailto=access@eureka.lbl.gov>access@eureka.lbl.gov</a></p> <p>New proposals will be evaluated quarterly. Proposals not granted beam time in a given period will be held for reconsideration in each subsequent quarter, for one year. Proposals will be evaluated on a combination of scientific merit, relevance, novelty, potential impact, the perceived likelihood of experiment success, and the availability of experimental time. Please address those issues in your abstract.</p> <p>For detailed information about tool capabilities and sample requirements, please contact LBNL project leaders.</p> </div> </div> </div> ");
$templateCache.put("templates/body.html"," <ng-include src=\"\'templates/nav.html\'\"></ng-include>  <ui-view></ui-view> ");
$templateCache.put("templates/content.html"," <div class=container> <div class=\"row row-top row-bottom\"> <div class=col-md-12> <ng-include src=\"\'templates/\' + year + \'.html\'\"></ng-include> </div> </div> </div> ");
$templateCache.put("templates/euv-lithography.html"," <div class=\"bg bg-primary-gradient\"> <div class=container> <div class=\"row text-center\"> <div class=\"col-md-10 col-md-offset-1\"> <h3 class=h3-subtle>EUV LITHOGRAPHY</h3> </div> </div> </div> </div> ");
$templateCache.put("templates/euv-mask-inspection.html"," <div class=\"bg bg-primary-gradient\"> <div class=container> <div class=\"row text-center\"> <div class=\"col-md-10 col-md-offset-1\"> <h3 class=h3-subtle>EUV MASK INSPECTION</h3> </div> </div> </div> </div> ");
$templateCache.put("templates/home.html"," <div class=\"bg bg-primary-gradient\"> <div class=\"container container-post-nav\"> <div class=\"row text-center\"> <div class=\"col-md-10 col-md-offset-1\">  <h1 class=\"h1-thin h1-tight-top\">EUREKA supports industry precompetitive needs in advanced EUV research and development through the development, deployment, and operation of unique instrumentation.</h1> </div> </div> </div> </div> <ng-include src=\"\'templates/member-logos-core-sq.html\'\"></ng-include> <ng-include src=\"\'templates/member-logos-associate-sq.html\'\"></ng-include> <ng-include src=\"\'templates/member-logos-partners-sq.html\'\"></ng-include> <div class=container> <div class=\"row row-feature\">  <div class=col-md-12> <h2 class=text-center>FACILITIES</h2> <div class=\"row row-no-container row-feature\"> <div class=col-md-4> <div class=\"card card-material\"> <h3>EUV LITHOGRAPHY</h3> <p>The MET has been an engine for 10-nm-node EUV materials learning for over a decade. Testing 1500 new EUV material systems each year, the MET is used by researchers around the world for early learning in key areas such as EUV resists, processing, and masks.</p>  <a href=http://met.lbl.gov target=blank class=\"btn btn-primary btn-block btn-material\">Learn More</a> </div> </div> <div class=col-md-4> <div class=\"card card-material\"> <h3>EUV MASK INSPECTION</h3>  <p>SHARP is a highly-flexible mask-imaging microscope, staffed by experts in the field, boasting the world’s highest EUV resolution, and designed to investigate the most pressing issues in photomask development and commercialization, now and far into the future.</p> <a href=http://sharp.lbl.gov target=blank class=\"btn btn-primary btn-block btn-material\">Learn More</a> </div> </div> <div class=col-md-4> <div class=\"card card-material\"> <h3>REFLECTOMETRY</h3> <p>The CXRO Reflectometer serves as a worldwide reference standard. Its high accuracy and unrivaled precision enable it to characterize the fundamental optical properties of materials, the quality of optical elements, the efficiency of grating spectrometers, the scattering properties of ultra-smooth surfaces, and the sensitivity of detectors, at EUV and soft x-ray wavelengths.</p>  <a href=http://cxro.lbl.gov/reflectometer target=blank class=\"btn btn-primary btn-block btn-material\">Learn More</a> </div> </div> </div> </div> </div> </div> ");
$templateCache.put("templates/index.html","<ng-include src=\"\'templates/nav.html\'\"></ng-include> ");
$templateCache.put("templates/member-logos-associate-a.html"," <div class=container> <div class=\"row row-feature text-center\">  <div class=\"col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2\"> <h2>ASSOCIATE MEMBERS</h2> <div class=\"row row-no-container\"> <div class=col-md-4> <a href=\"http://www.appliedmaterials.com/\" title=\"Applied Materials, Inc.\"> <img src=/img/logo/gray/logo-group-mono-applied-materials.png class=img-logo> </a> </div> <div class=col-md-4> <a href=\"http://www.jsrmicro.com/\" title=\"JSR Micro, Inc.\"> <img src=/img/logo/gray/logo-group-mono-jsr-micro.png class=img-logo> </a> </div> <div class=col-md-4> <a href=http://www.inpria.com title=\"Inpria Corp\"> <img src=/img/logo/gray/logo-group-mono-inpria.png class=img-logo> </a> </div> </div> </div> </div> </div> ");
$templateCache.put("templates/member-logos-associate-sq.html"," <div class=container> <div class=\"row row-feature text-center\">  <div class=\"col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2\"> <h2>ASSOCIATE MEMBERS</h2> <div class=\"row row-top row-no-container\"> <div class=col-md-4> <a href=\"http://www.appliedmaterials.com/\" title=\"Applied Materials, Inc.\"> <img src=/img/logo/logo-square/applied-materials.png> </a> </div> <div class=col-md-4> <a href=\"http://www.jsrmicro.com/\" title=\"JSR Micro, Inc.\"> <img src=/img/logo/logo-square/jsr-micro.png> </a> </div> <div class=col-md-4> <a href=http://www.inpria.com title=\"Inpria Corp\"> <img src=/img/logo/logo-square/inpria.png> </a> </div> </div> </div> </div> </div> ");
$templateCache.put("templates/member-logos-core-a.html"," <div class=container> <div class=\"row row-feature row-feature-first text-center\">  <div class=\"col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2\"> <h2>CORE MEMBERS</h2> <div class=\"row row-no-container\"> <div class=col-md-4> <a href=http://www.intel.com title=\"Intel Corporation\"> <img src=img/logo/gray/logo-group-mono-intel.png alt=\"Intel logo\" class=img-logo> </a> </div> <div class=col-md-4> <a href=http://www.tsmc.com title=\"Taiwan Semiconductor Manufacturing Company\"> <img src=img/logo/gray/logo-group-mono-tsmc.png alt=\"Taiwan Semiconductor Manufacturing Company (TSMC) logo\" class=img-logo> </a> </div> <div class=col-md-4> <a href=http://www.samsung.com title=\"Samsung Electronics\"> <img src=img/logo/gray/logo-group-mono-samsung.png alt=\"Samsung logo\" class=img-logo> </a> </div> </div> </div> </div> </div> ");
$templateCache.put("templates/member-logos-core-sq.html"," <div class=container> <div class=\"row row-feature row-feature-first text-center\">  <div class=\"col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2\"> <h2>CORE MEMBERS</h2> <div class=\"row row-top row-no-container\"> <div class=col-md-4> <a href=http://www.intel.com title=\"Intel Corporation\"> <img src=/img/logo/logo-square/intel.png alt=\"Intel logo\"> </a> </div> <div class=col-md-4> <a href=http://www.tsmc.com title=\"Taiwan Semiconductor Manufacturing Company\"> <img src=/img/logo/logo-square/tsmc.png alt=\"Taiwan Semiconductor Manufacturing Company (TSMC) logo\"> </a> </div> <div class=col-md-4> <a href=http://www.samsung.com title=\"Samsung Electronics\"> <img src=/img/logo/logo-square/samsung.png alt=\"Samsung logo\"> </a> </div> </div> </div> </div> </div> ");
$templateCache.put("templates/member-logos-partners-a.html"," <div class=container> <div class=\"row row-feature row-feature text-center\">  <div class=\"col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2\"> <h2>PARTNERS</h2> <div class=\"row row-no-container\"> <div class=col-md-4> <a href=http://energy.gov title=\"United States Department of Energy\"> <img src=/img/logo/gray/logo-group-mono-usdoe.png alt=\"US Department of Energy logo\"> </a> </div> <div class=col-md-4> <a href=http://cxro.lbl.gov title=\"The Center for X-Ray Optics\"> <img src=/img/logo/gray/logo-group-mono-cxro.png alt=\"Center For X-Ray Optics logo\"> </a> </div> <div class=col-md-4> <a href=http://www.lbl.gov title=\"Berkeley Lab\"> <img src=/img/logo/gray/logo-group-mono-lbl.png alt=\"Berkeley Lab logo\"> </a> </div> </div> </div> </div> </div> ");
$templateCache.put("templates/member-logos-partners-sq.html"," <div class=container> <div class=\"row row-feature row-feature text-center\">  <div class=\"col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2\"> <h2>PARTNERS</h2> <div class=\"row row-top row-no-container\"> <div class=col-md-4> <a href=http://energy.gov title=\"United States Department of Energy\"> <img src=/img/logo/logo-square/usdoe.png alt=\"US Department of Energy logo\"> </a> </div> <div class=col-md-4> <a href=http://cxro.lbl.gov title=\"The Center for X-Ray Optics\"> <img src=/img/logo/logo-square/cxro.png alt=\"Center For X-Ray Optics logo\"> </a> </div> <div class=col-md-4> <a href=http://www.lbl.gov title=\"Berkeley Lab\"> <img src=/img/logo/logo-square/lbl.png alt=\"Berkeley Lab logo\"> </a> </div> </div> </div> </div> </div> ");
$templateCache.put("templates/nav-top.html"," <div class=\"container book\"> <div class=row> <div class=\"col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2\"> <p>Proceedings from the <a ng-click=\"$state.go(\'app.home\')\">International Symposium on Extreme Ultraviolet Lithography</a></p> </div> </div> </div> ");
$templateCache.put("templates/nav.html"," <nav class=\"navbar navbar-eureka navbar-fixed-top\"> <div class=container>  <div class=\"row hidden-md-up\"> <div class=\"col-xs-8 col-nopad-l\"> <a class=\"navbar-brand a-eureka-logo\" ng-click=\"changeState(\'app.home\')\"> <img src=img/eureka-logo-01.svg alt=\"EUREKA logo\"> </a> </div> <div class=\"col-xs-4 text-right col-nopad-r\"> <button class=navbar-toggler type=button ng-click=toggleNav()> &#9776; </button> </div> </div>  <div class=\"row hidden-sm-up\" ng-if=!navCollapse ng-click=toggleNav()> <div class=\"col-xs-12 col-nopad-l col-nopad-r\"> <ul class=\"nav nav-pills nav-stacked nav-pills-underline-right\"> <li class=nav-item> <a class=nav-link ng-click=\"changeState(\'app.euv-lithography\')\"> EUV Lithography</a> </li> <li class=nav-item> <a class=nav-link ng-click=\"changeState(\'app.euv-mask-inspection\')\"> EUV Mask Inspection</a> </li> <li class=nav-item> <a class=nav-link ng-click=\"changeState(\'app.reflectometry\')\"> Reflectometry & Scatterometry</a> </li> <li class=nav-item> <a class=nav-link ng-click=\"changeState(\'app.aap\')\"> Academic Access Program</a> </li> </ul> </div> </div>  <div class=\"row hidden-sm-down\"> <div class=\"col-xs-12 text-center\"> <a class=\"navbar-brand a-eureka-logo\" ng-click=\"changeState(\'app.home\')\"> <img src=img/eureka-logo-01.svg alt=\"EUREKA logo\"> </a> <ul class=\"nav navbar-nav pull-right\"> <li class=\"nav-item nav-item-right dropdown\"> <a class=\"nav-link dropdown-toggle\" data-toggle=dropdown href=# role=button aria-haspopup=true aria-expanded=false>Facilities</a> <div class=dropdown-menu> <a class=dropdown-item ng-click=\"changeState(\'app.euv-lithography\')\"> EUV Lithography</a> <a class=dropdown-item ng-click=\"changeState(\'app.euv-mask-inspection\')\"> EUV Mask Inspection</a> <a class=dropdown-item ng-click=\"changeState(\'app.reflectometry\')\"> Reflectometry & Scatterometry</a> </div> </li> <li class=\"nav-item nav-item-right\"> <a class=nav-link ng-click=\"changeState(\'app.aap\')\"> Academic Access Program</a> </li> <li class=\"nav-item nav-item-right\"> <a class=nav-link ng-click=\"changeState(\'app.contact\')\"> Contact</a> </li> </ul> </div> </div> </div> </nav> ");
$templateCache.put("templates/reflectometry.html"," <div class=\"bg bg-primary-gradient\"> <div class=container> <div class=\"row text-center\"> <div class=\"col-md-10 col-md-offset-1\"> <h3 class=h3-subtle>REFLECTOMETRY</h3> </div> </div> </div> </div> ");}]);