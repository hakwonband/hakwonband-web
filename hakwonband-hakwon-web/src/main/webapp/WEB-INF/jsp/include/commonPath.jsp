<%@page pageEncoding="utf-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%@ page import="
	java.util.*
	, hakwonband.common.constant.*
	, hakwonband.hakwon.common.constant.HakwonConstant
	, hakwonband.util.StringUtil
	, hakwonband.util.DataMap
" %>

<%
	String contextPath	= request.getContextPath();	//	context path

	String jsPath = contextPath + "/js";
	String cssPath = contextPath + "/css";
	String imgPath = contextPath + "/images";

	/*	로그인 여부	*/
	boolean loginFlag = false;

	DataMap authUserInfo = (DataMap)session.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
	if( authUserInfo != null ) {
		loginFlag = true;
	} else {
		loginFlag = false;
	}
%>