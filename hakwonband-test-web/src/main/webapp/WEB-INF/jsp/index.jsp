<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>학원밴드 - API Test</title>

	<%@ include file="/WEB-INF/jsp/include/commonHeader.jspf" %>

	<link href="<%=assetsPath%>/css/plugins/iCheck/custom.css" rel="stylesheet">
	<script src="<%=assetsPath%>/js/plugins/iCheck/icheck.min.js"></script>

	<script type="text/javascript" src="<%=contextPath%>/js/module/apiForm.js"></script>
	<script type="text/javascript" src="<%=contextPath%>/js/module/apiFormTemplete.js"></script>
</head>
<body class="gray-bg">

<div class="container animated fadeInDown">
	<h1 class="logo-name text-center">HAKWONBAND Test page</h1>

	<div class="ibox">
		<div class="ibox-title">
			<h2>API Test</h2>
		</div>
		<div class="ibox-content">
			<form method="get" class="form-horizontal">
				<div class="form-group">
					<label class="col-sm-2 control-label" for="test_01">서비스 타입</label>
					<div class="col-sm-10">
						<select class="form-control m-b" name="serviceType" id="test_01">
							<option value="hakwon">학원</option>
							<option value="admin">관리자</option>
							<option value="mobile">모바일</option>
							<option value="manager">매니저</option>
						</select>
					</div>
				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="test_51">등록자명으로 검색</label>
					<div class="col-sm-10">
						<select class="form-control m-b" name="searchRegUserName" id="test_51"></select>
					</div>
				</div>
				<div class="hr-line-dashed"></div>
				<div class="form-group">
					<label class="col-sm-2 control-label" for="test_02">API List</label>
					<div class="col-sm-10">
						<select class="form-control m-b" name="apiList" id="test_02"></select>
					</div>
				</div>
				<div class="hr-line-dashed"></div>
				<div id="apiFormDiv">

				</div>
				<div class="form-group">
					<label class="col-sm-2 control-label">실행서버타입</label>
					<div class="col-sm-10 radio i-checks">
			   			<label for="test_12"> <input type="radio" value="local" name="serverType" id="test_12" checked="checked"> <i></i> 로컬 </label>
			   			<label for="test_13"> <input type="radio" value="dev" name="serverType" id="test_13"> <i></i> 개발 </label>
					</div>
				</div>
				<div class="form-group p-sm">
					<textarea rows="10" cols="30" class="col-sm-12" id="result_view"></textarea>
				</div>
			</form>
		</div>
	</div>


	<p class="m-t text-center"> <small>HAKWONBAND &copy; 2015</small> </p>
</div>

<script type="text/javascript">
	var apiForm = new ApiForm();
	$(document).ready(function () {
		$('.i-checks').iCheck({
			checkboxClass: 'icheckbox_square-green',
			radioClass: 'iradio_square-green',
		});
	});
</script>
</body>
</html>