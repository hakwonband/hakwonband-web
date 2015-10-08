<%@page import="hakwonband.hakwon.util.PagingUtil"%>
<%@page import="hakwonband.hakwon.util.HakwonUtilSupportBox"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String searchType = StringUtil.replaceNull(request.getAttribute("searchType"));
	String searchText = StringUtil.replaceNull(request.getAttribute("searchText"));
	String startDate = StringUtil.replaceNull(request.getAttribute("startDate"));
	String endDate = StringUtil.replaceNull(request.getAttribute("endDate"));
	String classNo = StringUtil.replaceNull(request.getAttribute("classNo"));
	String hakwonNo = StringUtil.replaceNull(request.getAttribute("hakwonNo"));
	String dateTerm = StringUtil.replaceNull(request.getAttribute("dateTerm"));

	List<DataMap> classList = HakwonUtilSupportBox.getReqList(request.getAttribute("classList"));		// 반 리스트
	List<DataMap> receiptList = HakwonUtilSupportBox.getReqList(request.getAttribute("receiptList"));	// 수납 리스트
	String pageNo = StringUtil.replaceNull(request.getAttribute("pageNo"));		// 현재 페이지 번호
	String receiptCount = (String)request.getAttribute("receiptCount");	// 수납 리스트 전체 카운트

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
		var stName = $(el).text();
		console.log("strNo : " + stNo + ", stNmae : " + stName);
		var frm = $("#mainForm")[0];
		frm["name"].value = stName;
		frm["studentNo"].value = stNo;
	}
	
	
</script>
</head>
<body>
	<form id="mainForm" name="mainForm" onsubmit="return false;">
	학원번호 : <input type="text" name="hakwonNo" value="9">
	<select name="classNo">
		<option value="">반명</option>
<%
	if(classList != null && !classList.isEmpty()) {
		for(DataMap classMap : classList) {
%>
		<option value=<%=classMap.get("class_no") %>><%=classMap.get("class_title") %></option>
<%			
		}
	}
%>		
	</select>
	
	<select name="searchType">
		<option value="stduentName">이름</option>
		<option value="stduentId">아이디</option>
	</select>
	
	<input type="text" name="searchText" value="<%=searchText%>">
	
	<input type="date" name="startDate" value="<%=startDate%>">  ~  <input type="date" name="endDate" value="<%=endDate%>"> 
	
	<input type="button" onClick="searchStudentFun()" value="검색">
	
	
	<table>
		<thead>
			<tr>
				<th>이름</th>
				<th>아이디</th>
				<th>반명</th>
				<th>납입 날짜>
				<th>금액</th>
			</tr>
		</thead>
		<tbody>
<%
	if(receiptList != null && !receiptList.isEmpty()) {
		for(DataMap receipt : receiptList) {
%>
			<tr>
				<td><%=receipt.get("user_name") %></td>
				<td><%=receipt.get("user_id") %></td>
				<td>반명은 첫번째 것만?</td>
				<td><%=receipt.get("receipt_date") %></td>
				<td><%=receipt.get("receipt_amount") %></td>
			</tr>
<%			
		}
	} else {
%>
			<tr>
				<td colspan="5">검색된 내용이 없습니다.</td>
			</tr>	
<%		
	}
%>		


		</tbody>
	</table>
	
	<table class="page-navigation">
	<caption class="hidden">페이지네비게이션</caption>
		<tbody>
			<tr>
				<%=PagingUtil.generatePage(Integer.parseInt(pageNo), Integer.parseInt(receiptCount))%>
			</tr>
		</tbody>
	</table>
	
	
	 
	</form>
</body>
</html>