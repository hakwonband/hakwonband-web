/*	index	*/
hakwonMainApp.controller('indexController', function($scope, $location){
	console.log('hakwonMainApp indexController call', $scope, $location);

	$scope.$on("$routeChangeStart", function (event, current, previous, rejection) {
		console.log('hakwonMainApp $routeChangeStart', event, current, previous, rejection);
	});
	$scope.$on('$viewContentLoaded', function() {
		console.log('hakwonMainApp $viewContentLoaded', userAuth);
	});
	$scope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
		console.log('hakwonMainApp $routeChangeSuccess', userAuth);
	});

	if( userAuth.userNo ) {
		$location.path('/main');
	} else {
		window.location = "/index.do";
	}
});