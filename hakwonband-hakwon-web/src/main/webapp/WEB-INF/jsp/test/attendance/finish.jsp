<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String hakwonNo = StringUtil.replaceNull(request.getAttribute("hakwonNo"));
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<script type="text/javascript" src="/js/lib/jquery-2.1.1/jquery-2.1.1.min.js"></script>
	
<script type="text/javascript">
	
	
	// 코드가 있는지 확인
	function checkCodeFun() {
		var frm = $("#mainForm")[0];
		var queryString = $("#mainForm").serialize();
		
		$.ajax({
			type: "post",
			url:  "<%=request.getContextPath()%>" + "/hakwon/student/get/withCode.do",
			data: queryString,
			dataType: "JSON",
			success: function(data) {
				if(data) {
					console.log("data : " + JSON.stringify(data));
					if(data.colData.user_no != null && data.colData.user_no != 'undefined') {
						if(confirm(data.colData.user_id + "입니다. 하원 하시겠습니까?")) {
							frm["userNo"].value = data.colData.user_no;
							attendanceFun();
						}
					} else {
						alert("존재 하지 않는 코드 입니다. ");
					}
				} else {
					alert("실패 했습니다.");
				}
			}
		});
	}
	
	// 등원 처리
	function attendanceFun() {
		var queryString = $("#mainForm").serialize();
		$.ajax({
			type: "post",
			url:  "<%=request.getContextPath()%>" + "/hakwon/student/attendance.do",
			data: queryString,
			dataType: "JSON",
			success: function(data) {
				if(data) {
					console.log("data : " + JSON.stringify(data));
					if(data.flag != null && data.flag == "success") {
						console.log(data.type + "/ 하셨습니ㅏㄷ.");
					} else {
						alert("실패했습니다.");
					}
				}
			}
		});
	}
	
</script>
</head>
<body>
	<form id="mainForm" name="mainForm" onsubmit="return false;">
	<input type="hidden" name="userNo">
	<input type="hidden" name="hakwonNo" value="<%=hakwonNo%>">
	<table>
		<tr>
			<td>
				<input type="text" name="studentCode" placeholder="학생 코드">
			</td>
			<td>
				<input type="button" onclick="checkCodeFun()" value="하원">
			</td>
		</tr>
	</table>
	</form>
</body>
</html>