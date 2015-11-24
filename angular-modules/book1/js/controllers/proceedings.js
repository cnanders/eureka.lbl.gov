angular.module('book1')
.controller('ProceedingsCtrl', function(
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
});
