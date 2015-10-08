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
	
	// 코드 생성
	function makeStCodeFun() {
		var frm = $("#mainForm")[0];
		var queryString = $("#mainForm").serialize();
		$.ajax({
			type: "post",
			url:  "<%=request.getContextPath()%>" + "/hakwon/student/get.do",
			data: queryString,
			dataType: "JSON",
			success: function(data) {
				if(data.colData) {
					console.log("data : " + JSON.stringify(data));
					if(data.colData.user_no != null && data.colData.user_no != 'undefined') {
						frm["userNo"].value = data.colData.user_no;
						
						queryString = $("#mainForm").serialize();
						$.ajax({
							type: "post",
							url:  "<%=request.getContextPath()%>" + "/hakwon/student/stcode/create.do",
							data: queryString,
							dataType: "JSON",
							success: function(data) {
								if(data) {
									console.log("data : " + JSON.stringify(data));
									var flag = data.colData.flag;
									
									if("success" == flag) {
										alert("코드가 생성되었습니다. 귀하의 코드는 [" + data.colData.code + "] 입니다.");
									} else if("need_to_join" == flag) {
										alert("학원의 멤버가 아닙니다.");
									} else if("not_a_student" == flag) {
										alert("학생 계정이 아닙니다.");
									} else if("already_has_one" == flag) {
										alert("이미 코드가 있습니다. 귀하의 코드는 : [" + data.colData.code + "] 입니다.");
									} else {
										alert("실패 했습니다.");
									}
								}
							}
						});
						
					} else {
						alert("아이디 / 비번을 다시 확인 해주세요.");
					}
				} else {
					alert("아이디 / 비번을 다시 확인 해주세요.");
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
				<input type="text" name="studentId" placeholder="아이디">
				<input type="password" name="studentPass" placeholder="비번">
			</td>
			<td>
				<input type="button" onclick="makeStCodeFun()" value="코드생성">
			</td>
		</tr>
	</table>
	</form>
</body>
</html>