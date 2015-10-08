<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="
	hakwonband.util.*
	, hakwonband.common.constant.CommonConstant
"%>

<%
	/*	FileNotFoundException 오류 화면 만들어야 함	*/
	String errorReqType	= StringUtil.replaceNull(request.getAttribute(CommonConstant.AlertMessage.errorReqType));
	String errorMessage	= StringUtil.replaceNull(request.getAttribute(CommonConstant.AlertMessage.errorMessage));
%>

<!DOCTYPE html>
<html lang="ko">
<head>
	<%@ include file="/WEB-INF/jsp/include/commonHeader.jspf" %>
	<title><%=errorMessage%></title>

<script type="text/javascript">
<%
	if( "FileNotFoundException".equals(errorReqType) ) {
%>
		alert('파일을 찾을 수 없습니다.');
<%
	} else if( "hakwonband.common.exception.LoginFailException".equals(errorReqType) ) {
%>
		alert('로그인하지 않은 사용자 입니다.');
<%
	}
%>
</script>
</head>

<body>
	<h2><%=errorReqType%></h2>
</body>
</html>