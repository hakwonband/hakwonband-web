<%@page pageEncoding="utf-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%@ page import="
	java.util.*
	, hakwonband.common.constant.*
	, hakwonband.down.common.constant.HakwonConstant
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

	/*	마스터 관리자 계정 	*/
	boolean isMaster = false;

	DataMap adminInfoModel = (DataMap)session.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
	if( adminInfoModel != null ) {
		loginFlag = true;
	} else {
		loginFlag = false;
	}
%>