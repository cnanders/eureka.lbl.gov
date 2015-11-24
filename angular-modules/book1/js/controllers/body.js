angular.module('book1')
.controller('BodyCtrl', function(
	$scope,
	$state,
	$rootScope,
	$stateParams,
	$log) {

	$scope.navCollapse = true;
	
	$scope.go = function(state) {
		
		$scope.log('go() ' + state);
		
		if (state === 'app.proceedings') {
			$state.go('app.proceedings.year', { year: 2015 });
			return;
		}
		$state.go(state);
	}
	
	$scope.toggleNav = function() {
		$scope.navCollapse = !$scope.navCollapse;
		$scope.log('toggleNav()');
	
	}
	
	$scope.log = function(msg) {
		$log.debug('BodyCtrl ' + msg);
	}

});
