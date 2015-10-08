<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="
	hakwonband.util.*
	, hakwonband.common.constant.CommonConstant
"%>

<%
	String errorReqType	= StringUtil.replaceNull(request.getAttribute(CommonConstant.AlertMessage.errorReqType));
	String errorMessage	= StringUtil.replaceNull(request.getAttribute(CommonConstant.AlertMessage.errorMessage));
%>

<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/jsp/include/commonHeader.jspf" %>
	<title><%=errorMessage%></title>

<script type="text/javascript">

	$(function() {
		alert("error : <%=errorReqType%> , <%=errorMessage%>");
		window.location = "<%=contextPath%>/";
	});

</script>
</head>

<body>
	<h2><%=errorReqType%></h2>
</body>
</html>