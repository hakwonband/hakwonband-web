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
	<script type="text/javascript" src="<%=jsPath %>/lib/jquery-2.1.1/jquery-2.1.1.min.js"></script>
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