angular.module('app')
.config(function(
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
});
