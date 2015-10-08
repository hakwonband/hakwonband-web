<%@page pageEncoding="utf-8"%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%@ page import="
	java.util.*
	, hakwonband.common.constant.*
	, hakwonband.test.common.constant.HakwonConstant
	, hakwonband.util.StringUtil
	, hakwonband.util.DataMap
	, hakwonband.test.util.PagingUtil" %>

<%
	String contextPath	= request.getContextPath();	//	context path

	String jsPath = contextPath + "/js";
	String cssPath = contextPath + "/css";
	String imgPath = contextPath + "/images";
	String assetsPath = contextPath + "/assets";
	String authKey	= CommonConstant.Cookie.hkBandAuthKey;
%>