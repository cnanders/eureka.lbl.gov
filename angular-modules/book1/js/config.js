angular.module('book1')
.config(function(
	$stateProvider,
	$urlRouterProvider,
	$logProvider,
	$locationProvider
){

  	//$logProvider.debugEnabled(false); // Disable $log.debug() method

	$locationProvider.html5Mode(true);

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
	$urlRouterProvider.when('/','/home'); // Redirect
	$urlRouterProvider.when('/proceedings', '/proceedings/2015'); // Redirect
	$urlRouterProvider.otherwise('');
});

