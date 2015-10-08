/*	index	*/
hakwonCommonApp.controller('indexController', function($scope, $location){
	console.log('indexController call', $scope, $location);

	$scope.$on("$routeChangeStart", function (event, current, previous, rejection) {
		console.log('$routeChangeStart', event, current, previous, rejection);
	});
	$scope.$on('$viewContentLoaded', function() {
		console.log('hakwonApp $viewContentLoaded', userAuth);
	});
	$scope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
		console.log('hakwonApp $routeChangeSuccess', userAuth);
	});

	if( userAuth.userNo ) {
		window.location = "/main.do";
	} else {
		$location.path('/login');
	}
});