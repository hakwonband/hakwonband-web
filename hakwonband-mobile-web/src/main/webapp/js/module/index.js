/*	index	*/
hakwonApp.controller('indexController', function($scope, $location){
	console.log('indexController call');

	$scope.$on("$routeChangeStart", function (event, current, previous, rejection) {
		console.log('$routeChangeStart');
	});
	$scope.$on('$viewContentLoaded', function() {
		console.log('hakwonApp $viewContentLoaded', userAuth);
	});
	$scope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
		console.log('hakwonApp $routeChangeSuccess', userAuth);
	});

	if( comm.moveSite() === true ) {
		if( userAuth.userNo ) {
			$location.path('/userMain');
		} else {
			$location.path('/login');
		}
	}
});