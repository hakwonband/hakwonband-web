hakwonMainApp.service('testService', function() {
	console.log('hakwonMainApp testService call');

	/*	테스트 메시지 전송	*/
	this.testMsgSend = function(param) {
		console.log('param', param);
		$.ajax({
			url: contextPath+"/test/msgSend.do",
			type: "post",
			data: $.param(param, true),
			dataType: "json",
			success: function(data) {
				var colData = data.colData;
				if( colData.flag == CommonConstant.Flag.success ) {
					alert('성공');
				} else {
					alert('실패');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('메시지 전송을 실패 했습니다.');
			}
		});
	};


	/*	테스트 메일 발송	*/
	this.testMailSend = function(param) {
		console.log('param', param);
		$.ajax({
			url: contextPath+"/test/mailSend.do",
			type: "post",
			data: $.param(param, true),
			dataType: "json",
			success: function(data) {
				var colData = data.colData;
				if( colData.flag == CommonConstant.Flag.success ) {
					alert('메일발송 성공');
				} else {
					alert('실패');
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('메일발송을 실패 했습니다.');
			}
		});
	}
});

/**
 * test noti 컨트롤러
 */
hakwonMainApp.controller('testNotiController', function($scope, $location, testService) {
	console.log('hakwonMainApp testNotiController call', $scope, $location, testService);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	테스트 메시지 전송	*/
		$scope.testMsg = function() {
			var userNo = $('input[name=user_no]').val();
			var message = $('input[name=message]').val();
			if( isNull(message) ) {
				alert('메시지를 입력해 주세요.');
				return ;
			}
			var timeToLive = $('input[name=timeToLive]').val();
			var collapseKey = $('input[name=collapseKey]').val();
			var delayWhileIdle = $('input[name=delayWhileIdle]').val();

			var param = {userNo:userNo, message:message, timeToLive:timeToLive, collapseKey:collapseKey, delayWhileIdle:delayWhileIdle};
			console.log('param', param);
			testService.testMsgSend(param);
		};


		$("#wrapper").show();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * test mail 컨트롤러
 */
hakwonMainApp.controller('testMailController', function($scope, $location, testService) {
	console.log('hakwonMainApp testMailController call', $scope, $location, testService);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	테스트 메시지 전송	*/
		$scope.testMail = function() {
			var emailAddr = $('input[name=email_address]').val();
			if( isNull(emailAddr) ) {
				alert('이메일 주소를 입력해 주세요.');
				return ;
			}
			var param = {emailAddr:emailAddr};
			console.log('param', param);
			testService.testMailSend(param);
		};


		$("#wrapper").show();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});

/**
 * test questionsMail 컨트롤러
 */
hakwonMainApp.controller('testQuestionsMailController', function($scope, $location, testService) {
	console.log('hakwonMainApp testQuestionsMailController call', $scope, $location, testService);

	try {
		/*	페이지 초기화 호출	*/
		hakwonCommon.pageInit();

		/*	문의 메일 발송	*/
		$scope.sendQuestions = function() {
			var title = $('input[name=title]').val();
			var email = $('input[name=email]').val();
			var phone = $('input[name=phone]').val();
			var content = $('textarea[name=content]').val();
			if( isNull(title) ) {
				alert('제목을 입력해 주세요.');
				return ;
			}
			if( isNull(email) ) {
				alert('이메일 주소를 입력해 주세요.');
				return ;
			}
			if( isNull(content) ) {
				alert('메시지를 입력해 주세요.');
				return ;
			}
			var param = {title:title, email:email, phone:phone, content:content};
			$.ajax({
				url: contextPath+"/questionsMail.do",
				type: "post",
				data: $.param(param, true),
				dataType: "json",
				success: function(data) {
					var colData = data.colData;
					if( data.error ) {
						alert('실패');
					} else {
						if( colData.flag == CommonConstant.Flag.success ) {
							alert('성공');
						} else {
							alert('실패');
						}
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					alert('메시지 전송을 실패 했습니다.');
				}
			});
		};


		$("#wrapper").show();

	} catch(ex) {
		commProto.errorDump({errorObj:ex, customData:{'location':$location}});
	}
});