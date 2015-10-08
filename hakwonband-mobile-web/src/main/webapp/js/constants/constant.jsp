<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="
	hakwonband.common.constant.*
	, hakwonband.mobile.common.constant.*
" %>

var contextPath = '<%=contextPath%>';
var imgPath		= '<%=imgPath%>';
var jsPath		= '<%=jsPath%>';
var cssPath		= '<%=cssPath%>';

var HakwonConstant = <%=HakwonConstant.getConstantJson()%>;
var CommonConstant = <%=CommonConstant.getConstantJson()%>;

/*	upload url	*/
var uploadUrl = contextPath + '/hakwon/upload.do';

/*	angularjs 헤더	*/
var angularHeaders = {'Content-Type':'application/x-www-form-urlencoded', 'X-Requested-With':'XMLHttpRequest'};