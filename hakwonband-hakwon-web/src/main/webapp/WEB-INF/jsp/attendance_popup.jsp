<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="
	hakwonband.util.DataMap
	, hakwonband.hakwon.common.constant.HakwonConstant
" %>

<%
	String popupType = request.getParameter("popupType");
	String classNo = StringUtil.replaceNull(request.getParameter("classNo"));

	String startBtnMessage = "";
	String endBtnMessage = "";
	String submitStartUrl = "";
	String submitEndUrl = "";
	if( "bus".equals(popupType) ) {
		/*	승차/하차	*/
		startBtnMessage = "승차";
		endBtnMessage = "하차";
	} else {
		/*	등원/하원	*/
		startBtnMessage = "등원";
		endBtnMessage = "하원";
	}

	String hakwonNo = (String)request.getAttribute("hakwonNo");
	DataMap hakwonDetail = (DataMap)request.getAttribute("hakwonDetail");

	String hakwonLogo = HakwonConstant.FileServer.ATTATCH_DOMAIN+hakwonDetail.getString("logo_file_path")+"_thumb";
	if( hakwonDetail.isNull("logo_file_path") ) {
		hakwonLogo = request.getContextPath()+"/images/logo/144x144.png";
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">

	<title>학원밴드 - 학원관리자</title>

	<link href="<%=contextPath %>/assets/css/bootstrap.min.css" rel="stylesheet">
	<link href="<%=contextPath %>/assets/font-awesome/css/font-awesome.css" rel="stylesheet">

	<link href="<%=contextPath %>/assets/css/animate.css" rel="stylesheet">
<%
	if( isMobile == false ) {
%>
	<link href="<%=contextPath %>/assets/css/font_style.css" rel="stylesheet">
<%
	}
%>

	<link href="<%=contextPath %>/assets/css/style.min.css" rel="stylesheet">
	<link href="<%=contextPath %>/assets/css/hakwon_style.css" rel="stylesheet">

</head>
<!-- 원장님일 경우 body class="skin-1 pace-done", 선생님일 경우 body class="skin-3 pace-done"  -->
<body class="skin-1 pace-done" onkeydown="keyCheckFun()">
	<div class="ibox attendance_popup">
		<div class="ibox-title">
			<h1><img class="img-circle" src="<%=hakwonLogo%>" alt="학원 프로필" width="50"> <%=hakwonDetail.getString("hakwon_name")%>학원</h1>
			<div class="ibox-tools">
                 <button type="button" onclick="popupClose()" class="btn btn-lg btn-outline m-t-xs" action-type="close"><i class="fa fa-times"></i></button>
             </div>
		</div>
		<div class="ibox-content">
			<div class="btn_area">
				<button class="btn_num" type="button" data-value="1">1</button>
				<button class="btn_num" type="button" data-value="2">2</button>
				<button class="btn_num" type="button" data-value="3">3</button>
				<button class="btn_num" type="button" data-value="4">4</button>
				<button class="btn_num" type="button" data-value="5">5</button>
				<button class="btn_num" type="button" data-value="6">6</button>
				<button class="btn_num" type="button" data-value="7">7</button>
				<button class="btn_num" type="button" data-value="8">8</button>
				<button class="btn_num" type="button" data-value="9">9</button>
				<button class="btn_num" type="button" data-value="0">0</button>

				<button class="btn_num btn_backspace" type="button" data-value="-"><i class="fa fa-long-arrow-left"></i></button>
				<button class="btn_num btn_delete" type="button" data-value="reset"><i class="fa fa-times"></i></button>
			</div>
			<div class="con_area">
				<!-- <div class="input-group m-b">

					모바일 화면에서는 readonly="readonly" 속성을 없애주세요
					<span data-view="attendanceCode">출결코드</span>
				</div> -->
				<p class="num_area text-info">출결코드</p>

				<div class="attendance_search_result" style="display:none"></div>

				<button class="btn btn-info dim btn_submit" type="button" action-type="start"><%=startBtnMessage%></button>
				<button class="btn btn-success dim btn_submit" type="button" action-type="end"><%=endBtnMessage%></button>
<!--
				<p class="text_area">9876번 등원이 완료되었습니다</p>
				<p class="text_area text-danger">다시 입력해 주세요</p>
-->
			</div>

			<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
					<!-- <div class="modal-header">
		        			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        			<h4 class="modal-title" id="myModalLabel">Modal title</h4>
		      			</div> -->
						<div class="modal-body"></div>
						<div class="modal-footer">
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
							<!--
							<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		       				<button type="button" class="btn btn-primary">Save changes</button>
		       				-->
						</div>
					</div>
				</div>
			</div>


		</div>
	</div>

	<script type="text/javascript" src="<%=contextPath %>/js/constants/constant.jsp"></script>
	<script type="text/javascript" src="<%=contextPath %>/assets/js/attendance.lib.min.js"></script>

</body>
<script type="text/javascript">
	var attCode = '';
	var studentNo = '';

	var numSoundArray = [
		new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
		, new Audio("<%=contextPath %>/file/num_click.mp3")
	];
	var playIdx = 0;
	var numClickEvent = function() {
		numSoundArray[playIdx].play();

		if( 11 == playIdx ) {
			playIdx = 0;
		} else {
			playIdx++;
		}
	}

	var currentVersion = undefined;
	function getAppVersion() {
		if( !currentVersion ) {
			if( window.PLATFORM ) {
				currentVersion = window.PLATFORM.version();
				currentVersion = currentVersion.replace(/\./gi, '');
			} else {
				currentVersion = 'browser';
			}
		}

		return currentVersion;
	}


	var doorBell	= new Audio("<%=contextPath %>/file/doorbell3.mp3");
	var errorBeep	= new Audio("<%=contextPath %>/file/error_beep.mp3");

	$(function() {

		/*	버튼에서 마우스 아웃	*/
		$("div.btn_area button").mouseout(function() {
			$(this).blur();
		});

		/*	출결코드 등록 버튼	*/
		$("div.attendance_popup div.ibox-content button.btn_num").click(function() {
			console.log('click');

			var thisBtnObj = this;

			var attNo = $(thisBtnObj).attr("data-value");
			if ("-" == attNo) {
				attCode = attCode.substring(0,(attCode.length - 1));
			} else if ("reset" == attNo) {
				attCode = "";
			} else {
				attCode = attCode + attNo;
			}

			if (attCode == '') {
				$('p.num_area').html('출결코드');
			} else {
				$('p.num_area').html(attCode);
			}

			/*	5자리 입력 완료되면, 학생 정보 보여주기	*/
			if (attCode.length > 4) {
				searchStudentFun();
			} else {
				$("div.attendance_search_result").hide();
			}

			if( window.PLATFORM && getAppVersion() >= 1321 ) {
				window.PLATFORM.soundNum();
			} else {
				numClickEvent();
			}

			(function(thisBtnObj) {
				$(thisBtnObj).toggleClass("btn_num_click");
				setTimeout(function() {
					$(thisBtnObj).toggleClass("btn_num_click");
				}, 100);
			})(thisBtnObj);
		});

		/*	등/하원, 승/하차 버튼 클릭	*/
		$("div.attendance_popup div.ibox-content button.btn_submit").click(function(){
			var type = $(this).attr("action-type");		// 등,하원 타입

			if("close" == type) {
				window.close();		// 클로즈 버튼이면 창 닫기
				return;
			}

			putAttendanceFun(type);
		});
	});		// $(function(){}); 의 끝


	/*	출결 등록 시작	*/
	function putAttendanceFun(type) {
		if(attCode == null || attCode == "") {
			showModalFun("출결 코드를 입력해주세요.");
			if( window.PLATFORM && getAppVersion() >= 1321 ) {
				window.PLATFORM.soundError();
			} else {
				errorBeep.play();
			}
			return;
		}

		if(attCode.length < 5) {
			showModalFun("출결코드는 5자리 이상 입력해주세요.");
			if( window.PLATFORM && getAppVersion() >= 1321 ) {
				window.PLATFORM.soundError();
			} else {
				errorBeep.play();
			}
			return;
		}

		if(studentNo == null || studentNo == '') {
			showModalFun("검색된 학생이 없습니다.");
			if( window.PLATFORM && getAppVersion() >= 1321 ) {
				window.PLATFORM.soundError();
			} else {
				errorBeep.play();
			}
			return;
		}

		if("start" == type) {
			startActFun();
		} else {
			endActFun();
		}
	}



	/*	키보드입력	*/
	function keyCheckFun() {
		var keycode = event.keyCode;
		/* if ( keycode == 8 // 백스페이스
			|| keycode == 116 // F5
		) event.returnValue = false; // 브라우저 기능 키 무효화 */

		console.log("key : " + keycode);
		var buttonKey = '';
		if(keycode == 96 || keycode == 48) {			// 0
			attCode = attCode + "0";
			buttonKey = '0';
		} else if(keycode == 97 || keycode == 49) {	// 1
			attCode = attCode + "1";
			buttonKey = '1';
		} else if(keycode == 98 || keycode == 50) {	// 2
			attCode = attCode + "2";
			buttonKey = '2';
		} else if(keycode == 99 || keycode == 51) {	// 3
			attCode = attCode + "3";
			buttonKey = '3';
		} else if(keycode == 100 || keycode == 52) {	// 4
			attCode = attCode + "4";
			buttonKey = '4';
		} else if(keycode == 101 || keycode == 53) {	// 5
			attCode = attCode + "5";
			buttonKey = '5';
		} else if(keycode == 102 || keycode == 54) {	// 6
			attCode = attCode + "6";
			buttonKey = '6';
		} else if(keycode == 103 || keycode == 55) {	// 7
			attCode = attCode + "7";
			buttonKey = '7';
		} else if(keycode == 104 || keycode == 56) {	// 8
			attCode = attCode + "8";
			buttonKey = '8';
		} else if(keycode == 105 || keycode == 57) {	// 9
			attCode = attCode + "9";
			buttonKey = '9';
		} else if(keycode == 110 || keycode == 8) {	// back space
			attCode = attCode.substring(0,(attCode.length - 1));
			buttonKey = '-';
		} else if(keycode == 187 || keycode == 107) {	// +(등원)
			putAttendanceFun('start');
			return;
		} else if(keycode == 189 || keycode == 109) {	// -(하원)
			putAttendanceFun('end');
			return;
		} else {
			return;
		}

		if( window.PLATFORM && getAppVersion() >= 1321 ) {
			window.PLATFORM.soundNum();
		} else {
			numClickEvent();
		}

		(function(buttonKey) {
			$('button[data-value='+buttonKey+']').toggleClass("btn_num_click");
			setTimeout(function() {
				$('button[data-value='+buttonKey+']').toggleClass("btn_num_click");
			}, 100);
		})(buttonKey);

		if (attCode == '') {
			$('p.num_area').html('출결코드');
		} else {
			$('p.num_area').html(attCode);
		}

		/*	5자리 입력 완료되면, 학생 정보 보여주기	*/
		if (attCode.length > 4) {
			searchStudentFun();
		} else {
			$("div.attendance_search_result").hide();
		}
	}


	/*	학생 조회	*/
	function searchStudentFun() {
		var param = {
				attendanceCode : attCode,
				hakwonNo : '<%=hakwonNo%>'
			};
			$.ajax({
				url: "<%=contextPath%>/hakwon/attendance/get/withCode.do",
				type: "post",
				data: $.param(param, true),
				dataType: "json",
				success: function(data) {
					console.log('data', data);
					if( data.error ) {
						showModalFun('학생 조회 실패했습니다.');
						return false;
					} else if(data.colData) {
						studentNo = data.colData.user_no;
						var stName = data.colData.user_name;
						var studentId = data.colData.user_id;
						var studentEmail = data.colData.user_email;
						var photoFilePath = data.colData.photo_file_path;

						var profilePath = '';
						if( !photoFilePath ) {
							profilePath = '<%=contextPath%>/images/img_photo.gif';
						} else {
							profilePath = '<%=HakwonConstant.FileServer.ATTATCH_DOMAIN%>'+photoFilePath+'_thumb';
						}

						var html = '';
						html += '<img class="img-circle" src="'+profilePath+'" alt="프로필" width="50">';
						html += '<strong class="profile_name">'+stName+'</strong>';
						html += '<span class="profile_id">'+studentId+'</span>';
						$("div.attendance_search_result").html(html);
						$("div.attendance_search_result").show();
					} else {
						studentNo = '';
						var html = '';
						html += '<span>검색된 학생이 없습니다.</span>';
						$("div.attendance_search_result").show();
						$("div.attendance_search_result").html(html);
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					showModalFun('통신을 실패 했습니다.');
				}
			});
	}

	/*	모달창 열기	*/
	function showModalFun(msg) {
		$("#myModal .modal-body").html(msg);
		$("#myModal").modal();
		window.setTimeout(hideModalFun, 1400);
	}

	/*	모달창 닫기	*/
	function hideModalFun(){
	    $('#myModal').modal('hide');
	}

	/*	등원,승차	*/
	function startActFun() {
		var param = {
			attendanceType:'start'
			, studentNo : studentNo
			, hakwonNo : '<%=hakwonNo%>'
			, popupType : '<%=popupType%>'
			, isSendingMsg : ''
			, classNo : '<%=classNo%>'
		};
		if( param.popupType == 'bus' ) {
			param.busType = '001';
		}

		$.ajax({
			url: "<%=contextPath%>/hakwon/attendance/put.do",
			type: "post",
			data: $.param(param),
			dataType: "json",
			success: function(data) {
				console.log(JSON.stringify(data));
				if( data.error ) {
					showModalFun('실패했습니다.');
					if( window.PLATFORM && getAppVersion() >= 1321 ) {
						window.PLATFORM.soundError();
					} else {
						errorBeep.play();
					}
					return false;
				}
				if(data.colData) {
					if( param.popupType == 'bus' ) {
						if("success" == data.colData.flag) {
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundDoorBell();
							} else {
								doorBell.play();
							}

							showModalFun('승차가 완료 되었습니다.');
						} else if("unavailable" == data.colData.flag) {
							showModalFun("하차 먼저 해주십시오.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						} else if("needToJoin" == data.colData.flag) {
							showModalFun("학원에 가입 안 된 학생입니다.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						} else {
							showModalFun("실패 했습니다.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						}
					} else {
						if("success" == data.colData.flag) {
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundDoorBell();
							} else {
								doorBell.play();
							}
							showModalFun('등원이 완료 되었습니다.');
						} else if("unavailable" == data.colData.flag) {
							showModalFun("하원 먼저 해주십시오.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						} else if("needToJoin" == data.colData.flag) {
							showModalFun("학원에 가입 안 된 학생입니다.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						} else {
							showModalFun("실패 했습니다.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						}
					}
				}

				/*	초기화	*/
				attCode = "";
				studentNo = '';
				$('p.num_area').html('출결코드');
				$("div.attendance_search_result").hide();
			},
			error: function(xhr, textStatus, errorThrown) {
				showModalFun('통신을 실패 했습니다.');
			}
		});
	}

	/*	하원,하차	*/
	function endActFun() {
		var param = {
			attendanceType:'end'
			, studentNo : studentNo
			, hakwonNo : '<%=hakwonNo%>'
			, popupType : '<%=popupType%>'
			, isSendingMsg : ''
		};
		if( param.popupType == 'bus' ) {
			param.busType = '002';
		}

		$.ajax({
			url: "<%=contextPath%>/hakwon/attendance/put.do",
			type: "post",
			data: $.param(param),
			dataType: "json",
			success: function(data) {
				console.log(JSON.stringify(data));
				if( data.error ) {
					showModalFun('실패했습니다.');
					if( window.PLATFORM && getAppVersion() >= 1321 ) {
						window.PLATFORM.soundError();
					} else {
						errorBeep.play();
					}
					return false;
				}
				if(data.colData) {
					if( param.popupType == 'bus' ) {
						if("success" == data.colData.flag) {
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundDoorBell();
							} else {
								doorBell.play();
							}
							showModalFun('하차가 완료 되었습니다.');
						} else if("needToJoin" == data.colData.flag) {
							showModalFun("학원에 가입 안 된 학생입니다.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						} else if("unavailable" == data.colData.flag) {
							showModalFun("승차 먼저 해주십시오.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						} else {
							showModalFun("실패 했습니다.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						}
					} else {
						if("success" == data.colData.flag) {
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundDoorBell();
							} else {
								doorBell.play();
							}
							showModalFun('하원이 완료 되었습니다.');
						} else if("already" == data.colData.flag) {
							showModalFun("이미 하원 하셨습니다.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						} else if("needToJoin" == data.colData.flag) {
							showModalFun("학원에 가입 안 된 학생입니다.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						} else if("unavailable" == data.colData.flag) {
							showModalFun("등원 먼저 해주십시오.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						} else {
							showModalFun("실패 했습니다.");
							if( window.PLATFORM && getAppVersion() >= 1321 ) {
								window.PLATFORM.soundError();
							} else {
								errorBeep.play();
							}
						}
					}
				}

				/*	초기화	*/
				attCode = "";
				studentNo = '';
				$('p.num_area').html('출결코드');
				$("div.attendance_search_result").hide();
			},
			error: function(xhr, textStatus, errorThrown) {
				showModalFun('통신을 실패 했습니다.');
			}
		});
	}

	/*	팝업 종료	*/
	function popupClose() {
		if( window.PLATFORM ) {
			window.history.back();
		} else {
			window.close();
		}
	}

</script>
</html>