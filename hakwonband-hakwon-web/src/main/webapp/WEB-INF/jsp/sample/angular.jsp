<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>샘플 angular 입니다.</title>

	<%@ include file="/WEB-INF/jsp/include/commonHeader.jspf" %>

<script type="text/javascript">
</script>

</head>
<body>

<div ng-app="">
	<p>Name: <input type="text" ng-model="name"></p>
	<p ng-bind="name"></p>
</div>

<script type="text/javascript">

	window.onload = function() {

	};

</script>
</body>
</html>