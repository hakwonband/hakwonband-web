/**
 * 학원 서비스
 */
hakwonMainApp.service('hakwonService', function($http, CommUtil) {
	console.log('hakwonMainApp hakwonService call', CommUtil);

	var hakwonService = {};

	/**
	 * 업로드 옵션 생성
	 */
	hakwonService.getUploadOptions = function() {

		// 파일 업로드 객체 생성
		var logoUploadOptions = new UploadOptions();
		logoUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_HAKWON_LOGO};
		logoUploadOptions.onFinish = function(event, total) {
			if (this.errorFileArray.length + this.errorCount > 0) {
				alert('학원 로고 업로드를 실패 했습니다.');
			} else {
				console.log(this.uploadFileArray);
				/********************
				 * fileNo
				 * filePath
				 * thumbFilePath
				 * fileName
				 * imageYn
				 ********************/
				for (var i = 0; i < this.uploadFileArray.length; i++) {
					var fileInfo = this.uploadFileArray[i];
					if (fileInfo.imageYn == 'Y') {
						$('div[data-view=image_preveiw] > img').remove();
						$('div[data-view=image_preveiw]').prepend('<img alt="image" src="'+HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.thumbFilePath+'" data-file-no="'+fileInfo.fileNo+'">');
					} else {
						alert('이미지 파일이 아닙니다.');
					}
				}
			}
		};

		return logoUploadOptions;
	};

	/**
	 * 학원 리스트 조회
	 */
	hakwonService.hakwonList = function(pageNo, searchSido, searchGugun, searchCateCode, searchText, adminRegYn, searchStatus) {
		var param = {
			pageNo : pageNo
			, searchSido : searchSido
			, searchGugun : searchGugun
			, searchCateCode : searchCateCode
			, searchText : searchText
			, adminRegYn : adminRegYn
			, searchStatus : searchStatus
		};

		/**
		 * 학원 번호 파라미터로 들어갈수 있음
		 */
		$.ajax({
			url: contextPath+"/admin/hakwon/list.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;

					var $viewDiv = $('#mainNgView div[data-view=data-div]');
					var $dataTableBody = $viewDiv.find('table > tbody');

					$dataTableBody.html($.tmpl(hakwonTmpl.hakwon.listRow, colData));

					var totalPages = comm.pageCalc(colData.hakwonCount, colData.pageScale);
					$('#mainNgView div[data-view=pagination]').bootpag({
						total: totalPages,
						page: pageNo,
						maxVisible: DefaultInfo.pageScale,
						leaps: true
					}).unbind("page").bind("page", function(event, page){
						param.pageNo = page;
						window.location.href = PageUrl.hakwon.list+'?'+$.param(param);
					});
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	}

	/**
	 * 지번 주소 검색
	 */
	hakwonService.searchOldAddr = function() {
		var searchOldDong = $('input[name=searchOldDong]').val();
		if( isNull(searchOldDong) ) {
			alert('검색어를 입력해 주세요.');
			$('input[name=searchOldDong]').focus();
			return false;
		}
		$.ajax({
			url: contextPath+"/admin/address/searchOldDong.do",
			type: "post",
			data: $.param({searchOldDong:searchOldDong}, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					if( !colData || !colData.dataList || colData.dataList.length == 0 ) {
						alert('검색된 주소가 없습니다.');
						return false;
					} else {
						$('#mainNgView ul[data-view=oldAddrList]').html($.tmpl(hakwonTmpl.hakwon.oldAddrRow, colData)).show();
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/*	도로명 주소 검색	*/
	hakwonService.searchNewAddr = function() {
		var searchStreetDong = $('input[name=searchStreetDong]').val();
		if( isNull(searchStreetDong) ) {
			alert('검색어를 입력해 주세요.');
			$('input[name=searchStreetDong]').focus();
			return false;
		}
		var param = {
			confmKey : HakwonConstant.Api.JUSO_CONFIRM_KEY
			, currentPage : 1
			, countPerPage : 20
			, keyword:searchStreetDong
		};
		$.ajax({
			url : HakwonConstant.Api.JUSO_HOST
			,type:"post"
			,data:$.param(param, true)
			,dataType:"jsonp"
			,crossDomain:true
			,success:function(xmlStr){
				var xmlData = undefined;
				if(navigator.appName.indexOf("Microsoft") > -1){
					xmlData = new ActiveXObject("Microsoft.XMLDOM");
					xmlData.loadXML(xmlStr.returnXml)
				} else {
					xmlData = xmlStr.returnXml;
				}
				console.log('xmlData', xmlData);
				var errCode = $(xmlData).find("errorCode").text();
				var errDesc = $(xmlData).find("errorMessage").text();
				if(errCode != "0") {
					alert(errCode+"="+errDesc);
				} else {
					if(xmlData != null) {
						var htmlStr = "";
						$(xmlData).find("juso").each(function() {
							htmlStr +=  '<li data-act="streetAddrLI">';
							htmlStr +=  '	<a href="#" onclick="return false;"><span>'+$(this).find('roadAddrPart1').text()+'</span> '+$(this).find('roadAddrPart2').text()+'</a>';
							htmlStr +=  '</li>';
						});
						console.log('htmlStr : ' + htmlStr);
						$('#mainNgView ul[data-view=streetAddrList]').html(htmlStr).show();
					} else {
						alert('검색 결과가 없습니다. 정확한 주소를 입력해 주세요.');
					}
				}
			}
			,error: function(xhr,status, error){
				alert("에러발생");
			}
		});
	};


	/**
	 * 학원 등록
	 */
	hakwonService.hakwonRegist = function() {

		var hakwonName	= $('input[name=hakwonName]').val();
		var hakwonCate	= $('select[name=hakwonCate]').val();
		var telNo		= $('input[name=telNo]').val();
		var addrNo		= $('input[name=oldAddr1]').attr('data-addr-no');
		var oldAddr1	= $('input[name=oldAddr1]').val();
		var oldAddr2	= $('input[name=oldAddr2]').val();
		var streetAddr1	= $('input[name=streetAddr1]').val();
		var streetAddr2	= $('input[name=streetAddr2]').val();

		var logoFileNo = $('div[data-view=image_preveiw] > img').attr('data-file-no');

		if( isNull(hakwonName) ) {
			alert('학원명을 입력해 주세요.');
			$('input[name=hakwonName]').focus();
			return false;
		}
		if( isNull(hakwonCate) ) {
			alert('학원 카테고리를 선택해 주세요.');
			return false;
		}
		if( isNull(addrNo) ) {
			alert('번지 주소를 검색해서 선택해 주세요.');
			return false;
		}
		if( isNull(oldAddr1) || isNull(oldAddr2) ) {
			alert('번지 주소를 입력해 주세요.');
			$('input[name=oldAddr1]').focus();
			return false;
		}

		var param = {};

		param.hakwonName	= hakwonName;
		param.hakwonCate	= hakwonCate;
		param.telNo			= telNo;
		param.addrNo		= addrNo;
		param.oldAddr1		= oldAddr1;
		param.oldAddr2		= oldAddr2;
		param.streetAddr1	= streetAddr1;
		param.streetAddr2	= streetAddr2;
		if( logoFileNo ) {
			param.logoFileNo	= logoFileNo;
		}

		/**
		 * 학원 등록
		 */
		$.ajax({
			url: contextPath+"/admin/hakwon/regist.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					if( colData.hakwonNo ) {
						window.location = '#/hakwon/list';
					} else {
						alert('학원 등록을 실패 했습니다.');
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 학원 삭제
	 */
	hakwonService.hakwonAdminDelete = function(hakwonNo) {
		if( window.confirm('진짜 학원을 삭제 하시겠습니까?') ) {
			var param = {hakwonNo:hakwonNo};
			/**
			 * 학원 삭제
			 */
			$.ajax({
				url: contextPath+"/admin/hakwon/adminDelete.do",
				type: "post",
				data: $.param(param, true),
				headers : hakwonInfo.getHeader(),
				dataType: "json",
				success: function(data) {
					if( data.error ) {
						alert('학원 삭제를 실패 했습니다.');
					} else {
						var colData = data.colData;
						if( colData.flag == CommonConstant.Flag.success ) {
							window.location = '#/hakwon/list';
						} else {
							alert('학원 삭제를 실패 했습니다.');
						}
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					alert('통신을 실패 했습니다.');
				}
			});
		}
	};

	/**
	 * 학원 수정
	 */
	hakwonService.hakwonAdminModify = function(hakwonNo) {

		var hakwonName	= $('input[name=hakwonName]').val();
		var hakwonCate	= $('select[name=hakwonCate]').val();
		var telNo		= $('input[name=telNo]').val();
		var addrNo		= $('input[name=oldAddr1]').attr('data-addr-no');
		var oldAddr1	= $('input[name=oldAddr1]').val();
		var oldAddr2	= $('input[name=oldAddr2]').val();
		var streetAddr1	= $('input[name=streetAddr1]').val();
		var streetAddr2	= $('input[name=streetAddr2]').val();

		var logoFileNo = $('div[data-view=image_preveiw] > img').attr('data-file-no');

		if( isNull(hakwonName) ) {
			alert('학원명을 입력해 주세요.');
			$('input[name=hakwonName]').focus();
			return false;
		}
		if( isNull(hakwonCate) ) {
			alert('학원 카테고리를 선택해 주세요.');
			return false;
		}
		if( isNull(addrNo) ) {
			alert('번지 주소를 검색해서 선택해 주세요.');
			return false;
		}
		if( isNull(oldAddr1) || isNull(oldAddr2) ) {
			alert('번지 주소를 입력해 주세요.');
			$('input[name=oldAddr1]').focus();
			return false;
		}

		var param = {};
		param.hakwonNo	= hakwonNo;
		param.hakwonName	= hakwonName;
		param.hakwonCate	= hakwonCate;
		param.telNo			= telNo;
		param.addrNo		= addrNo;
		param.oldAddr1		= oldAddr1;
		param.oldAddr2		= oldAddr2;
		param.streetAddr1	= streetAddr1;
		param.streetAddr2	= streetAddr2;
		if( logoFileNo ) {
			param.logoFileNo	= logoFileNo;
		}

		/**
		 * 학원 등록
		 */
		$.ajax({
			url: contextPath+"/admin/hakwon/adminModify.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				if( data.error ) {
					alert('학원 수정을 실패 했습니다.');
				} else {
					var colData = data.colData;
					if( colData.hakwonNo ) {
						window.history.back();
					} else {
						alert('학원 수정을 실패 했습니다.');
					}
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/**
	 * 학원 검색 파람
	 */
	hakwonService.listSearchParam = function() {
		var searchSido = $('#mainNgView select[name=searchSido]').val();
		var searchGugun = $('#mainNgView select[name=searchGugun]').val();
		var searchText = $('#mainNgView input[name=searchText]').val();
		var adminRegYn = $('#mainNgView select[name=adminRegYn]').val();
		var searchCateCode = $('#mainNgView select[name=searchCateCode]').val();
		var searchStatus = $('#mainNgView select[name=searchStatus]').val();

		var searchParam = {
			pageNo:1, searchCateCode:searchCateCode, searchStatus:searchStatus
			, searchText:searchText, adminRegYn:adminRegYn
			, searchSido:searchSido, searchGugun:searchGugun
		};

		return searchParam;
	};


	/**
	 * 학원 수정 정보 조회
	 */
	hakwonService.hakwonModifyInfo = function(hakwonNo) {
		var param = {hakwonNo : hakwonNo};

		/**
		 * 학원 번호 파라미터로 들어갈수 있음
		 */
		$.ajax({
			url: contextPath+"/admin/hakwon/modifyInfo.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('학원 정보 조회를 실패 했습니다.');
						window.history.back();
					} else {
						var colData = data.colData;
						$('#mainNgView form[data-view=modifyForm]').html($.tmpl(hakwonTmpl.hakwon.adminModify, colData));
						if( comm.isAndroidUploader() ) {
							angular.element("input[data-act=photo_upload]").click(function() {
								delete window.uploadCallBack;
								window.uploadCallBack = function(uploadJsonStr) {
									try {
										var resultObj = JSON.parse(uploadJsonStr);
										if( resultObj.error ) {
											alert('학원 로고 업로드를 실패 했습니다.');
										} else {
											var fileInfo = resultObj.colData;
											if (fileInfo.imageYn == 'Y') {
												$('div[data-view=image_preveiw] > img').remove();
												$('div[data-view=image_preveiw]').prepend('<img alt="image" src="'+HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.thumbFilePath+'" data-file-no="'+fileInfo.fileNo+'">');
											} else {
												alert('이미지 파일이 아닙니다.');
											}
										}
									} catch(e) {
										alert('학원 로고 업로드를 실패 했습니다.');
									}
								};
								var param = {
									fileType : 'img'
									, multipleYn : 'N'
									, callBack : 'uploadCallBack'
									, upload : {
										url : window.location.protocol+'//'+window.location.host+uploadUrl
										, param : {uploadType:CommonConstant.File.TYPE_HAKWON_LOGO}
										, cookie : document.cookie
									}
								};
								window.PLATFORM.fileChooser(JSON.stringify(param));

								return false;
							});
						} else {
							$("input[data-act=photo_upload]").html5_upload(hakwonService.getUploadOptions());
						}
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	return hakwonService;
});

/**
 * 리스트
 */
hakwonMainApp.controller('hakwonListController', function($scope, $location, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonListController call', $scope, $location, $routeParams, hakwonService, CommUtil);

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	/*	공통 유틸	*/
	$scope.CommUtil = CommUtil;

	/*	헤더 셋팅	*/
	comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#', title:'학원 리스트'}]);

	/**
	 * 학원 카테고리 리스트
	 */
	CommUtil.ajax({url:contextPath+"/admin/hakwonCate/cateList.do", successFun:function(data) {
		try {
			$scope.hakwonCateList = data.colData.dataList;
		} catch(ex) {
			commProto.errorDump({errorObj:ex});
		}
	}});

	var paramSearchSido = $routeParams.searchSido;
	$scope.searchSido = paramSearchSido;

	/*	시도	*/
	$scope.sidoArray = DefaultInfo.sido;

	/*	시도 선택시	*/
	$scope.sidoSelect = function() {
		var searchParam = hakwonService.listSearchParam();

		console.log('searchParam.searchSido : ' + searchParam.searchSido);

		if( isNull(searchParam.searchSido) ) {
			$('select[name=searchGugun]').empty().append('<option value="">구군 전체</option>');
		}

		window.location.href = PageUrl.hakwon.list+'?'+$.param(searchParam);
	};

	/*	구군 선택시	*/
	$('#mainNgView').on('change', 'select[name=searchGugun]', function() {
		var searchParam = hakwonService.listSearchParam();

		window.location.href = PageUrl.hakwon.list+'?'+$.param(searchParam);
	});

	/*	검색	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=search]', function() {
		var searchParam = hakwonService.listSearchParam();

		window.location.href = PageUrl.hakwon.list+'?'+$.param(searchParam);
	});

	/*	관리자 학원 등록	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=adminHakwonRegist]', function() {
		window.location = '#/hakwon/regist';
	});

	/*	카테고리 변경	*/
	$scope.cateChange = function() {
		var searchParam = hakwonService.listSearchParam();
		window.location.href = PageUrl.hakwon.list+'?'+$.param(searchParam);
	}

	/*	상태 변경	*/
	$scope.statusChange = function() {
		var searchParam = hakwonService.listSearchParam();
		window.location.href = PageUrl.hakwon.list+'?'+$.param(searchParam);
	}

	/*	관리자 등록 여부 변경	*/
	$scope.adminRegYnChange = function() {
		var searchParam = hakwonService.listSearchParam();
		window.location.href = PageUrl.hakwon.list+'?'+$.param(searchParam);
	}


	/*	화면 로드 후	*/
	$scope.$on('$viewContentLoaded', function() {
		console.log('hakwonListController $viewContentLoaded');

		/**
		 * 페이지 번호
		 */
		var pageNo = $routeParams.pageNo;
		if( !pageNo ) pageNo = 1;

		var searchSido = $routeParams.searchSido;
		if( !searchSido ) searchSido = '';

		var searchGugun = $routeParams.searchGugun;
		if( !searchGugun ) searchGugun = '';

		var searchText = $routeParams.searchText;
		if( !searchText ) searchText = '';

		var searchCateCode = $routeParams.searchCateCode;
		if( !searchCateCode ) searchCateCode = '';
		$scope.searchCateCode = {};
		$scope.searchCateCode.cateCode = searchCateCode;

		var adminRegYn = $routeParams.adminRegYn;
		if( !adminRegYn ) adminRegYn = 'N';
		$scope.adminRegYn = adminRegYn;

		var searchStatus = $routeParams.searchStatus;
		if( !searchStatus ) searchStatus = '';
		$scope.searchStatus = searchStatus;

		$('#mainNgView input[name=searchText]').val(searchText);

		/*	구군 셋팅	*/
		if( searchSido ) {
			var gugunArray = DefaultInfo.gugun[searchSido];
			if( !gugunArray ) {
				comm.getGugun(searchSido, function() {
					gugunArray = DefaultInfo.gugun[searchSido];
					var gugunHtml = '<option value="">구군 전체</option>';
					for(var i=0; i<gugunArray.length; i++) {
						var selectedVal = '';
						if( searchGugun == gugunArray[i] ) {
							selectedVal = 'selected';
						}
						gugunHtml += '<option value="'+gugunArray[i]+'" '+selectedVal+'>'+gugunArray[i]+'</option>';
					}
					$('select[name=searchGugun]').html(gugunHtml);
				});
			} else {
				var gugunHtml = '<option value="">구군 전체</option>';
				for(var i=0; i<gugunArray.length; i++) {
					var selectedVal = '';
					if( searchGugun == gugunArray[i] ) {
						selectedVal = 'selected';
					}
					gugunHtml += '<option value="'+gugunArray[i]+'" '+selectedVal+'>'+gugunArray[i]+'</option>';
				}
				$('select[name=searchGugun]').html(gugunHtml);
			}
		}

		hakwonService.hakwonList(pageNo, searchSido, searchGugun, searchCateCode, searchText, adminRegYn, searchStatus);
	});

	$("#wrapper").show();
});


/**
 * 학원 등록
 */
hakwonMainApp.controller('hakwonRegistController', function($scope, $location, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonRegistController call', $scope, $location, $routeParams, hakwonService, CommUtil);

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	/*	공통 유틸	*/
	$scope.CommUtil = CommUtil;

	/*	헤더 셋팅	*/
	comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#', title:'관리자 학원 등록'}]);

	/**
	 * 학원 카테고리 리스트
	 */
	CommUtil.ajax({url:contextPath+"/admin/hakwonCate/cateList.do", successFun:function(data) {
		try {
			$scope.hakwonCateList = data.colData.dataList;
		} catch(ex) {
			commProto.errorDump({errorObj:ex});
		}
	}});

	/*	목록 이동	*/
	$scope.goList = function () {
		$location.path('/hakwon/list');
	}

	/**
	 * 학원 등록
	 */
	$scope.regist = function() {
		hakwonService.hakwonRegist();
	}

	/**
	 * 로고 삭제
	 */
	$scope.logoDelete = function() {
		$('div[data-view=image_preveiw] > img').remove();
	}

	/**
	 * 지번 검색
	 */
	$('#mainNgView').on(clickEvent, 'button[data-act=searchOldAddr]', hakwonService.searchOldAddr);
	$('#mainNgView').on('keypress', 'input[name=searchOldDong]', function( event ) {
		if ( event.which == 13 ) {
			hakwonService.searchOldAddr();
			event.preventDefault();
		}
	});

	/**
	 * 지번 선택
	 */
	$('#mainNgView').on(clickEvent, 'li[data-act=oldAddrLI]', function() {
		var addrNo = $(this).attr('data-addr-no');
		$('input[name=oldAddr1]').attr('data-addr-no', addrNo);

		var addr1 = $(this).find('span').text();
		$('input[name=oldAddr1]').val(addr1);
		$('input[name=oldAddr2]').focus();

		$('#mainNgView ul[data-view=oldAddrList]').hide();
		$('#mainNgView').find('li[data-act=oldAddrLI]').remove();
	});

	/*	도로명 검색	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=searchStreetDong]', hakwonService.searchNewAddr);
	$('#mainNgView').on('keypress', 'input[name=searchStreetDong]', function( event ) {
		if ( event.which == 13 ) {
			hakwonService.searchNewAddr();
			event.preventDefault();
		}
	});
	/**
	 * 도로명 선택
	 */
	$('#mainNgView').on(clickEvent, 'li[data-act=streetAddrLI]', function() {
		var addr1 = $(this).find('span').text();
		$('input[name=streetAddr1]').val(addr1);
		$('input[name=streetAddr2]').focus();

		$('#mainNgView ul[data-view=streetAddrList]').hide();
		$('#mainNgView').find('li[data-act=streetAddrLI]').remove();
	});



	$scope.$on('$viewContentLoaded', function() {
		console.log('hakwonRegistController $viewContentLoaded call');

		// 파일 업로드 객체 생성
		if( comm.isAndroidUploader() ) {
			angular.element("input[data-act=banner_upload]").click(function() {
				delete window.uploadCallBack;
				window.uploadCallBack = function(uploadJsonStr) {
					try {
						var resultObj = JSON.parse(uploadJsonStr);
						if( resultObj.error ) {
							alert('학원 로고 업로드를 실패 했습니다.');
						} else {
							var fileInfo = resultObj.colData;
							if (fileInfo.imageYn == 'Y') {
								$('div[data-view=image_preveiw] > img').remove();
								$('div[data-view=image_preveiw]').prepend('<img alt="image" src="'+HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.thumbFilePath+'" data-file-no="'+fileInfo.fileNo+'">');
							} else {
								alert('이미지 파일이 아닙니다.');
							}
						}
					} catch(e) {
						alert('학원 로고 업로드를 실패 했습니다.');
					}
				};
				var param = {
					fileType : 'img'
					, multipleYn : 'N'
					, callBack : 'uploadCallBack'
					, upload : {
						url : window.location.protocol+'//'+window.location.host+uploadUrl
						, param : {uploadType:CommonConstant.File.TYPE_HAKWON_LOGO}
						, cookie : document.cookie
					}
				};
				window.PLATFORM.fileChooser(JSON.stringify(param));

				return false;
			});
		} else {
			$("input[data-act=banner_upload]").html5_upload(hakwonService.getUploadOptions());
		}
	});

	$("#wrapper").show();

});


/**
 * 학원 수정
 */
hakwonMainApp.controller('hakwonAdminModifyController', function($scope, $location, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonAdminModifyController call', $scope, $location, $routeParams, hakwonService, CommUtil);

	/*	페이지 초기화 호출	*/
	hakwonCommon.pageInit();

	/*	공통 유틸	*/
	$scope.CommUtil = CommUtil;

	/*	현재 학원 번호	*/
	var currentHakwonNo = $routeParams.hakwon_no;

	/*	목록 이동	*/
	$scope.goList = function () {
		$location.path('/hakwon/list');
	}

	/**
	 * 지번 검색
	 */
	$('#mainNgView').on(clickEvent, 'button[data-act=searchOldAddr]', hakwonService.searchOldAddr);
	$('#mainNgView').on('keypress', 'input[name=searchOldDong]', function( event ) {
		if ( event.which == 13 ) {
			hakwonService.searchOldAddr();
			event.preventDefault();
		}
	});

	/**
	 * 지번 선택
	 */
	$('#mainNgView').on(clickEvent, 'li[data-act=oldAddrLI]', function() {
		var addrNo = $(this).attr('data-addr-no');
		$('input[name=oldAddr1]').attr('data-addr-no', addrNo);

		var addr1 = $(this).find('span').text();
		$('input[name=oldAddr1]').val(addr1);
		$('input[name=oldAddr2]').focus();

		$('#mainNgView ul[data-view=oldAddrList]').hide();
		$('#mainNgView').find('li[data-act=oldAddrLI]').remove();
	});

	/*	도로명 검색	*/
	$('#mainNgView').on(clickEvent, 'button[data-act=searchStreetDong]', hakwonService.searchNewAddr);
	$('#mainNgView').on('keypress', 'input[name=searchStreetDong]', function( event ) {
		if ( event.which == 13 ) {
			hakwonService.searchNewAddr();
			event.preventDefault();
		}
	});
	/**
	 * 도로명 선택
	 */
	$('#mainNgView').on(clickEvent, 'li[data-act=streetAddrLI]', function() {
		var addr1 = $(this).find('span').text();
		$('input[name=streetAddr1]').val(addr1);
		$('input[name=streetAddr2]').focus();

		$('#mainNgView ul[data-view=streetAddrList]').hide();
		$('#mainNgView').find('li[data-act=streetAddrLI]').remove();
	});


	/**
	 * 로고 삭제
	 */
	$('#mainNgView').on(clickEvent, 'button[data-act=logoDelete]', function() {
		$('div[data-view=image_preveiw] > img').remove();
	});

	/**
	 * 취소
	 */
	$('#mainNgView').on(clickEvent, 'button[data-act=cancel]', function() {
		if (history.length > 1) {
			window.history.back();
		} else {
			$location.path('/hakwon/list');
		}
	});

	/**
	 * 삭제
	 */
	$('#mainNgView').on(clickEvent, 'button[data-act=delete]', function() {
		hakwonService.hakwonAdminDelete(currentHakwonNo);
	});

	/**
	 * 수정
	 */
	$('#mainNgView').on(clickEvent, 'button[data-act=modify]', function() {
		hakwonService.hakwonAdminModify(currentHakwonNo);
	});

	$("#wrapper").show();
	$scope.$on('$viewContentLoaded', function() {
		console.log('hakwonAdminModifyController $viewContentLoaded call');

		hakwonService.hakwonModifyInfo(currentHakwonNo);
	});
});