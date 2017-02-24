angular.module('app')
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

	/**
	 * Send the application to a new ui-router state
	 * @param  {String} state - the destination state
	 * @return {null}
	 */
	$scope.changeState = function (state) {
    $state.go(state);
  };

});
