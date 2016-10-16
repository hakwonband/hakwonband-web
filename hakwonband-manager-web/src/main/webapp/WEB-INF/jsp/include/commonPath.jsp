<%@page pageEncoding="utf-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%@ page import="
	java.util.*
	, hakwonband.common.constant.*
	, hakwonband.util.StringUtil
	, hakwonband.util.DataMap
	, hakwonband.manager.common.constant.HakwonConstant
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
	
	boolean isMobile = false;
	String userAgent = request.getHeader("User-Agent");
	if( userAgent.indexOf("Mobile") >= 0 || userAgent.indexOf("Android") >= 0 || userAgent.indexOf("PlayBook") >= 0 || userAgent.indexOf("KFAPWI") >= 0 ) {
		isMobile = true;
	}
%>