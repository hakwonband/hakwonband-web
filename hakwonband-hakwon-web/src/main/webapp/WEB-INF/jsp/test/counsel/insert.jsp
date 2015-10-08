<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String currentDate = StringUtil.replaceNull(request.getAttribute("currentDate"));
	String hakwonNo = StringUtil.replaceNull(request.getAttribute("hakwonNo"));
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<script type="text/javascript" src="/js/lib/jquery-2.1.1/jquery-2.1.1.min.js"></script>
	
<script type="text/javascript">

	$(function() {
		
	});
	
	function call_ajax(queryString, targetUrl, callback) {
		$.ajax({
			type: "post",
			url:  '<%=request.getContextPath()%>' + targetUrl,
			data: queryString,
			dataType: "JSON",
			success: function(data) {
				callback(data);
			}
		});
	}
	
	// 상담자 검색
	function searchFun() {
		var frm = $("#mainForm")[0];
		var queryString = $("#mainForm").serialize();
		
		call_ajax(queryString, "/hakwon/counsel/counselee/select.do", function(data){
			if(data) {
				console.log("data : " + JSON.stringify(data));
				var html = '';
				var counseleeList = data.colData.counseleeList;
				if(counseleeList != null && counseleeList.length > 0) {
					for(var i=0; i<counseleeList.length; i++) {
						html += '<span style=" cursor: pointer;  font-weight: bolder;" st-no="'+counseleeList[i].user_no+'" onClick="selectStFun(this)">'+counseleeList[i].user_name+'</span><br>';
					}
					console.log("html : " + html);
					$("#student_area").children().remove();
					$("#student_area").append(html);
				} else {
					alert("검색 결과가 없습니다.");
				}
			} else {
				alert("검색 실패.");
			}	
		});
		
		
	}
	
	// 학생 선택
	function selectStFun(el) {
		var stNo = $(el).attr("st-no");
		var stName = $(el).text();
		console.log("strNo : " + stNo + ", stNmae : " + stName);
		var frm = $("#mainForm")[0];
		frm["name"].value = stName;
		frm["counseleeNo"].value = stNo;
	}
	
	// 납부 등록
	function insertCounselFun() {
		var frm = $("#mainForm")[0];
		
		var queryString = $("#mainForm").serialize();
		
		call_ajax(queryString, "/hakwon/counsel/insert.do", function(data){
			if(data) {
				console.log("data : " + JSON.stringify(data));
				if("success" == data.colData.flag) {
					alert("성공");
					frm.reset();
				} else {
					alert("실패 했습니다.");
				}
			} else {
				alert("실패 했습니다.");
			}
		});
	}
	
</script>
</head>
<body>
	<form id="mainForm" name="mainForm" onsubmit="return false;">
	학원번호 <input type="text" name="hakwonNo" value="<%=hakwonNo%>"><br>
	이름 <input type="text" name="counseleeName"> <input type="button" value="검색" onclick="searchFun()"><br>
	<div id="student_area">
	
	</div><br><br><br>
	
	
	이름 <input type="text" name="name" readonly="readonly"> 번호 <input type="text" name="counseleeNo" readonly="readonly"><br>
	상담 날짜 <input type="date" name="counselDate" value="<%=currentDate%>"><br>
	제목 <input type="text" name="title"><br>
	내용<br>
	<textarea rows="" cols="" name="content"></textarea>
	<input type="button" value="등록" onclick="insertCounselFun()"> 
	</form>
</body>
</html>