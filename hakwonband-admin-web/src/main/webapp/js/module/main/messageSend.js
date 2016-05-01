/**
 * 메세지 서비스
 */
hakwonMainApp.service('messageSendService', function() {
	console.log('hakwonMainApp messageSendService call');

	var messageSendService = {};

	/*	시도 조회	*/
	messageSendService.sido = function() {
		$.ajax({
			url: contextPath+"/admin/address/sidoList.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('시도 조회를 실패 했습니다.');
						return false;
					}

					var sidoHtml = '';
					for(var i=0; i<data.colData.dataList.length; i++) {
						var sido = data.colData.dataList[i];
						sidoHtml += '<option value="'+sido+'">'+sido+'</option>';
					}
					$('select[name=sido]').append(sidoHtml);
				} catch(ex) {
					commProto.errorDump({errorObj:ex});
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	};

	/*	구군 조회	*/
	messageSendService.gugun = function(sido) {
		var param = {sido:sido};
		$.ajax({
			url: contextPath+"/admin/address/gugunList.do",
			type: "post",
			data: $.param(param),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('구군 조회를 실패 했습니다.');
						return false;
					}

					var messageType = $('select[name=messageType] > option:selected').val();

					if( messageType == 'area' ) {
						var gugunHtml = '';
						gugunHtml += '<label class="i-checks ca_checks" data-check-type="gugunAll" for="area_gugun_check_099">';
						gugunHtml += '	<input type="checkbox" id="area_gugun_check_099"> 전체';
						gugunHtml += '</label>';
						for(var i=0; i<data.colData.dataList.length; i++) {
							var gugun = data.colData.dataList[i];
							gugunHtml += '<label class="i-checks ca_checks" data-check-type="gugun" for="area_gugun_check_0'+i+'">';
							gugunHtml += '	<input type="checkbox" name="gugun" value="'+gugun+'" id="area_gugun_check_0'+i+'"> '+gugun;
							gugunHtml += '</label>';
						}
						$('div[data-view-type=area] div[data-view=gugunList]').html(gugunHtml);
						$('div[data-view-type=area] div[data-view=gugunList]').find('.i-checks').iCheck({
							checkboxClass: 'icheckbox_square-green'
						});

						/*	구군 전체 선택	*/
						$('#mainNgView label[data-check-type=gugunAll]').on('ifChecked', function(event) {
							$('#mainNgView label[data-check-type=gugun]').iCheck('check');
						}).on('ifUnchecked', function(event) {
							$('#mainNgView label[data-check-type=gugun]').iCheck('uncheck');
						});

					} else if( messageType == 'hakwonSearch' ) {
						var gugunHtml = '';
						gugunHtml += '<option value="">전체</option>';
						for(var i=0; i<data.colData.dataList.length; i++) {
							var gugun = data.colData.dataList[i];
							gugunHtml += '<option value="'+gugun+'">'+gugun+'</option>';
						}
						$('div[data-view-type=hakwonSearch] select[name=gugun]').html(gugunHtml);
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

	/*	업종 조회	*/
	messageSendService.hakwonCate = function(callback) {
		$.ajax({
			url: contextPath+"/admin/hakwonCate/cateList.do",
			type: "post",
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('업종 조회를 실패 했습니다.');
						return false;
					}

					var hakwonCateHtml = '';
					hakwonCateHtml += '<label class="i-checks ca_checks" data-check-type="hakwonCateAll" for="area_hakwonCate_check_ca_099">';
					hakwonCateHtml += '	<input type="checkbox" id="area_hakwonCate_check_ca_099"> 전체';
					hakwonCateHtml += '</label>';
					for(var i=0; i<data.colData.dataList.length; i++) {
						var cateInfo = data.colData.dataList[i];
						hakwonCateHtml += '<label class="i-checks ca_checks" data-check-type="hakwonCate" for="area_hakwonCate_check_ca_0'+i+'">';
						hakwonCateHtml += '	<input type="checkbox" name="hakwonCate" value="'+cateInfo.cateCode+'" id="area_hakwonCate_check_ca_0'+i+'"> '+cateInfo.cateName;
						hakwonCateHtml += '</label>';
					}

					$('div[data-view=hakwonCateList]').html(hakwonCateHtml);
					$('div[data-view=hakwonCateList]').find('.i-checks').iCheck({
						checkboxClass: 'icheckbox_square-green'
					});

					/*	업종 전체 선택	*/
					$('#mainNgView label[data-check-type=hakwonCateAll]').on('ifChecked', function(event) {
						$('#mainNgView label[data-check-type=hakwonCate]').iCheck('check');
					}).on('ifUnchecked', function(event) {
						$('#mainNgView label[data-check-type=hakwonCate]').iCheck('uncheck');
					});

					if( callback ) {
						callback();
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
	 * 학원 검색
	 */
	messageSendService.hakwonSearch = function() {
		var searchText = $('input[name=hakwonSearchText]').val();
		if( isNull(searchText) ) {
			alert('검색어를 입력해 주세요.');
			$('input[name=hakwonSearchText]').focus();
			return ;
		}
		var param = {searchText:searchText, pageScale:50, adminRegYn:'N'};

		var sido = $('div[data-view-type=hakwonSearch] select[name=sido] > option:selected').val();
		var gugun = $('div[data-view-type=hakwonSearch] select[name=gugun] > option:selected').val();

		param.sido = sido;
		param.gugun = gugun;

		$.ajax({
			url: contextPath+"/admin/hakwon/list.do",
			type: "post",
			data : $.param(param),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('학원 조회를 실패 했습니다.');
						return false;
					}

					var hakwonHtml = '';
					var hakwonList = data.colData.hakwonList;
					if( hakwonList && hakwonList.length > 0 ) {
						for(var i=0; i<hakwonList.length; i++) {
							var hakwonInfo = hakwonList[i];

							hakwonHtml += '<li data-hakwon-no="'+hakwonInfo.hakwon_no+'" style="cursor:pointer;">';
							hakwonHtml += '	<img class="img-circle" src="'+comm.hakwonLogoImg(hakwonInfo.logo_file_path)+'" alt="'+hakwonInfo.hakwon_name+'" width="50" height="50">';
							hakwonHtml += '	<strong class="name">'+hakwonInfo.hakwon_name+'</strong> '+hakwonInfo.master_user_name;
							hakwonHtml += '</li>';
						}
					}
					$('div[data-view-type=hakwonSearch] ul.search_name_list').html(hakwonHtml);
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
	 * 사용자 검색
	 */
	messageSendService.userSearch = function(userNo) {
		var param = {};
		if( userNo ) {
			param = {userNo:userNo};
		} else {
			var searchText = $('input[name=userSearchText]').val();
			if( isNull(searchText) ) {
				alert('검색어를 입력해 주세요.');
				$('input[name=userSearchText]').focus();
				return ;
			}
			param = {searchText:searchText};
		}

		$.ajax({
			url: contextPath+"/admin/message/userList.do",
			type: "post",
			data : $.param(param),
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('사용자 조회를 실패 했습니다.');
						return false;
					}

					var userHtml = '';
					var userList = data.colData.dataList;
					if( userList && userList.length > 0 ) {
						for(var i=0; i<userList.length; i++) {
							var userInfo = userList[i];

							if( userNo == userInfo.user_no ) {
								userHtml += '<li data-user-no="'+userInfo.user_no+'" data-user-type="'+userInfo.user_type_name+'" style="cursor:pointer;display:none;">';
							} else {
								userHtml += '<li data-user-no="'+userInfo.user_no+'" data-user-type="'+userInfo.user_type_name+'" style="cursor:pointer;">';
							}
							userHtml += '	<img class="img-circle" src="'+comm.userProfileImg(userInfo.photo_file_path)+'" alt="'+userInfo.user_name+'" width="50" height="50">';
							userHtml += '	<strong class="name">'+userInfo.user_name+'</strong> '+userInfo.user_id + ' / '+userInfo.user_type_name + ' / ' + (userInfo.user_gender=='M'?'남자':'여자') + ' / '+userInfo.user_age + '세';
							userHtml += '</li>';
						}
					}
					$('div[data-view-type=userSearch] ul.search_name_list').html(userHtml);

					if( userNo ) {
						if( data.colData.dataList.length == 1 ) {
							var userInfo = data.colData.dataList[0];
							var tempHtml = '<li data-user-no="'+userInfo.user_no+'">'+userInfo.user_name + ' / '+userInfo.user_type_name+' <button type="button" class="btn_x" title="삭제">x</button></li>';
							$('div[data-view-type=userSearch] ul.chosen_select').append(tempHtml);
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

	/**
	 * 메세지 발송
	 */
	messageSendService.messageSend = function() {
		$('button[data-act=send]').attr('disabled', true);

		var messageType = $('select[name=messageType] > option:selected').val();
		var param = {messageType:messageType};

		if( messageType == 'area' ) {
			/*	지역 검색	*/

			/*	시도	*/
			var sido = $('div[data-view-type=area] select[name=sido] > option:selected').val();
			param.sido = sido;

			/*	구군	*/
			var gugunList = [];
			$('div[data-view-type=area] input[name=gugun]:checked').each(function(idx, obj) {
				gugunList.push(obj.value);
			});
			param.gugunList = gugunList;

			/*	업종	*/
			var hakwonCateList = [];
			$('div[data-view-type=area] input[name=hakwonCate]:checked').each(function(idx, obj) {
				hakwonCateList.push(obj.value);
			});
			param.hakwonCateList = hakwonCateList;
			if( hakwonCateList.length == 0 ) {
				alert('대상 업종을 선택해 주세요.');
				$('button[data-act=send]').attr('disabled', false);
				return ;
			}

			/*	사용자 타입	*/
			var userTypeList = [];
			$('div[data-view-type=area] input[name=userType]:checked').each(function(idx, obj) {
				userTypeList.push(obj.value);
			});
			param.userTypeList = userTypeList;

			if( userTypeList.length == 0 ) {
				alert('대상 사용자를 선택해 주세요.');
				$('button[data-act=send]').attr('disabled', false);
				return ;
			}

		} else if( messageType == 'hakwonSearch' ) {
			/*	학원 검색	*/

			/*	사용자 타입	*/
			var userTypeList = [];
			$('div[data-view-type=hakwonSearch] input[name=userType]:checked').each(function(idx, obj) {
				userTypeList.push(obj.value);
			});
			param.userTypeList = userTypeList;
			if( userTypeList.length == 0 ) {
				alert('대상 사용자를 선택해 주세요.');
				$('button[data-act=send]').attr('disabled', false);
				return ;
			}

			/*	학원 리스트	*/
			var hakwonList = [];
			$('div[data-view-type=hakwonSearch] ul.chosen_select > li').each(function(idx, obj) {
				var hakwonNo = $(obj).attr('data-hakwon-no');
				hakwonList.push(hakwonNo);
			});
			param.hakwonList = hakwonList;
			if( hakwonList.length == 0 ) {
				alert('대상 학원을 선택해 주세요.');
				$('button[data-act=send]').attr('disabled', false);
				return ;
			}

		} else if( messageType == 'userSearch' ) {
			/*	사용자 검색	*/

			/*	사용자 리스트	*/
			var userList = [];
			$('div[data-view-type=userSearch] ul.chosen_select > li').each(function(idx, obj) {
				var userNo = $(obj).attr('data-user-no');
				userList.push(userNo);
			});
			param.userList = userList;
			if( userList.length == 0 ) {
				alert('대상 사용자를 선택해 주세요.');
				$('button[data-act=send]').attr('disabled', false);
				return ;
			}
		}

		/*	내용	*/
		var messageContent = $('textarea[name=messageContent]').val();
		param.messageContent = messageContent;
		if( isNull(messageContent) ) {
			alert('내용을 입력해 주세요.');
			$('button[data-act=send]').attr('disabled', false);
			return ;
		}


		/*	파일 리스트	*/
		var fileList = [];
		$('div.file-box').each(function(idx, obj) {
			var fileNo = $(obj).attr('data-file-no');
			fileList.push(fileNo);
		});
		param.fileList = fileList;
		console.log('param', param);

		$.ajax({
			url: contextPath+"/admin/message/send.do",
			type: "post",
			data : $.param(param, true),
			complete : function(){ $('button[data-act=send]').attr('disabled', false); },
			headers : hakwonInfo.getHeader(),
			dataType: "json",
			success: function(data) {
				try {
					if( data.error ) {
						alert('메세지 전송을 실패 했습니다.');
						return false;
					}

					if( data.colData.flag == CommonConstant.Flag.success ) {
						alert('메세지 전송을 성공 했습니다.');
						window.location.href = '#/message/send?'+new Date().toString();
					} else {
						alert('메세지 전송을 실패 했습니다.');
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

	return messageSendService;
});


/**
 * 메세지 작성하기
 */
hakwonMainApp.controller('messageSendController', function($scope, $location, $routeParams, messageSendService, CommUtil) {
	console.log('hakwonMainApp messageSendController call', $scope, $location, $routeParams, messageSendService, CommUtil);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	헤더 셋팅	*/
		comm.setHeader([{url:'#/main', title:'홈'}, {url:'#', title:'메세지'}, {url:'#', title:'메세지 보내기'}]);

		/*	공통 유틸	*/
		$scope.CommUtil = CommUtil;

		$("#wrapper").show();

		/*	메세지 타입 변경	*/
		$('#mainNgView').on('change', 'select[name=messageType]', function() {
			var messageType = $(this).val();
			console.log('messageType : ' + messageType);

			$('div[data-view=commMenu]').hide();
			$('div[data-view-type='+messageType+']').show();
		});

		/*	지역 검색 /////////////////////////////////////////////////////	*/
		/*	시도 변경(지역)	*/
		$('#mainNgView').on('change', 'div[data-view-type=area] select[name=sido]', function() {
			var sido = $(this).val();
			if( sido == 'all' ) {
				$('div[data-view-type=area] div[data-view=gugunList]').empty();
			} else {
				messageSendService.gugun(sido);
			}
		});

		/*	시도 변경(학원 검색)	*/
		$('#mainNgView').on('change', 'div[data-view-type=hakwonSearch] select[name=sido]', function() {
			var sido = $(this).val();
			if( sido == '' ) {
				$('div[data-view-type=hakwonSearch] select[name=gugun]').empty();
			} else {
				messageSendService.gugun(sido);
			}
		});
		/*	/////////////////////////////////////////////////////	*/



		/*	학원 검색 /////////////////////////////////////////////////////	*/
		/*	학원 검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=hakwonSearch]', messageSendService.hakwonSearch);
		$('#mainNgView').on('keypress', 'input[name=hakwonSearchText]', function( event ) {
			if ( event.which == 13 ) {
				messageSendService.hakwonSearch();
				event.preventDefault();
			}
		});

		/*	검색 학원 클릭시	*/
		$('#mainNgView').on(clickEvent, 'div[data-view-type=hakwonSearch] ul.search_name_list > li', function() {
			var $thisLI = $(this);
			$thisLI.hide();
			var hakwonNo = $thisLI.attr('data-hakwon-no');
			var hakwonName = $thisLI.find('.name').text();

			if( $('div[data-view-type=hakwonSearch] ul.chosen_select > li[data-hakwon-no='+hakwonNo+']').length > 0 ) {
				return ;
			} else {
				var tempHtml = '<li data-hakwon-no="'+hakwonNo+'">'+hakwonName+' <button type="button" class="btn_x" title="삭제">x</button></li>';
				$('div[data-view-type=hakwonSearch] ul.chosen_select').append(tempHtml);
			}
		});

		/*	대상 학원 클릭시	*/
		$('#mainNgView').on(clickEvent, 'div[data-view-type=hakwonSearch] ul.chosen_select > li > button.btn_x', function() {
			var hakwonNo = $(this.parentNode).attr('data-hakwon-no');
			$(this.parentNode).remove();
			$('div[data-view-type=hakwonSearch] ul.search_name_list > li[data-hakwon-no='+hakwonNo+']').show();
		});
		/*	/////////////////////////////////////////////////////	*/



		/*	사용자 검색 /////////////////////////////////////////////////////	*/
		/*	사용자 검색	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=userSearch]', messageSendService.userSearch);
		$('#mainNgView').on('keypress', 'input[name=userSearchText]', function( event ) {
			if ( event.which == 13 ) {
				messageSendService.userSearch();
				event.preventDefault();
			}
		});

		/*	검색 사용자 클릭시	*/
		$('#mainNgView').on(clickEvent, 'div[data-view-type=userSearch] ul.search_name_list > li', function() {
			var $thisLI = $(this);
			$thisLI.hide();
			var userNo = $thisLI.attr('data-user-no');
			var userTypeName = $thisLI.attr('data-user-type');
			var userName = $thisLI.find('.name').text();

			if( $('div[data-view-type=userSearch] ul.chosen_select > li[data-user-no='+userNo+']').length > 0 ) {
				return ;
			} else {
				var tempHtml = '<li data-user-no="'+userNo+'">'+userName + ' / '+userTypeName+' <button type="button" class="btn_x" title="삭제">x</button></li>';
				$('div[data-view-type=userSearch] ul.chosen_select').append(tempHtml);
			}
		});

		/*	대상 회원 클릭시	*/
		$('#mainNgView').on(clickEvent, 'div[data-view-type=userSearch] ul.chosen_select > li > button.btn_x', function() {
			var userNo = $(this.parentNode).attr('data-user-no');
			$(this.parentNode).remove();
			$('div[data-view-type=userSearch] ul.search_name_list > li[data-user-no='+userNo+']').show();
		});
		/*	/////////////////////////////////////////////////////	*/

		/*	파일 삭제	*/
		$('#mainNgView').on(clickEvent, 'button.btn_file_del', function() {
			$(this).parents('div.file-box').remove();
		});

		/*	취소	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=cancel]', function() {
			commProto.hrefMove('#/');
		});

		/*	메세지 전송	*/
		$('#mainNgView').on(clickEvent, 'button[data-act=send]', messageSendService.messageSend);


		var userNo = $routeParams.userNo;
		console.log('userNo : ' + userNo);


		$scope.$$postDigest(function() {
			console.log('$$postDigest');
			$('div[data-view-type=area]').show();

			$('div[data-view=userGroup]').find('.i-checks').iCheck({
				checkboxClass: 'icheckbox_square-green'
			});

			/*	시도 조회	*/
			messageSendService.sido();

			/*	업종 조회	*/
			messageSendService.hakwonCate(function() {
				if( userNo ) {
					$('div[data-view=commMenu]').hide();
					$('div[data-view-type=userSearch]').show();
					$('select[name=messageType]').val('userSearch');

					messageSendService.userSearch(userNo);
				}
			});

			/*	파일 업로드 셋팅	*/
			if( comm.isAndroidUploader() ) {
				angular.element("input[data-act=file_upload]").click(function() {
					delete window.uploadCallBack;
					window.uploadCallBack = function(uploadJsonStr) {
						try {
							var resultObj = JSON.parse(uploadJsonStr);
							if( resultObj.error ) {
								alert('메세지 파일 업로드를 실패 했습니다.');
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
							, param : {uploadType:CommonConstant.File.TYPE_MESSAGE}
							, cookie : document.cookie
						}
					};
					window.PLATFORM.fileChooser(JSON.stringify(param));

					return false;
				});
			} else {
				var messageUploadOptions = new UploadOptions();
				messageUploadOptions.customExtraFields = {'uploadType' : CommonConstant.File.TYPE_MESSAGE};
				messageUploadOptions.onFinish = function(event, total) {
					if (this.errorFileArray.length + this.errorCount > 0) {
						alert('메세지 파일 업로드를 실패 했습니다.');
					} else {
						console.log(this.uploadFileArray);
						for (var i = 0; i < this.uploadFileArray.length; i++) {
							var fileInfo = this.uploadFileArray[i];

							$('#mainNgView div.attachment').append($.tmpl(hakwonTmpl.messageView.attchFile, {fileInfo:fileInfo}))
						}
					}
				};

				$("input[data-act=file_upload]").html5_upload(messageUploadOptions);
			}
		});

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});