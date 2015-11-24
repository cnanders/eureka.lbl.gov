angular.module('book1')
.controller('BodyCtrl', function(
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

});
