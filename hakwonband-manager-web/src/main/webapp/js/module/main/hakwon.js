/**
 * 학원 서비스
 */
hakwonMainApp.service('hakwonService', function($http, CommUtil) {
	console.log('hakwonMainApp hakwonService call', CommUtil);

	var hakwonService = {};

	/**
	 * 학원 상세 조회
	 */
	hakwonService.hakwonDetail = function(hakwonNo, callBack) {
		var param = {
			hakwonNo : hakwonNo
		};
		CommUtil.ajax({url:contextPath+'/manager/hakwon/detail.do', param:param, successFun:function(data) {
			callBack(data);
		}});
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
			url: contextPath+"/manager/hakwon/list.do",
			type: "post",
			data: $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;

					var $viewDiv = $('#mainNgView div[data-view=data-div]');
					var $dataTableBody = $viewDiv.find('table > tbody');

					if( colData.hakwonList && colData.hakwonList.length > 0 ) {

						var showMonthList = colData.showMonthList;
						var hakwonList = colData.hakwonList;
						for(var i=0; i<hakwonList.length; i++) {
							var loopHakwon = hakwonList[i];

							var ad_cal_val = loopHakwon.ad_cal_val;

							var monthValArray = [];
							if( ad_cal_val ) {
								monthValArray = ad_cal_val.split(',');
							}
							console.log('monthValArray : ' + monthValArray);

							for(var j=0; j<showMonthList.length; j++) {
								var tempViewMonth = showMonthList[j];
								var viewData = undefined;
								for(var k=0; k<monthValArray.length; k++) {
									var loopMonthVal = monthValArray[k];

									if( loopMonthVal.indexOf('|'+tempViewMonth) > 0 ) {
										/*	있다.	*/
										viewData = loopMonthVal.split('|')[0];
									}
								}
								if( !viewData ) {
									viewData = '0';
								}
								loopHakwon['viewMonth0'+j] = commProto.numberWithCommas(viewData);
							}
							hakwonList[i] = loopHakwon;
						}
						colData.hakwonList = hakwonList;

						$dataTableBody.html($.tmpl(hakwonTmpl.hakwon.listRow, colData));
					} else {
						$dataTableBody.html($.tmpl(hakwonTmpl.hakwon.listNoData));
					}

					var totalPages = comm.pageCalc(colData.hakwonCount, colData.pageScale);
					$('#mainNgView div[data-view=pagination]').bootpag({
						total: totalPages,
						page: pageNo,
						maxVisible: DefaultInfo.pageScale,
						leaps: true
					}).on("page", function(event, page){
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
	 * 학원 소개 수정 폼
	 */
	hakwonService.introUpdateForm = function(hakwonNo) {
		var param = {hakwonNo:hakwonNo};
		$.ajax({
			url: contextPath+"/manager/hakwon/introDetail.do",
			type: "post",
			data: $.param(param, true),
			dataType: "json",
			success: function(data) {
				try {
					var colData = data.colData;

					$('div[data-view=data-view]').html($.tmpl(hakwonTmpl.hakwon.hakwonIntroUpdate, colData));

					/*	에디터 초기화 완료 후 value 셋팅	*/
					var editOptions = comm.getEditorOptions();
					editOptions.setup = function(ed) {
						ed.on("init", function(ed) {
							if (!_.isUndefined(colData.hakwonInfo.introduction) && colData.hakwonInfo.introduction) {
								tinymce.activeEditor.setContent(colData.hakwonInfo.introduction);
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


					/*	파일 업로드 셋팅	*/
					if( comm.isAndroidUploader() ) {
						$("input[data-act=file_upload]").click(function() {
							delete window.uploadCallBack;
							window.uploadCallBack = function(uploadJsonStr) {
								try {
									var resultObj = JSON.parse(uploadJsonStr);
									if( resultObj.error ) {
										alert('파일 업로드를 실패 했습니다.');
									} else {
										var fileInfo = resultObj.colData;
										$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.messageView.attchFile, {fileInfo:fileInfo}))
									}
								} catch(e) {
									alert('파일 업로드를 실패 했습니다.');
								}
							};
							var param = {
								fileType : 'all'
								, multipleYn : 'N'
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
						var messageUploadOptions = new UploadOptions();
						messageUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_INTRODUCTION};
						messageUploadOptions.onFinish = function(event, total) {
							if (this.errorFileArray.length + this.errorCount > 0) {
								alert('파일 업로드를 실패 했습니다.');
							} else {
								for (var i = 0; i < this.uploadFileArray.length; i++) {
									var fileInfo = this.uploadFileArray[i];

									$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.messageView.attchFile, {fileInfo:fileInfo}))
								}
							}
						};

						$("input[data-act=file_upload]").html5_upload(messageUploadOptions);
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
	 * 학원 소개 수정 저장
	 */
	hakwonService.introUpdateSave = function(hakwonNo) {
		var editContent = tinymce.activeEditor.getContent();
		editContent = editContent.replace(/><\/div>/g, ">&nbsp;</div>");
		editContent = editContent.replace(/><\/p>/g, ">&nbsp;</p>");

		var params = {
			hakwon_no			: hakwonNo,
			introduction		: editContent,
		};
		/*	파일 리스트	*/
		var fileList = new Array();
		$('div.file-box').each(function(idx, obj) {
			var fileNo = $(obj).attr('data-file-no');
			fileList.push(fileNo);
		});
		params.fileList = fileList.toString();

		console.log(params);

		CommUtil.ajax({url:contextPath+"/manager/hakwon/editHakwonIntro.do", param:params, successFun:function(data) {
			try {
				if( data.error ) {
					alert('학원 소개 수정을 실패 했습니다.');
				} else {
					var colData = data.colData;
					if( colData.result == CommonConstant.Flag.success ) {
						alert('학원소개가 수정되었습니다.');
						window.location = '#/hakwon/detail?hakwon_no='+hakwonNo;
					} else {
						alert('학원소개가 수정을 실패하였습니다. 다시 시도해 주시기 바랍니다.');
						commProto.logger({editHakwonIntroError:data});
					}
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};

	/**
	 * 학원 소개 미리보기
	 */
	hakwonService.previewIntro = function(hakwon_no) {
		var editContent = tinymce.activeEditor.getContent();
		editContent = editContent.replace(/><\/div>/g, ">&nbsp;</div>");
		editContent = editContent.replace(/><\/p>/g, ">&nbsp;</p>");

		var params = {
			hakwon_no			: hakwon_no
			, introduction		: editContent
		};

		$.ajax({
			url: contextPath+"/manager/hakwon/previewIntro.do",
			type: "post",
			data: $.param(params, true),
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
 * 리스트
 */
hakwonMainApp.controller('hakwonListController', function($scope, $location, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonListController call', $scope, $location, $routeParams, hakwonService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#', title:'학원 리스트'}]);

		/**
		 * 학원 카테고리 리스트
		 */
		CommUtil.ajax({url:contextPath+"/manager/hakwon/cateList.do", successFun:function(data) {
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

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 상세
 */
hakwonMainApp.controller('hakwonDetailController', function($scope, $location, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonDetailController call', $scope, $location, $routeParams, hakwonService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#', title:'학원 상세'}]);


		/*	화면 로드 후	*/
		$scope.$on('$viewContentLoaded', function() {
			console.log('hakwonDetailController $viewContentLoaded');
		});

		/*	목록 이동	*/
		$scope.list = function() {
			//commProto.hrefMove();
			window.location = PageUrl.hakwon.list;
		};

		$("#wrapper").show();

		var hakwonNo = $routeParams.hakwon_no;
		if( !hakwonNo ) {
			alert('학원 번호가 잘못됐습니다.');
			window.history.back();
			return ;
		}

		/*	소개 수정	*/
		$scope.introUpdate = function() {
			window.location = '#/hakwon/introUpdate?hakwon_no='+hakwonNo;
		};

		hakwonService.hakwonDetail(hakwonNo, function(data) {
			try {
				if( data.error ) {
					alert('학원 정보 조회를 실패 했습니다.');
					return ;
				} else {
					$scope.hakwonInfo = data.colData.hakwonInfo;
				}
				var show6MonthList = data.colData.show6MonthList;
				var sixMonthAmountList = data.colData.sixMonthAmountList;
				var dataArray = [];
				var dataJsonObj = {};
				if( sixMonthAmountList && sixMonthAmountList.length > 0 ) {
					for(var i=0; i<sixMonthAmountList.length; i++) {
						var tempObj = sixMonthAmountList[i];
						dataJsonObj[tempObj.year_month_val] = tempObj.amount;
					}
				}
				for(var i=0; i<show6MonthList.length; i++) {
					var viewMonth = show6MonthList[i];
					if( dataJsonObj[viewMonth] ) {
						dataArray.push(dataJsonObj[viewMonth]);
					} else {
						dataArray.push(0);
					}
				}

				$scope.$$postDigest(function() {
					var randomScalingFactor = function(){ return Math.round(Math.random()*100)};

					var barChartData = {
						labels : show6MonthList,
						datasets : [
							{
								fillColor : "rgba(220,220,220,0.5)",
								strokeColor : "rgba(220,220,220,0.8)",
								highlightFill: "rgba(220,220,220,0.75)",
								highlightStroke: "rgba(220,220,220,1)",
								data : dataArray
							}
						]
					};
					var ctx = document.getElementById("canvas").getContext("2d");
					window.myBar = new Chart(ctx).Bar(barChartData, {
						responsive : true
					});
				});
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 학원 소개 수정
 */
hakwonMainApp.controller('hakwonIntroUpdateController', function($scope, $location, $routeParams, hakwonService, CommUtil) {
	console.log('hakwonMainApp hakwonIntroUpdateController call', $scope, $location, $routeParams, hakwonService, CommUtil);
	try {

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'학원'}, {url:'#/hakwon/list', title:'학원 리스트'}, {url:'#', title:'학원 소개'}]);

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		/*	학원 번호	*/
		var currentHakwonNo = $routeParams.hakwon_no;

		/*	취소	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=introUpdateCancel]', function() {
			commProto.hrefMove('#/hakwon/detail/introduce?hakwon_no='+currentHakwonNo);
		});

		/*	미리보기	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=introUpdatePreview]', function() {
			hakwonService.previewIntro(currentHakwonNo);
		});
		/*	저장	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=introUpdateSave]', function() {
			hakwonService.introUpdateSave(currentHakwonNo);
		});

		/*	파일 삭제	*/
		$('#mainNgView').on(clickEvent, 'button.btn_file_del', function() {
			$(this).parents('div.file-box').remove();
		});


		/*	지도 삽입	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=mapInsert]', function() {
			var mapHtml = $('#mainNgView').find('input[name=mapHtml]').val();
			var $mapHtml = $(mapHtml).css('margin', '10px auto').attr('data-type', 'frameMap');
			console.log($mapHtml.prop('outerHTML'));
			$('#mainNgView').find('input[name=mapHtml]').val('');
			tinymce.activeEditor.insertContent($mapHtml.prop('outerHTML'));
		});
		$('#mainNgView').on(clickEvent, 'button[data-act=daumMapInsert]', function() {
			var mapHtml = $('#mainNgView').find('input[name=daumMapHtml]').val();
			mapHtml = mapHtml.replace(/<span(.*)<\/span>/g, "");
			$('body').append('<div style="display:none;" id="temp_map_div">'+mapHtml+'</div>');
			$('#temp_map_div').find('img').addClass('map_img').removeAttr('width').removeAttr('height');

			var mapDataHtml = $('#temp_map_div').find('div:eq(1)').html();
			$('#temp_map_div').remove();

			tinymce.activeEditor.insertContent(mapDataHtml);
		});

		/*	youtube 삽입	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=youtubeInsert]', function() {
			var youtubeID = $('#mainNgView').find('input[name=youtubeID]').val();

			var youtubeHtml = '<a href="http://www.youtube.com/watch?v='+youtubeID+'" target="_blank"><img src="http://img.youtube.com/vi/'+youtubeID+'/0.jpg" class="img-responsive" alt="" data-video="youtube" data-id="'+youtubeID+'" /></a>';
			tinymce.activeEditor.insertContent(youtubeHtml);
		});

		/*	첨부 이미지 추가	*/
		$('#mainNgView').on(clickEvent, 'div.file-box > div.file > div.image', function() {
			var imgSrc = $(this).find('img').attr('src');
			tinymce.activeEditor.insertContent('<img src="'+imgSrc+'" class="img-responsive">');
		});



		$("#wrapper").show();
		$scope.$$postDigest(function(){
			console.log('hakwonDetailIntroduceController $$postDigest call');
			/*	학원 소개 수정 폼	*/
			hakwonService.introUpdateForm(currentHakwonNo);
		});
	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});