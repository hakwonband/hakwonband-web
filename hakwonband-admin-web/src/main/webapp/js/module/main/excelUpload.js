/**
 * 엑셀 업로드 서비스
 */
hakwonMainApp.service('excelUploadService', function($http, CommUtil) {
	console.log('hakwonMainApp excelUploadService call', CommUtil);

	var ExcelUploadService = {};

	ExcelUploadService.test = function() {

	};

	return ExcelUploadService;
});

/**
 * 엑셀 업로드
 */
hakwonMainApp.controller('hakwonExcelUploadController', function($scope, $location, $routeParams, excelUploadService, CommUtil) {
	console.log('hakwonMainApp hakwonExcelUploadController call', $scope, $location, $routeParams, excelUploadService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#', title:'엑셀업로드'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;


		$("#wrapper").show();

		$scope.$$postDigest(function(){
			console.log('$$postDigest');

			// TODO : 업로드후, 컨트롤러 url 변경 /hakwon/upload/excel.do
			
			/*	파일 업로드 셋팅	*/
			var messageUploadOptions = new ExcelUploadOptions();
			messageUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_MESSAGE};
			messageUploadOptions.setProgress = function(val) {
				comm.progress(Math.ceil(val * 100));
			};
			messageUploadOptions.onFinish = function(event, total) {
				
				if (this.errorFileArray.length + this.errorCount > 0) {
					alert('메세지 파일 업로드를 실패 했습니다.');
				} else {
					var resultMsg = '';
					var flag = this.uploadResult.flag;
					if(flag == 'success') {
						resultMsg = this.uploadResult.dataCount + '개의 학원 데이터가 저장되었습니다.';
					} else if(flag == 'invalid') {
						resultMsg = '유요하지 않은 데이터 입니다. </br>';
						var invalidList = this.uploadResult.invalid;
						if(invalidList != null && invalidList.length > 0) {
							for(var i=0,iMax=invalidList.length; i<iMax; i++) {
								resultMsg += invalidList[i] + '</br>';
							}
						}
					} else if(flag == 'error') {
						resultMsg = 'ERROR : ' + this.uploadResult.errMsg;
					}
					
					$('#excel_upload_result').html(resultMsg);
				}
			};

			$("input[data-act=excel_upload]").html5_upload(messageUploadOptions);

		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});