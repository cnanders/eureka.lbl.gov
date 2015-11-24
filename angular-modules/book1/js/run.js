angular.module('book1')
.run(function(
	$timeout,
	$rootScope,
	$log,
	$state,
	$stateParams) {

	// Bind $state and $stateParams to $rootScope so they are 
	// accessible inside templates. 
	$rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});
