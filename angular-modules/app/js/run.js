angular.module('app')
.run(function(
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

});
