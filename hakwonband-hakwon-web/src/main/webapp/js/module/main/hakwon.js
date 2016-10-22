
/**
 * 학원 서비스
 */
hakwonMainApp.service('hakwonService', function(CommUtil) {
	console.log('hakwonMainApp hakwonService call');

	var hakwonService = {};

	/**
	 * 학원 전체 주소 생성
	 * @param hakwonObj
	 * @returns {string}
	 */
	hakwonService.createAllAddrText = function(hakwonObj) {
		var resultAddr = '';

		if (!isNull(hakwonObj.street_addr1) && !isNull(hakwonObj.street_addr2)) {
			resultAddr = hakwonObj.street_addr1 + hakwonObj.street_addr2;
		} else if (!isNull(hakwonObj.old_addr1) && !isNull(hakwonObj.old_addr2)) {
			resultAddr = hakwonObj.all_addr_text = hakwonObj.old_addr1 + hakwonObj.old_addr2;
		} else {
			resultAddr = '';
		}
		return resultAddr;
	};

	/**
	 * 첨부파일 업로드 옵션 생성
	 */
	hakwonService.getFileUploadOptions = function($scope) {
		// 파일 업로드 객체 생성
		var fileUploadOptions = new UploadOptions();
		fileUploadOptions.customExtraFields = {uploadType:CommonConstant.File.TYPE_INTRODUCTION};
		fileUploadOptions.onFinish = function(event, total) {
			if (this.errorFileArray.length + this.errorCount > 0) {
				alert('첨부파일 업로드를 실패 했습니다.');
			} else {
				/********************
				 * fileNo
				 * filePath
				 * thumbFilePath
				 * fileName
				 * imageYn
				 ********************/

				for (var i = 0; i < this.uploadFileArray.length; i++) {
					var fileInfo = this.uploadFileArray[i];

					// 임시 파일 object
					var tempObj = {
						file_no 			: '',
						file_parent_type	: '',
						file_name			: '',
						save_file_name		: '',
						file_size			: '',
						file_ext_type		: '',
						file_ext			: '',
						file_path_prefix	: '',
						file_path			: '',
						image_yn			: '',
						thumb_file_path		: '',
						reg_date			: ''
					};

					tempObj.file_no		= fileInfo.fileNo;
					tempObj.file_name	= fileInfo.fileName;
					tempObj.file_path	= fileInfo.filePath;
					tempObj.image_yn	= fileInfo.imageYn;

					$scope.fileList.push(tempObj);
					$scope.$digest();
				}
			}
		};
		return fileUploadOptions;
	};

	/**
	 * 업로드 옵션 생성
	 */
	hakwonService.getLogoUploadOptions = function() {
		// 파일 업로드 객체 생성
		var logoUploadOptions = new UploadOptions();
		logoUploadOptions.customExtraFields = {uploadType: CommonConstant.File.TYPE_HAKWON_LOGO};
		logoUploadOptions.onFinish = function(event, total) {
			if (this.errorFileArray.length + this.errorCount > 0) {
				alert('학원로고 업로드를 실패 했습니다.');
			} else {
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
						$('div[data-view=image_preveiw]').prepend('<img alt="image" src="'+HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath+'" data-file-no="'+fileInfo.fileNo+'">');
					} else {
						alert('이미지 파일이 아닙니다.');
					}
				}
			}
		};

		return logoUploadOptions;
	};

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
			url: contextPath+"/hakwon/address/searchOldDong.do",
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
			,success:function(xmlStr) {
				try {
					var xmlData = undefined;
					if(navigator.appName.indexOf("Microsoft") > -1){
						xmlData = new ActiveXObject("Microsoft.XMLDOM");
						xmlData.loadXML(xmlStr.returnXml)
					} else {
						xmlData = xmlStr.returnXml;
					}
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
							$('#mainNgView ul[data-view=streetAddrList]').html(htmlStr).show();
						} else {
							alert('검색 결과가 없습니다. 정확한 주소를 입력해 주세요.');
						}
					}
				} catch(e) {
					console.error(e);
				}
			}
			,error: function(xhr,status, error){
				console.error(xhr, status, error);
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


		if( hakwonInfo.hakwonList.length > 0 ) {
			if( window.confirm('추가 비용이 발생합니다.\n또한 관리자의 승인 후 학원을 이용 할 수 있습니다.\n계속 이용 하시겠습니까?') == false ) {
				return ;
			}
		}

		/**
		 * 학원 등록
		 */
		$.ajax({
			url: contextPath+"/hakwon/master/regist.do",
			type: "post",
			data: $.param(param, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					if( colData.hakwonNo ) {
						window.location.reload();
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
	 * 학원 수정
	 */
	hakwonService.hakwonEdit = function($scope) {
		var hakwonInfo	= $scope.hakwonObj;
		if (isNull(hakwonInfo.hakwon_no)) {
			alert('학원 번호가 올바르지 않습니다.');
			return ;
		}
		if( isNull(hakwonInfo.hakwon_name) ) {
			alert('학원명을 입력해 주세요.');
			$('input[name=hakwonName]').focus();
			return false;
		}
		if( isNull(hakwonInfo.hakwon_cate) ) {
			alert('학원 카테고리를 선택해 주세요.');
			return false;
		}
		if( isNull(hakwonInfo.old_addr1) || isNull(hakwonInfo.old_addr2 || isNull(hakwonInfo.addr_no)) ) {
			alert('번지 주소를 입력해 주세요.');
			$('input[name=oldAddr1]').focus();
			return false;
		}

		CommUtil.ajax({url:contextPath+"/hakwon/master/masterHakwonUpdate.do", param:$scope.hakwonObj, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData.result == CommonConstant.Flag.success ) {
					alert('학원정보가 수정되었습니다.');
					CommUtil.locationHref(PageUrl.main, {}, 'hakwon');
				} else {
					commProto.logger({hakwonDetailError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 학원 소개 미리보기
	 */
	hakwonService.previewIntro = function() {
		var editContent = tinymce.activeEditor.getContent();
		editContent = editContent.replace(/><\/div>/g, ">&nbsp;</div>");
		editContent = editContent.replace(/><\/p>/g, ">&nbsp;</p>");

		var params = {
			hakwon_no			: hakwonInfo.hakwon_no
			, introduction		: editContent
		};

		$.ajax({
			url: contextPath+"/hakwon/master/previewIntro.do",
			type: "post",
			data: $.param(params, true),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;
					if( colData || colData.preivewNo ) {
						window.open(HakwonConstant.Site.MOBILE+'/preview.do?preview_no='+colData.preivewNo, "", "width=320, height=480");
						return false;
					} else {
						alert('미리보기를 실패 했습니다.');
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
 * 학원소개 컨트롤러
 */
hakwonMainApp.controller('hakwonIntroController', function($scope, $location, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonIntroController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		$scope.urlParams = $routeParams;
		$scope.hakwonObj = {};

		/*	파일 업로드 초기화	*/
		$scope.$$postDigest(function(){
			$scope.checkAuthType = comm.checkAuthType;

			/*	학원소개 정보조회	*/
			$scope.getHakwonIntroDetail();
		});

		/*	학원소개 상세정보 조회	*/
		$scope.getHakwonIntroDetail = function() {
			if (isNull($routeParams.hakwon_no)) {
				alert('학원 번호가 올바르지 않습니다.');
				return ;
			}
			CommUtil.ajax({url:contextPath+"/hakwon/hakwonIntroDetail.do", param:{hakwon_no:$routeParams.hakwon_no}, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData ) {
						$scope.hakwonObj		= colData.content;
					} else {
						commProto.logger({hakwonIntroDetailError:data});
					}

					/*	video html replace	*/
					$scope.$$postDigest(comm.videoTagReplace);
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		$scope.getFileFullPath = function() {
			return CommUtil.createFileFullPath($scope.hakwonObj.logo_file_path, 'hakwon');
		};

		$scope.getAllAddrText = function() {
			return hakwonService.createAllAddrText($scope.hakwonObj);
		};

		$scope.goEditIntro = function() {
			CommUtil.locationHref(PageUrl.common.hakwonIntroEdit, {}, 'hakwon');
		};

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학원소개 작성-수정 컨트롤러
 */
hakwonMainApp.controller('hakwonIntroEditController', function($scope, $location, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonIntroEditController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		$scope.urlParams = $routeParams;

		/*	is Mobile	*/
		$scope.isMobile = isMobile.any();

		/*	학원소개정보 조회 값	*/
		$scope.hakwonObj		= {};
		$scope.fileList			= [];

		/*	지도 삽입	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=mapInsert]', function() {
			var mapHtml = $('#mainNgView').find('input[name=mapHtml]').val();
			var $mapHtml = $(mapHtml).css('margin', '10px auto').attr('data-type', 'frameMap');
			$('#mainNgView').find('input[name=mapHtml]').val('');
			tinymce.activeEditor.insertContent($mapHtml.prop('outerHTML'));
			tinymce.activeEditor.insertContent('<p><br />&nbsp;</p>');
			tinymce.activeEditor.focus();
		});
		$('#mainNgView').on(clickEvent, 'button[data-act=daumMapInsert]', function() {
			var mapHtml = $('#mainNgView').find('input[name=daumMapHtml]').val();
			mapHtml = mapHtml.replace(/<span(.*)<\/span>/g, "");
			$('body').append('<div style="display:none;" id="temp_map_div">'+mapHtml+'</div>');
			$('#temp_map_div').find('img').addClass('map_img').removeAttr('width').removeAttr('height');

			var mapDataHtml = $('#temp_map_div').find('div:eq(1)').html();
			$('#temp_map_div').remove();

			tinymce.activeEditor.insertContent(mapDataHtml);
			tinymce.activeEditor.insertContent('<p><br />&nbsp;</p>');
			tinymce.activeEditor.focus();
		});

		/*	youtube 삽입	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=youtubeInsert]', function() {
			var youtubeID = $('#mainNgView').find('input[name=youtubeID]').val();

			var youtubeHtml = '<a href="http://www.youtube.com/watch?v='+youtubeID+'" target="_blank"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+youtubeID+'" /></a>';
			tinymce.activeEditor.insertContent(youtubeHtml);
			tinymce.activeEditor.insertContent('<p><br />&nbsp;</p>');
			tinymce.activeEditor.focus();
		});

		/*	파일 업로드 초기화	*/
		$scope.$$postDigest(function(){
			console.log('eventWriteController $$postDigest call');

			/*	파일 업로드 객체 생성		*/
			if( comm.isAndroidUploader() ) {
				angular.element("input[data-act=file_upload]").click(function() {
					delete window.uploadCallBack;
					window.uploadCallBack = function(uploadJsonStr) {
						try {
							var resultObj = JSON.parse(uploadJsonStr);
							if( resultObj.error ) {
								alert('파일 업로드를 실패 했습니다.');
							} else {
								var fileInfo = resultObj.colData;
								var tempObj = {};
								tempObj.file_no		= fileInfo.fileNo;
								tempObj.file_name	= fileInfo.fileName;
								tempObj.file_path	= fileInfo.filePath;
								tempObj.image_yn	= fileInfo.imageYn;

								$scope.fileList.push(tempObj);
								$scope.$digest();
							}
						} catch(e) {
							alert('파일 업로드를 실패 했습니다.');
						}
					};
					var param = {
						fileType : 'all'
						, multipleYn : 'Y'
						, callBack : 'uploadCallBack'
						, upload : {
							url : window.location.protocol+'//'+window.location.host+uploadUrl
							, param : {uploadType:CommonConstant.File.TYPE_INTRODUCTION}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				$scope.fileUploadObj = angular.element("input[data-act=file_upload]").html5_upload(hakwonService.getFileUploadOptions($scope));
			}

			/*	학원소개 정보조회	*/
			$scope.getHakwonIntroDetail();
		});

		/*	학원소개 상세정보 조회	*/
		$scope.getHakwonIntroDetail = function() {
			if (isNull($routeParams.hakwon_no)) {
				alert('학원 번호가 올바르지 않습니다.');
				return ;
			}
			CommUtil.ajax({url:contextPath+"/hakwon/hakwonIntroDetail.do", param:{hakwon_no:$routeParams.hakwon_no}, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData ) {
						$scope.hakwonObj		= colData.content;
						$scope.fileList			= colData.fileList;

						/*	에디터 초기화 완료 후 value 셋팅	*/
						var editOptions = comm.getEditorOptions();
						editOptions.setup = function(ed) {
							ed.on("init", function(ed) {
								if (!_.isUndefined(colData.content.introduction) && colData.content.introduction) {
									tinymce.activeEditor.setContent(colData.content.introduction);
								} else {
									tinymce.activeEditor.setContent(' ');
								}
							}).on('KeyDown', function(e) {
								var thisEditor = this;
								var keyCode = undefined;
								if (e.keyCode) keyCode = e.keyCode;
								else if (e.which) keyCode = e.which;

								if(keyCode == 9 && !e.altKey && !e.ctrlKey) {
									if (e.shiftKey) {
										thisEditor.execCommand('Outdent');
									} else {
										thisEditor.execCommand('Indent');
									}

									return tinymce.dom.Event.cancel(e);
								}

							});
						};
						tinymce.init(editOptions);
					} else {
						commProto.logger({hakwonDetailError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		$scope.confirmEdit = function() {
			if (isNull($routeParams.hakwon_no)) {
				alert('학원 번호가 올바르지 않습니다.');
				return ;
			}

			var fileNoList = _.pluck($scope.fileList, 'file_no');

			var editContent = tinymce.activeEditor.getContent();
			editContent = editContent.replace(/><\/div>/g, ">&nbsp;</div>");
			editContent = editContent.replace(/><\/p>/g, ">&nbsp;</p>");

			var params = {
				hakwon_no			: $routeParams.hakwon_no,
				introduction		: editContent,
				file_no_list		: fileNoList.toString()
			};

			CommUtil.ajax({url:contextPath+"/hakwon/master/editHakwonIntro.do", param:params, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						alert('학원소개가 수정되었습니다.');
						CommUtil.locationHref(PageUrl.common.hakwonIntro, {}, 'hakwon');
					} else {
						alert('학원소개가 수정을 실패하였습니다. 다시 시도해 주시기 바랍니다.');
						commProto.logger({editHakwonIntroError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/*	학원 미리보기	*/
		$scope.previewIntro = hakwonService.previewIntro;

		$scope.getLogoFullPath = function() {
			return CommUtil.createFileFullPath($scope.hakwonObj.logo_file_path, 'hakwon');
		};

		$scope.getAttachFileFullPath = function(filePath, fileType) {
			if( !fileType ) fileType = 'attachment';
			return CommUtil.createFileFullPath(filePath, fileType);
		};

		$scope.getAllAddrText = function() {
			return hakwonService.createAllAddrText($scope.hakwonObj);
		};

		$scope.cancelEdit = function() {
			CommUtil.locationHref(PageUrl.common.hakwonIntro, {}, 'hakwon');
			return false;
		};

		$scope.checkMaxFileCnt = function(e) {
			if ($scope.fileList.length >= 10) {
				alert('첨부파일은 10개까지만 등록이 가능합니다.');
				e.preventDefault();
				return false;
			}
		};

		/*	이미지 클릭시 에디터에 이미지 첨부	*/
		$scope.insertImageToEditor = function(filePath, fileNo) {
			var fullFilePath = $scope.getAttachFileFullPath(filePath);
			var strImage = '<a href="'+ fullFilePath + '" target="_blank"><img src="'+ fullFilePath + '" data-img-no="'+fileNo+'" class="img-responsive"></a>';
			tinymce.activeEditor.insertContent(strImage);
			tinymce.activeEditor.insertContent('<p><br />&nbsp;</p>');
			tinymce.activeEditor.focus();
		};

		/*	첨부 파일 삭제 처리	*/
		$scope.removeAttachFile = function(fileNo) {
			$scope.fileList = _.filter($scope.fileList, function(item) {
				return item.file_no != fileNo;
			});
		};

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학원정보 수정 컨트롤러
 */
hakwonMainApp.controller('hakwonModifyController', function($scope, $location, $log, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonModifyController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		$("#wrapper").show();

		$scope.urlParams = $routeParams;
		$scope.hakwonObj = {};
		$scope.hawonCategories = [];

		/* 초기화 */
		$scope.$$postDigest(function(){
			console.log('hakwonModifyController $$postDigest call');

			$scope.getHakwonDetail();
			$scope.getHakwonCategories();
		});

		$scope.getHakwonDetail = function() {
			if (isNull($routeParams.hakwon_no)) {
				alert('학원 번호가 올바르지 않습니다.');
				return ;
			}
			CommUtil.ajax({url:contextPath+"/hakwon/hakwonDetail.do", param:{hakwon_no:$routeParams.hakwon_no}, successFun:function(data) {
				try {
					var colData = data.colData;
					if( colData ) {
						$scope.hakwonObj = colData.content;
					} else {
						commProto.logger({hakwonDetailError:data});
					}
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/**
		 * 학원 카테고리 리스트
		 */
		$scope.getHakwonCategories = function() {
			CommUtil.ajax({url:contextPath+"/hakwon/cateList.do", successFun:function(data) {
				try {
					$scope.hawonCategories = data.colData.dataList;
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			}});
		};

		/**
		 * 취소하기
		 */
		$scope.cancelModify = function() {
			CommUtil.locationHref(PageUrl.main, {}, 'hakwon');
			return false;
		};

		/**
		 * 학원정보 수정
		 */
		$scope.confirmModify = function() {
			hakwonService.hakwonEdit($scope);
		};

		$scope.totalItems = 64;
		$scope.currentPage = 4;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		$scope.pageChanged = function() {
			$log.log('Page changed to: ' + $scope.currentPage);
		};

		$scope.maxSize = 5;
		$scope.bigTotalItems = 175;
		$scope.bigCurrentPage = 1;

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

			$scope.hakwonObj.addr_no = addrNo;
			$scope.hakwonObj.old_addr1 = addr1;

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

			$scope.hakwonObj.street_addr1 = addr1;

			$('#mainNgView ul[data-view=streetAddrList]').hide();
			$('#mainNgView').find('li[data-act=streetAddrLI]').remove();
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 학원등록 컨트롤러
 */
hakwonMainApp.controller('hakwonCreateController', function($scope, $location, $log, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonCreateController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'학원 추가 등록'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 학원 카테고리 리스트
		 */
		CommUtil.ajax({url:contextPath+"/hakwon/cateList.do", successFun:function(data) {
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

		$("#wrapper").show();

		$scope.$$postDigest(function(){
			console.log('hakwonViewController $viewContentLoaded call');

			// 파일 업로드 객체 생성
			if( comm.isAndroidUploader() ) {
				angular.element("input[data-act=photo_upload]").click(function() {
					delete window.uploadCallBack;
					window.uploadCallBack = function(uploadJsonStr) {
						try {
							var resultObj = JSON.parse(uploadJsonStr);
							if( resultObj.error ) {
								alert('파일 업로드를 실패 했습니다.');
							} else {
								var fileInfo = resultObj.colData;
								if (fileInfo.imageYn == 'Y') {
									$('div[data-view=image_preveiw] > img').remove();
									$('div[data-view=image_preveiw]').prepend('<img alt="image" width="200" src="'+HakwonConstant.FileServer.ATTATCH_DOMAIN+fileInfo.filePath+'" data-file-no="'+fileInfo.fileNo+'">');
								} else {
									alert('이미지 파일이 아닙니다.');
								}
							}
						} catch(e) {
							alert('파일 업로드를 실패 했습니다.');
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
				$("input[data-act=photo_upload]").html5_upload(hakwonService.getLogoUploadOptions());
			}
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/**
 * 학원 전체 리스트 컨트롤러
 */
hakwonMainApp.controller('hakwonAllListController', function($scope, $location, $log, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonAllListController call');

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:'#', title:'학원 전체 리스트'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/**
		 * 학원 전체 리스트
		 */
		CommUtil.ajax({url:contextPath+"/hakwon/master/hakwonAllList.do", successFun:function(data) {
			try {
				$scope.hakwonAllList = data.colData.dataList;
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});

		$("#wrapper").show();

		$scope.$$postDigest(function(){
			console.log('hakwonViewController $viewContentLoaded call');
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});