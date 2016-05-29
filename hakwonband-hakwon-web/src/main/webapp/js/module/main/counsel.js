hakwonMainApp.service('counselService', function(CommUtil) {
	var counselService = {};

	/**
	 * 첨부파일 업로드 옵션 생성
	 */
	counselService.getFileUploadOptions = function($scope) {
		//TODO : 파일 업로드 타입 설정.
		//var uploadTypeObj = {uploadType:CommonConstant.File.TYPE_EVENT};
		var uploadTypeObj = {uploadType:'005'};	// 상담 파일 타입

		// 파일 업로드 객체 생성
		var fileUploadOptions = new UploadOptions();
		fileUploadOptions.customExtraFields = uploadTypeObj;
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

				$('div.attachment').append($.tmpl(hakwonTmpl.event.attachFile, {fileList:this.uploadFileArray}));
			}
		};
		return fileUploadOptions;
	};


	/*	상담자 검색	*/
	counselService.searchCounselee = function($scope) {
		var $counselParam = $('div.counselInsert');

		var hakwonNo = hakwonInfo.hakwon_no;
		var counseleeName = $counselParam.find('input[name=counseleeName]').val();

		if( isNull(counseleeName) ) {
			alert('이름을 입력해 주세요.');
			$counselParam.find('input[name=counseleeName]').focus();
			return;
		}

		var params = {hakwonNo:hakwonNo, counseleeName:counseleeName};
		$scope.counseleeList = [];
		CommUtil.ajax({url:contextPath+"/hakwon/counsel/counselee/select.do", param:params, successFun:function(data) {
			if( data.error ) {
				alert('조회에 실패했습니다.');
				return false;
			}
			var counseleeList = data.colData.counseleeList;
			if(counseleeList && counseleeList.length > 0) {
				$scope.counseleeList = counseleeList;
			} else {
				alert("검색 결과가 없습니다.");
			}
		}});

	};


	/*	상담 등록	*/
	counselService.insertCounsel = function($scope, $window) {
		var $counselParam = $('div.counselInsert');

		var hakwonNo = hakwonInfo.hakwon_no;
		var counseleeNo = $counselParam.find('input[name=counseleeNo]').val();
		var counselDate = $scope.counselDate.yyyymmdd('-');
		var title = $counselParam.find('input[name=title]').val();
		var content = $counselParam.find('textarea[name=content]').val();

		if( isNull(counseleeNo) ) {
			alert('상담자를 검색해주세요.');
			$counselParam.find('input[name=counseleeNo]').focus();
			return;
		}
		if( isNull(counselDate) ) {
			alert('상담 날짜를 입력해 주세요.');
			$counselParam.find('input[name=counselDate]').focus();
			return;
		}
//		if( isNull(title)) {
//			alert('제목을 입력해주세요.');
//			$counselParam.find('input[name=title]').focus();
//			return;
//		}
		if( isNull(content)) {
			alert('내용을 입력해주세요.');
			$counselParam.find('input[name=content]').focus();
			return;
		}

		$('div.file-box').each(function() {
			var fileNo = $(this).attr('data-file-no');
			$scope.fileNoArr.push(fileNo);
		});


		var params = {
			hakwonNo:hakwonNo, counseleeNo:counseleeNo, counselDate:counselDate, title:title
			, content:content, fileNoArr:$scope.fileNoArr
		};

		CommUtil.ajax({url:contextPath+"/hakwon/counsel/insert.do", param:params, successFun:function(data) {
			$scope.fileNoArr = [];		// fileNoArr 초기화
			if( data.error ) {
				alert('실패하였습니다.');
				return false;
			}
			var flag = data.colData.flag;
			if("success" == flag) {
				$scope.counselee_name = '';
				$scope.counselee_id = '';
				$scope.counselee_no = '';
				$scope.counseleeList = [];

				$counselParam.find('input[name=counseleeName]').val('');
				$counselParam.find('textarea[name=content]').val('');

				alert('상담 등록 완료');
				$('input[name=counseleeName]').focus();
/*
				if(confirm("등록되었습니다. 이어서 등록 하시겠습니까?")) {
					//$("div.receiptInsert input").reset();

					//$window.location.href = PageUrl.receipt.insert + '?hakwonNo=' + hakwonInfo.hakwon_no;
				} else {
					//$window.location.href = PageUrl.receipt.list+'?hakwon_no=' + hakwonInfo.hakwon_no;
				}
*/
			} else {
				alert("실패하였습니다.");
			}
		}});

	};

	/*	상담 수정	*/
	counselService.updateCounsel = function($scope, $window) {
		var $counselParam = $('div.counselInsert');

		var hakwonNo = hakwonInfo.hakwon_no;
		var counseleeNo = $counselParam.find('input[name=counseleeNo]').val();
		//var counselDate = $counselParam.find('input[name=counselDate]').val();
		var counselDate = $scope.counselDate.yyyymmdd('-');
		var title = $counselParam.find('input[name=title]').val();
		var content = $counselParam.find('textarea[name=content]').val();

		if( isNull(counseleeNo) ) {
			alert('상담자를 검색해주세요.');
			$counselParam.find('input[name=counseleeNo]').focus();
			return;
		}
		if( isNull(counselDate) ) {
			alert('상담 날짜를 입력해 주세요.');
			$counselParam.find('input[name=counselDate]').focus();
			return;
		}
		if( isNull(content)) {
			alert('내용을 입력해주세요.');
			$counselParam.find('input[name=content]').focus();
			return;
		}

		var params = {
			hakwonNo		: hakwonNo
			, counselNo		: $scope.counselNo
			, counseleeNo	: counseleeNo
			, counselDate	: counselDate
			, content		: content
		};

		CommUtil.ajax({url:contextPath+"/hakwon/counsel/update.do", param:params, successFun:function(data) {
			if( data.error ) {
				alert('실패하였습니다.');
				return false;
			}
			var flag = data.colData.flag;
			if("success" == flag) {
				alert("상담 수정 완료");
				$window.location.href = PageUrl.counsel.list + '?hakwon_no=' + hakwonInfo.hakwon_no + '&type='+$scope.counselType;
			} else {
				alert("상담 수정을 실패하였습니다.");
			}
		}});
	};

	/*	상담 삭제	*/
	counselService.deleteReceipt = function($scope, $window) {
		if( confirm("상담을 삭제 하겠습니까?") == false ) {
			return ;
		}
		var params = {
			counselNo : $scope.counselNo
		};
		CommUtil.ajax({url:contextPath+"/hakwon/counsel/delete.do", param:params, successFun:function(data) {
			if( data.error ) {
				alert('실패하였습니다.');
				return false;
			}
			var flag = data.colData.flag;
			if("success" == flag) {
				$window.location.href = PageUrl.counsel.list + '?hakwon_no=' + hakwonInfo.hakwon_no + '&type='+$scope.counselType;
			} else {
				alert("상담 삭제를 실패하였습니다.");
			}
		}});
	}


	/*	상담 리스트 조회	*/
	counselService.getCounselList = function($scope) {

		var $counselParam	= $('div.counselList');
		var hakwonNo		= hakwonInfo.hakwon_no;
		var classNo			= $counselParam.find('select[name=classNo]').val();
		var searchType		= $counselParam.find('select[name=searchType]').val();
		var searchText		= $counselParam.find('input[name=searchText]').val();
		var startDate		= $counselParam.find('input[name=startDate]').val();
		var endDate			= $counselParam.find('input[name=endDate]').val();
		var pageScale		= $counselParam.find('input[name=pageScale]').val();
		var counseleeType	= $scope.counselType;

		var dateTerm = $scope.dateTerm;

		var params = {
			hakwonNo		: hakwonNo
			, pageNo		: $scope.pageNo
			, searchType	: searchType
			, searchText	: searchText
			, startDate		: startDate
			, endDate		: endDate
			, classNo		: classNo
			, counseleeType	: counseleeType
			, dateTerm		: dateTerm
			, pageScale		: pageScale
		};
		CommUtil.ajax({url:contextPath+"/hakwon/counsel/list.do", param: params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					$scope.startDate	= colData.startDate;
					$scope.endDate		= colData.endDate;

					if( colData.counselList && colData.counselList.length > 0 ) {
						for(var i=0; i<colData.counselList.length; i++) {
							var loopData = colData.counselList[i];
							loopData.counsel_content = loopData.counsel_content.replace(/(?:\r\n|\r|\n)/g, '<br />');

							colData.counselList[i] = loopData;
						}
						$scope.counselList			= colData.counselList;
					} else {
						$scope.counselList			= [];
					}
					$scope.counselListTotCount	= colData.counselCount;
					var pageHtml = generatePage(colData.pageNo, colData.counselCount, colData.pageScale, 5);
					$("#eg-custom-paging").html(pageHtml);
				} else {
					alert("조회에 실패했습니다.")
					commProto.logger({hakwonNoticeListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};


	/*	반 리스트 조회	*/
	counselService.getClassList = function($scope) {

		var hakwonNo = hakwonInfo.hakwon_no;

		var params = {hakwonNo:hakwonNo};
		CommUtil.ajax({url:contextPath+"/hakwon/receipt/class/list.do", param: params, successFun:function(data) {
			try {
				var colData = data.colData;
				if( colData ) {
					$scope.classList			= colData.classList;
				} else {
					commProto.logger({hakwonNoticeListError:data});
				}
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}
		}});
	};


	/*	상담 상세 조회	*/
	counselService.getCounselDetail = function($scope) {
		var $counselParam = $('div.counselDetail');

		var hakwonNo = hakwonInfo.hakwon_no;
		var counseleeName = $counselParam.find('input[name=counseleeName]').val();

		var params = {hakwonNo:hakwonNo, counselNo:$scope.counselNo};
		CommUtil.ajax({url:contextPath+"/hakwon/counsel/view.do", param:params, successFun:function(data) {
			if( data.error ) {
				alert('조회에 실패했습니다.');
				return false;
			}
			var counsel = data.colData;
			if(counsel) {
				$scope.counselNo		= counsel.counsel_no;
				$scope.counseleeNo		= counsel.counselee_no;
				$scope.counseleeName	= counsel.counselee_name;
				$scope.counseleeId		= counsel.counselee_id;
				$scope.counselTitle		= counsel.counsel_title;
				$scope.counselContent	= counsel.counsel_content;
				//$scope.counselDate		= counsel.counsel_date;
				$scope.counselDate		= Date.parse(counsel.counsel_date);
				$scope.regDate			= counsel.reg_date;
				$scope.counsellorName	= counsel.counsellor_name;
				$scope.counsellorPhoto	= counsel.counsellor_photo;
				$scope.counseleeType	= counsel.counselee_type;
				if(counsel.counselee_type == "006") {
					$scope.familyType = "부모정보";
				} else {
					$scope.familyType = "자식정보";
				}

				$scope.familyMembers = counsel.familyMembers;
				$scope.fileList = counsel.fileList;
			} else {
				alert("검색 결과가 없습니다.");
			}
		}});
	}


	return counselService;
});


/**
 * 상담 등록 컨트롤러
 */
hakwonMainApp.controller('counselInsertController', function($scope, $location, $routeParams, $filter, $window, counselService, CommUtil) {
	try {

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.counsel.insert+'?hakwon_no='+hakwonInfo.hakwon_no, title:'상담'}, {url:'#', title:'상담 등록'}]);

		/*	데이터 초기화	*/
		$scope.fileNoArr = [];			// 업로드된 파일 리스트

		$scope.counseleeList = [];		// 검색된 상담자
		//$scope.counselDate = $filter('date')(new Date(), 'yyyy-MM-dd');
		$scope.counselDate = new Date();

		/*	상담자 이름 검색 데이터	*/
		$scope.searchOptions = {counselee_name: ""};

		$scope.getPhotoFileFullPath = function(photo_file_path) {
			return CommUtil.createFileFullPath(photo_file_path, 'photo');
		};

		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};

		/*	상담자 검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=counseleeSearch]', function() {
			counselService.searchCounselee($scope);
		});

		/*	상담자 검색 키처리	*/
		$scope.searchCounseleeEnter = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}
			counselService.searchCounselee($scope);
		};

		/*	상담자 선택	*/
		$('#mainNgView').on(clickEvent, 'div.counselInsert ul.find_counselee_result li', function() {
			$scope.counselee_no = $(this).attr("counselee-no");
			$scope.counselee_name = $(this).attr("counselee-name");
			$scope.counselee_id = $(this).attr("counselee-id");
			$scope.$apply();
		});


		/*	상담 등록	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=counselInsert]', function() {
			counselService.insertCounsel($scope, $window);
		});

		/*	상담 취소	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=counselInsertCancel]', function() {
			window.history.go(-1);
			return false;
		});


		$scope.$$postDigest(function(){
			try {

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
									//$('div.attachment').append($.tmpl(hakwonTmpl.event.attachFile, {fileList:[fileInfo]}));
									$scope.fileList.push(fileInfo);
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
								, param : {
									//uploadType : CommonConstant.File.TYPE_EVENT
									uploadType : '005'
									, hakwonNo : $scope.hakwonNo
									, classNo : $scope.classNo
								}
								, cookie : document.cookie
							}
						};
						window.PLATFORM.fileChooser(JSON.stringify(param));

						return false;
					});
				} else {
					$("input[data-act=file_upload]").html5_upload(counselService.getFileUploadOptions($scope));
				}

				/**
				 * 에디터 로드
				 * textarea에 data-lib="editor" 를 추가해줘야 한다.
				 */
/*
				setTimeout(function() {
					var editOptions = comm.getEditorOptions();
					editOptions.setup = function(ed) {
						ed.on("init", function(ed) {
							tinymce.activeEditor.setContent('');
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
				}, 500);
*/
			} catch(ex) {
				commProto.errorDump({errorObj:ex});
			}

			/**
			 * 에디터 내용 조회
			 * var contentHtml = tinymce.activeEditor.getContent();
			 *
			 * 에디터 내용 불러오기
			 * tinymce.activeEditor.setContent('불러올 데이타');
			 *
			 * 에디터에 이미지 삽입
			 * tinymce.activeEditor.insertContent('<img src="" data-img-no="이미지 번호 넣어 주세요.">');
			 */
		});


	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * 상담 리스트 컨트롤러
 */
hakwonMainApp.controller('counselListController', function($scope, $location, $window, $routeParams, counselService, CommUtil) {
	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.counsel.list+'?hakwon_no='+hakwonInfo.hakwon_no, title:'상담'}, {url:'#', title:'상담 리스트'}]);

		$scope.classList 			= [];
		$scope.counselList 			= [];
		$scope.counselListTotCount	= 0;
		$scope.pageNo = 1;
		$scope.counselType = $routeParams.type;

		if("005" == $scope.counselType) {
			$scope.counselTitle = "학부모 상담";
		} else {
			$scope.counselTitle = "학생 상담";
		}

		/*	학윈 리스트 조회	*/
		counselService.getClassList($scope);

		/*	상담 리스트 조회	*/
		counselService.getCounselList($scope);

		$scope.getPhotoFileFullPath = function(photo_file_path) {
			return CommUtil.createFileFullPath(photo_file_path, 'photo');
		};

		$scope.getUserGender = function(gender) {
			return CommUtil.createGenderName(gender);
		};

		/*	상담 검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=counselSearch]', function() {
			counselService.getCounselList($scope);
		});

		/*	상담 검색 키처리	*/
		$scope.searchCounselEnter = function(e) {
			if (e && e.type === 'keydown' && e.keyCode !== 13) {
				return;
			}
			var searchText = $('div.counselList input[name=searchText]').val();
			if(isNull(searchText)) {
				alert("검색 할 내용이 없습니다.");
				return;
			}
			counselService.getCounselList($scope);
		};

		/*	기간 검색 버튼	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=searchTerm]', function() {
			$scope.dateTerm = $(this).attr("data-value");
			counselService.getCounselList($scope);
		});

		/*	페이지 선택	*/
		$("#eg-custom-paging").off("click", "button").on("click", "button", function(e) {
			$scope.pageNo = $(this).attr("current-page");
			counselService.getCounselList($scope);

		});

		$scope.modifyView = function(counsel_no) {
			$window.location.href = PageUrl.counsel.update + '?hakwon_no=' + hakwonInfo.hakwon_no + '&counsel_no=' + counsel_no + '&counselType='+$scope.counselType;
		};

		$scope.content_view = function(counsel_no) {
			$('div[data-view=counsel_content]').each(function(idx) {
				var item = this;
				if( $(item).data('id') == counsel_no ) {
					$(item).css('height', 'auto');
				} else {
					$(item).css('height', '1em');
				}
			});
		}

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});



/*	상담 상세보기	*/
hakwonMainApp.controller('counselDetailController', function($scope, $location, $window, $routeParams, counselService, CommUtil) {
	try {

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.counsel.detail+'?hakwon_no='+hakwonInfo.hakwon_no, title:'상담'}, {url:'#', title:'상담 상세'}]);

		$scope.counselNo = $routeParams.counsel_no;
		$scope.counseleeNo = "";
		$scope.counseleeName = "";
		$scope.counseleeId = "";
		$scope.counselTitle = "";
		$scope.counselContent = "";
		$scope.counselDate = "";
		$scope.regDate = "";
		$scope.counsellorName = "";
		$scope.counsellorPhoto = "";
		$scope.familyType = "";
		$scope.familyMembers = [];
		$scope.fileList = [];
		$scope.counseleeType = "";

		/*	상담 상세 조회	*/
		counselService.getCounselDetail($scope);

		$scope.getPhotoFileFullPath = function(photo_file_path) {
			return CommUtil.createFileFullPath(photo_file_path, 'photo');
		};

		$scope.getUserGender = function(gender) {
			var result = "";
			if("M" == gender) {
				if($scope.counseleeType == '005') {
					result = "자";
				} else {
					result = "부";
				}
			} else {
				if($scope.counseleeType == '005') {
					result = "녀";
				} else {
					result = "모";
				}
			}
			return result;
		};

		/*	상담 수정뷰 버튼	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=counselUpdateView]', function() {
			$("div.counselDetail input").removeAttr("readonly");
			$("div.counselDetail textarea").removeAttr("readonly");
			$("div.counselDetail select").removeAttr("disabled");
			var amount = $("div.counselDetail input[name=receiptAmount]").val();
			$("div.counselDetail input[name=receiptAmount]").val(amount.replace(/,/gi,""));

			$("button[data-act=receiptUpdate]").css("display", "");
			$("button[data-act=receiptUpdateCancel]").css("display", "");
		});

		/*	상담 수정 페이지	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=counselUpdate]', function() {
			$window.location.href = PageUrl.counsel.update + '?hakwon_no=' + hakwonInfo.hakwon_no + '&counsel_no=' + $scope.counselNo;
		});

		/*	상담 리스트	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=counselList]', function() {
			location.reload();
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});


/*	상담 수정하기	*/
hakwonMainApp.controller('counselUpdateController', function($scope, $location, $window, $routeParams, counselService, CommUtil) {
	try {

		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		comm.setHeader([{url:PageUrl.main, title:'홈'}, {url:PageUrl.counsel.update+'?hakwon_no='+hakwonInfo.hakwon_no, title:'상담'}, {url:'#', title:'상담 수정'}]);

		$scope.counselNo = $routeParams.counsel_no;
		$scope.counselType = $routeParams.counselType;

		$scope.counseleeNo = "";
		$scope.counseleeName = "";
		$scope.counseleeId = "";
		$scope.counselTitle = "";
		$scope.counselContent = "";
		$scope.counselDate = "";
		$scope.regDate = "";
		$scope.counsellorName = "";
		$scope.counsellorPhoto = "";
		$scope.familyType = "";
		$scope.familyMembers = [];
		$scope.fileList = [];
		$scope.counseleeType = "";

		/*	상담 상세 조회	*/
		counselService.getCounselDetail($scope);

		$scope.getPhotoFileFullPath = function(photo_file_path) {
			return CommUtil.createFileFullPath(photo_file_path, 'photo');
		};

		$scope.getUserGender = function(gender) {
			var result = "";
			if("M" == gender) {
				if($scope.counseleeType == '005') {
					result = "자";
				} else {
					result = "부";
				}
			} else {
				if($scope.counseleeType == '005') {
					result = "녀";
				} else {
					result = "모";
				}
			}
			return result;
		};

		/*	상담 수정뷰 버튼	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=counselUpdateView]', function() {
			$("div.counselDetail input").removeAttr("readonly");
			$("div.counselDetail textarea").removeAttr("readonly");
			$("div.counselDetail select").removeAttr("disabled");
			var amount = $("div.counselDetail input[name=receiptAmount]").val();
			$("div.counselDetail input[name=receiptAmount]").val(amount.replace(/,/gi,""));

			$("button[data-act=receiptUpdate]").css("display", "");
			$("button[data-act=receiptUpdateCancel]").css("display", "");
			$("button[data-act=receiptUpdateView]").css("display", "none");
			$("button[data-act=receiptDelete]").css("display", "none");

		});

		/*	상담 수정	*/
		$scope.counselUpdate = function() {
			counselService.updateCounsel($scope, $window);
		};

		/*	상담 삭제	*/
		$scope.counselDelete = function() {
			counselService.deleteReceipt($scope, $window);
		};

		/*	상담 취소	*/
		$scope.counselInsertCancel = function() {
			window.history.back();
		}

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});
