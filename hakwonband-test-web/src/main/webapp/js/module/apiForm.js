/**
 * api 폼
 */
var ApiForm = function(reqNo) {
	BaseModule.call(this, "ApiForm");

	var self = this;

	this.onload = function() {
		var $apiFormDiv = $('#apiFormDiv');

		/*	폼 템플릿 로드(가장 먼저 한다.)	*/
		self.genFormTemplete();

		/*	header 추가	*/
		$apiFormDiv.on('click', 'button[data-act=header_add]', function() {
			$.tmpl(addHeaderTemplete).appendTo("div[data-target=header] > div.col-sm-10");
		});

		/*	header 삭제	*/
		$apiFormDiv.on('click', 'button[data-act=header_remove]', function() {
			$(this.parentNode.parentNode).remove();
		});

		/*	form data 추가	*/
		$apiFormDiv.on('click', 'button[data-act=form_add]', function() {
			$.tmpl(addFormTemplete).appendTo("div[data-target=form] > div.col-sm-10");
		});

		/*	form data 삭제	*/
		$apiFormDiv.on('click', 'button[data-act=form_remove]', function() {
			$(this.parentNode.parentNode).remove();
		});

		/*	사용자 로그 아웃	*/
		$apiFormDiv.on('click', 'button[data-act=user_logout]', self.userLogout);

		/*	사용자 로그인	*/
		$apiFormDiv.on('click', 'button[data-act=user_login]', self.userLogin);

		/*	api 실행	*/
		$apiFormDiv.on('click', 'button[data-act=run]', self.apiRun);

		/**
		 * 서비스 타입 변경시 api 리스트 조회
		 */
		$('select[name=serviceType]').change(self.getApiList);

		/*	등록자 변경시 api 리스트 조회	*/
		$('select[name=searchRegUserName]').change(self.getApiList);

		/**
		 * api 선택시 로드
		 */
		$('select[name=apiList]').change(self.getApiInfo);

		/*	api 저장	*/
		$apiFormDiv.on('click', 'button[data-act=save]', self.apiSave);

		/*	api 리스트 조회	*/
		self.getApiList();

		/*	api 등록자 리스트 조회	*/
		self.apiRegUserList();

		/*	로그인 사용자 정보 조회	*/
		self.loginUserInfo();

	}

	/**
	 * 폼 템플릿 생성
	 */
	this.genFormTemplete = function(loadApiData) {
		$.tmpl(mainApiFormTemplete, loadApiData).appendTo("#apiFormDiv");
	}

	/**
	 * api 저장
	 */
	this.apiSave = function() {
		var apiJsonData = {};

		apiJsonData.serviceType = $('select[name=serviceType]').val();
		apiJsonData.apiNo = $('input[name=apiNo]').val();
		apiJsonData.apiName = $('input[name=apiName]').val();
		apiJsonData.apiDesc = $('input[name=apiDesc]').val();
		apiJsonData.apiUrl = $('input[name=apiUrl]').val();
		apiJsonData.method = $('input[name=method]:checked').val();
		apiJsonData.regUserName = $('input[name=regUserName]').val();

		apiJsonData.headers = $('input[name=headersKey], input[name=headersValue]').serialize();
		apiJsonData.form = $('input[name=formKey], input[name=formValue]').serialize();

		apiJsonData.headers = apiJsonData.headers.replace(/\+/g,'%20');
		apiJsonData.form = apiJsonData.form.replace(/\+/g,'%20');

		$.ajax({
			url: contextPath+"/apiSave.do",
			method: "post",
			type: "json",
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify(apiJsonData),
			success: function(data) {
				console.log(data);
				if( data.error ) {
					alert('api 저장을 실패 했습니다.');
				} else if( data.colData && data.colData.flag == 'success' ) {
					self.getApiList(apiJsonData.apiNo);
					self.apiRegUserList();
					alert('api 저장 성공');
				} else {
					alert('api 저장을 실패 했습니다.');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('xhr', xhr, 'textStatus', textStatus, 'errorThrown', errorThrown);
			}
		});
	}

	/**
	 * api 등록자 리스트
	 */
	this.apiRegUserList = function() {
		$.ajax({
			url: contextPath+"/selectApiRegUserList.do",
			type: "post",
			data: '',
			dataType: "json",
			success: function(data) {
				var writeHtml = '';
				writeHtml = '<option value="">전체 검색</option>';
				if( data.colData && data.colData.apiRegUserList && data.colData.apiRegUserList.length > 0 ) {
					for(var i=0; i<data.colData.apiRegUserList.length; i++) {
						var userName = data.colData.apiRegUserList[i];
						writeHtml += '<option value="'+userName+'">'+userName+'</option>';
					}
				}
				$('select[name=searchRegUserName]').html(writeHtml);
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('xhr', xhr, 'textStatus', textStatus, 'errorThrown', errorThrown);
				alert('api 리스트 조회를 실패 했습니다.');
			}
		});
	}

	/**
	 * api 리스트 조회
	 */
	this.getApiList = function(apiNo) {
		var queryString = 'serviceType='+$('select[name=serviceType]').val();
		if( $('select[name=searchRegUserName]').val() ) {
			queryString += '&searchRegUserName='+$('select[name=searchRegUserName]').val()
		}
		$.ajax({
			url: contextPath+"/getApiList.do",
			type: "post",
			data: queryString,
			dataType: "json",
			success: function(data) {
				var writeHtml = '';
				writeHtml = '<option value="">api를 등록해 주세요.</option>';
				if( data.colData && data.colData.apiList && data.colData.apiList.length > 0 ) {
					for(var i=0; i<data.colData.apiList.length; i++) {
						var apiForm = data.colData.apiList[i];
						if( apiNo ) {
							writeHtml += '<option value="'+apiForm.apiNo+'" '+(apiForm.apiNo==apiNo?'selected':'')+'>'+'['+apiForm.regUserName+']['+apiForm.apiName+']['+apiForm.apiUrl+']</option>';
						} else {
							writeHtml += '<option value="'+apiForm.apiNo+'">'+'['+apiForm.regUserName+']['+apiForm.apiName+']['+apiForm.apiUrl+']</option>';
						}
					}
				}
				$('select[name=apiList]').html(writeHtml);
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('xhr', xhr, 'textStatus', textStatus, 'errorThrown', errorThrown);
				alert('api 리스트 조회를 실패 했습니다.');
			}
		});
	}

	/**
	 * api 조회
	 */
	this.getApiInfo = function() {

		var apiNo = $('select[name=apiList]').val();
		if( apiNo ) {
			/*	기존 정보 로드	*/
			var queryString = 'apiNo='+apiNo;
			$.ajax({
				url: contextPath+"/getApi.do",
				type: "post",
				data: queryString,
				dataType: "json",
				success: function(data) {
					self.apiFormReset();
					var apiInfo = data.colData.apiForm;
					console.log(apiInfo);

					$('input[name=apiNo]').val(apiInfo.apiNo);
					$('input[name=apiName]').val(apiInfo.apiName);
					$('input[name=apiDesc]').val(apiInfo.apiDesc);
					$('input[name=apiUrl]').val(apiInfo.apiUrl);

					$('input[name=method]').parent('div').removeClass('checked');
					$('input[name=method]').attr("checked",false);

					$('input[name=method][value='+apiInfo.method+']').parent('div').addClass("checked");
					$('input[name=method][value='+apiInfo.method+']').prop("checked", true);

					$('input[name=regUserName]').val(apiInfo.regUserName);

					if( apiInfo.headers ) {
						/*	headers	*/
						var headersArray = apiInfo.headers.split('&');
						for(var i=0; i<headersArray.length; i++) {
							var header = headersArray[i];
							var headerPair = header.split('=');

							if( headerPair[0] == 'headersKey' ) {
								$.tmpl(addHeaderTemplete, {headerKey:headerPair[1]}).appendTo("div[data-target=header] > div.col-sm-10");
							} else if( headerPair[0] == 'headersValue' ) {
								var headerIdx = (i-1)/2;
								$('input[name=headersValue]:eq('+headerIdx+')').val(decodeURIComponent(headerPair[1]));
							}
						}
					}
					if( apiInfo.form ) {
						/*	form	*/
						var formArray = apiInfo.form.split('&');
						console.log(formArray);
						for(var i=0; i<formArray.length; i++) {
							var param = formArray[i];
							var paramPair = param.split('=');

							if( paramPair[0] == 'formKey' ) {
								$.tmpl(addFormTemplete, {formKey:paramPair[1]}).appendTo("div[data-target=form] > div.col-sm-10");
							} else if( paramPair[0] == 'formValue' ) {
								var formIdx = (i-1)/2;
								$('input[name=formValue]:eq('+formIdx+')').val(decodeURIComponent(paramPair[1]));
							}
						}
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					console.error('xhr', xhr, 'textStatus', textStatus, 'errorThrown', errorThrown);
					alert('api 정보 조회를 실패 했습니다.');
				}
			});
		} else {
			/*	폼 리셋	*/
			self.apiFormReset();
		}
	}

	/**
	 * apiForm 리셋
	 */
	this.apiFormReset = function() {
		$('input[name=apiNo]').val('');
		$('input[name=apiName]').val('');
		$('input[name=apiDesc]').val('');
		$('input[name=apiUrl]').val('');

		$('input[name=method]').parent('div').removeClass('checked');
		$('input[name=method]:eq(0)').parent('div').addClass("checked");
		$('input[name=method]:eq(0)').prop('checked', true);

		$('input[name=regUserName]').val('');

		$('div[data-target=header] div[data-type=header-row]').remove();
		$('div[data-target=form] div[data-type=form-row]').remove();

		$('#result_view').val('');
	}

	/**
	 * api 실행
	 */
	this.apiRun = function() {
		var serviceType = $('select[name=serviceType]').val();
		var apiUrl = $('input[name=apiUrl]').val();
		var method = $('input[name=method]:checked').val();

		var serverHost = '';
		var serverType = $('input[name=serverType]:checked').val();
		console.log('a : ' + serverType);
		if( serverType == 'local' ) {
			serverHost = 'http://local.hakwon.teamoboki.com:8080';
		} else if( serverType == 'dev' ) {
			if( serviceType == 'hakwon' ) {
				serverHost = 'http://hakwon.hakwon.teamoboki.com';
			} else if( serviceType == 'admin' ) {
				serverHost = 'http://admin.hakwon.teamoboki.com';
			} else if( serviceType == 'mobile' ) {
				serverHost = 'http://mobile.hakwon.teamoboki.com';
			} else if( serviceType == 'manager' ) {
				serverHost = 'http://manager.hakwon.teamoboki.com';
			} else {
				alert('서버 정보를 찾을 수 없습니다.');
			}
		}

		var queryString = '';
		if( $('div[data-target=form] div[data-type=form-row]').length > 0 ) {
			for(var i=0; i<$('div[data-target=form] div[data-type=form-row]').length; i++) {
				var queryName	= $('input[name=formKey]:eq('+i+')').val();
				var queryValue	= $('input[name=formValue]:eq('+i+')').val();

				var queryObj = {};
				queryObj[queryName] = queryValue;
				var queryStr = $.param(queryObj, true);
				if( i != 0 ) {
					queryString += '&';
				}
				queryString += queryStr;
			}
		}

		var headerObj = {};
		headerObj[authKey] = $.cookie(authKey);
		headerObj['X-Requested-With'] = 'XMLHttpRequest';

		$.ajax({
			url: serverHost+apiUrl,
			type: method,
			crossDomain : true,
			data: queryString,
			headers : headerObj,
			dataType: "text",
			success: function(data) {
				$('#result_view').val(data);
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('xhr', xhr, 'textStatus', textStatus, 'errorThrown', errorThrown);
				alert('api 정보 조회를 실패 했습니다.');
			}
		});
	}

	/**
	 * 사용자 로그인
	 */
	this.userLogin = function() {
		$.ajax({
			url: contextPath+"/userLogin.do",
			type: "post",
			data: $('#userLoginForm').serialize(),
			dataType: "json",
			success: function(data) {
				if( data.colData.flag == 'success' ) {
					/*	로그인 성공	*/
					self.loginUserInfo();
				} else {
					alert('사용자 로그인을 실패 했습니다.');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('xhr', xhr, 'textStatus', textStatus, 'errorThrown', errorThrown);
				alert('사용자 로그인을 실패 했습니다.');
			}
		});
	}

	/**
	 * 사용자 로그 아웃
	 */
	this.userLogout = function() {
		$.ajax({
			url: contextPath+"/userLogout.do",
			type: "post",
			data: '',
			dataType: "json",
			success: function(data) {
				if( data.colData.flag == 'success' ) {
					/*	미로그인 상태	*/
					$("div[data-type=login_user_node]").html($.tmpl(userLoginTemplete));
				} else {
					alert('사용자 로그 아웃을 실패 했습니다.');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('xhr', xhr, 'textStatus', textStatus, 'errorThrown', errorThrown);
				alert('사용자 로그 아웃을 실패 했습니다.');
			}
		});
	}

	/**
	 * 로그인 사용자 정보 조회
	 */
	this.loginUserInfo = function() {
		$.ajax({
			url: contextPath+"/getUserInfo.do",
			type: "post",
			data: '',
			dataType: "json",
			success: function(data) {
				if( data.colData ) {
					console.log(data.colData);
					$("div[data-type=login_user_node]").html($.tmpl(loginUserInfoTemplete, data.colData));
				} else {
					/*	미로그인 상태	*/
					$("div[data-type=login_user_node]").html($.tmpl(userLoginTemplete));
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.error('xhr', xhr, 'textStatus', textStatus, 'errorThrown', errorThrown);
				alert('로그인 사용자 정보 조회를 실패 했습니다.');
			}
		});
	}

	this.onload();
};