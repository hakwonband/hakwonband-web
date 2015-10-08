<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String hakwonNo = (String)request.getAttribute("hakwonNo");
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
	<link href="<%=contextPath %>/assets/css/font_style.css" rel="stylesheet">
	<link href="<%=contextPath %>/assets/css/style.css" rel="stylesheet">
	<link href="<%=contextPath %>/assets/css/hakwon_style.css" rel="stylesheet">

</head>
<!-- 원장님일 경우 body class="skin-1 pace-done", 선생님일 경우 body class="skin-3 pace-done"  -->
<body class="skin-1 pace-done">
	<div class="ibox attendance_popup">
		<div class="ibox-title">
			<h1>등/하원 관리</h1>
		</div>
		<div class="ibox-content">
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="1">1</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="2">2</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="3">3</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="4">4</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="5">5</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="6">6</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="7">7</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="8">8</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="9">9</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="0">0</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="-">←</button>
			<button class="btn btn-info dim btn-large-dim btn-outline" type="button" data-value="reset">clr</button>
			
			<form id="attendanceForm" name="attendanceForm" onsubmit="return false;">
				<input type="hidden" name="hakwonNo" value="<%=hakwonNo%>">
				<input type="hidden" name="studentNo" value="">
				<input type="hidden" name="dataType" value="001">
				<input type="hidden" name="attendanceType" value="">
				
				<span style=" margin-top: 50px; ">
					
				</span>
				<input type="text" name="attendanceCode" readonly="readonly" placeholder="등록번호" value="">
				알림 발송<input type="checkbox" name="isSendingMsg" value="true" checked="checked">
			</form>
			<button class="btn btn-info dim btn_submit" type="button" action-type="start">등원</button>
			<button class="btn btn-info dim btn_submit" type="button" action-type="end">하원</button>
			<button class="btn btn-danger dim btn_submit" type="button" action-type="close">X</button>

			<p class="text_area at-success"></p>
			<p class="text_area text-danger"></p>

		</div>
	</div>
,
	<!-- Mainly scripts -->
	<script src="<%=contextPath %>/assets/js/jquery-2.1.1.min.js"></script>
	<script src="<%=contextPath %>/assets/js/bootstrap.min.js"></script>
	<script src="<%=contextPath %>/assets/js/plugins/metisMenu/jquery.metisMenu.js"></script>

	<!-- Custom and plugin javascript -->
	<script src="<%=contextPath %>/assets/js/inspinia.js"></script>

</body>
<script type="text/javascript">
	var attCode = "";
	var stName = "";
	var frm;
	$(function() {
		frm = $("#attendanceForm")[0];
		
		/*	출결코드 입력 버튼	*/
		$("div.attendance_popup div.ibox-content button.btn-outline").click(function(){
			var attNo = $(this).attr("data-value");
			if("-" == attNo) {
				$("#attendanceForm span").children().remove();
				
				attCode = attCode.substring(0, (attCode.length-1));
			} else if("reset" == attNo) {
				$("#attendanceForm span").children().remove();
				attCode = "";	
			} else {
				attCode = attCode + attNo;
			}
			
			frm["attendanceCode"].value = attCode;
			
			/*	5자리 입력 완료되면, 학생 정보 보여주기	*/
			if(attCode.length == 5) {
				$.ajax({
					url: "<%=contextPath%>/hakwon/attendance/get/withCode.do",
					type: "post",
					data: $("#attendanceForm").serialize(),
					dataType: "json",
					success: function(data) {
						console.log(JSON.stringify(data));
						if( data.error ) {
							alert('학생 조회 실패했습니다.');
							return false;
						}
						
						if(data.colData) {
							frm["studentNo"].value = data.colData.user_no;
							
							stName = data.colData.user_name;
							var studentId = data.colData.user_id;
							var studentEmail = data.colData.user_email;
							
							var html = '';
							html += '<h2>학생정보 : '+stName+' / '+studentId+'</h2>';
							$("#attendanceForm span").append(html);
							
						} else {
							//alert("존재하지 않는 코드 입니다.");
						}
						
					},
					error: function(xhr, textStatus, errorThrown) {
						alert('통신을 실패 했습니다.');
					}
				});
			}
			
		});
		
		$("div.attendance_popup div.ibox-content button.btn_submit").click(function(){
			var type = $(this).attr("action-type");		// 등,하원 타입
			
			if("close" == type) window.close();		// 클로즈 버튼이면 창 닫기
			
			if(attCode == null || attCode == "") {
				alert("출결 코드를 입력해주세요.");
				return;
			}
			
			if(attCode.length < 5) {
				alert("출결코드는 5자리 이상 입력해주세요.");
				return;
			}
			
			if("start" == type) {
				if(confirm(stName + "님, 등원 하시겠습니까?")) {
					attendanceStart();
				}
			} else {
				if(confirm(stName + "님, 하원 하시겠습니까?")) {
					attendanceEnd();
				}
			}
		});
		

		
	});
	
	function attendanceStart(queryString) {
		$("input[name=attendanceType]").val("start");
		
		$.ajax({
			url: "<%=contextPath%>/hakwon/attendance/attendance.do",
			type: "post",
			data: $("#attendanceForm").serialize(),
			dataType: "json",
			success: function(data) {
				console.log(JSON.stringify(data));
				if( data.error ) {
					alert('실패했습니다.');
					return false;
				}
				if(data.colData) {
					if("success" == data.colData.flag) {
						alert($("input[name=attendanceCode]").val() + "번 등원이 완료되었습니다.");
						
						/*	초기화	*/
						attCode = "";
						frm["attendanceCode"].value = "";
						frm["studentNo"].value = "";
						$("#attendanceForm span").children().remove();
					} else if("already" == data.colData.flag) {
						alert("이미 등원 하셨습니다.");
					} else if("needToJoin" == data.colData.flag) {
						alert("학원에 가입 안 된 학생입니다.");	
					} else {
						alert("실패 했습니다.");
					}
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	}
	
	function attendanceEnd(queryString) {
		$("input[name=attendanceType]").val("end");
		
		$.ajax({
			url: "<%=contextPath%>/hakwon/attendance/attendance.do",
			type: "post",
			data: $("#attendanceForm").serialize(),
			dataType: "json",
			success: function(data) {
				console.log(JSON.stringify(data));
				if( data.error ) {
					alert('실패했습니다.');
					return false;
				}
				if(data.colData) {
					if("success" == data.colData.flag) {
						alert($("input[name=attendanceCode]").val() + "번 하원이 완료되었습니다.");
						
						/*	초기화	*/
						attCode = "";
						frm["attendanceCode"].value = "";
						frm["studentNo"].value = "";
						$("#attendanceForm span").children().remove();
					} else if("already" == data.colData.flag) {
						alert("이미 하원 하셨습니다.");
					} else if("needToJoin" == data.colData.flag) {
						alert("학원에 가입 안 된 학생입니다.");	
					} else if("unavailable" == data.colData.flag) {
						alert("등원 먼저 해주십시오.");	
					} else {
						alert("실패 했습니다.");
					}
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				alert('통신을 실패 했습니다.');
			}
		});
	}
	
</script>

</html>


<!-- 


	$.ajax({
		url: "<%=contextPath%>/student/get/withCode.do",
		type: "post",
		data: $("#attendanceForm").serialize(),
		dataType: "json",
		success: function(data) {
			
		},
		error: commonErrorFun
	});


 -->