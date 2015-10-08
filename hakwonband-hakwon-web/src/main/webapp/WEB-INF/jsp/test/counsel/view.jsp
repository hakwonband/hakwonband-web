<%@page import="hakwonband.hakwon.util.PagingUtil"%>
<%@page import="hakwonband.hakwon.util.HakwonUtilSupportBox"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	DataMap counsel = HakwonUtilSupportBox.getDataMap(request.getAttribute("counsel"));
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<script type="text/javascript" src="/js/lib/jquery-2.1.1/jquery-2.1.1.min.js"></script>
	
<script type="text/javascript">

	$(function() {
		//searchFun();
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
	
	function searchStudentFun() {
		var frm = $("#mainForm")[0];
		frm.method = "post";
		frm.action = "<%=request.getContextPath()%>/hakwon/receipt/list.do"
		frm.submit();
	}
	
	// 반 검색
	function searchFun() {
		var frm = $("#mainForm")[0];
		var queryString = $("#mainForm").serialize();
		
		call_ajax(queryString, "/hakwon/receipt/class/list.do", function(data){
			if(data) {
				console.log("data : " + JSON.stringify(data));
				var html = '';
				var classList = data.colData.classList;
				if(classList != null && classList.length > 0) {
					for(var i=0; i<classList.length; i++) {
						html += '<option value='+classList[i].class_no+'>' + classList[i].class_title + '</option>';
					}
					console.log("html : " + html);
					//$("#mainForm ").children().remove();
					$("#mainForm select[name=classNo]").append(html);
				} else {
				}
			} else {
				alert("검색 실패.");
			}	
		});
	}
	
	
	// 납부 리스트 조회
	function getListFun() {
		var frm = $("#mainForm")[0];
		frm.action = "<%=request.getContextPath()%>/"
	
	}	
	
	// 학생 선택
	function selectStFun(el) {
		var stNo = $(el).attr("st-no");
		var stName = $(el).text()
		console.log("strNo : " + stNo + ", stNmae : " + stName);
		var frm = $("#mainForm")[0];
		frm["name"].value = stName;
		frm["studentNo"].value = stNo;
	}
	
	
</script>
</head>
<body>
	<form id="mainForm" name="mainForm" onsubmit="return false;">
	
	<table border="1">
		<tr>
			<td><%=counsel.get("counsel_title") %> &nbsp; <%=counsel.get("counsel_date") %></td>
			<td><%=counsel.get("counselee_name") %></td>
		</tr>
		<tr>
			<td colspan="2"></td>
		</tr>
		<tr>
			<td colspan="2"><%=counsel.get("counsel_content") %></td>
		</tr>
	
	</table>
	
	</form>
</body>
</html>