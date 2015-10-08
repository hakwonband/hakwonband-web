/*	공통 네비 메뉴	*/
hakwonMainApp.controller('commNaviMenuController', function($scope, $location){
	console.log('hakwonMainApp commNaviMenuController call', $scope, $location);

	//angular.element('<div>메뉴 입니다.</div>');

	$scope.$on("$routeChangeStart", function (event, current, previous, rejection) {
		console.log('hakwonMainApp $routeChangeStart', event, current, previous, rejection);
	});
	$scope.$on('$viewContentLoaded', function() {
		console.log('hakwonMainApp $viewContentLoaded', userAuth);
	});
	$scope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
		console.log('hakwonMainApp $routeChangeSuccess', userAuth);
	});
});