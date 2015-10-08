<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<title>학원밴드 - Api Test 로그인</title>

	<%@ include file="/WEB-INF/jsp/include/commonHeader.jspf" %>

</head>

<body class="gray-bg">

	<div class="middle-box text-center loginscreen animated fadeInDown">
		<h1 class="logo-name"><small>API TEST</small><br>LOGIN</h1>
		<h3>Welcome to ApiTest Page</h3>
		<form class="m-t-xl" role="form" action="">
			<div class="form-group">
				<input type="text" class="form-control m-b-xs" name="user_id" value="tester" placeholder="아이디">
				<input type="password" class="form-control" name="pass_wd" value="xptmxj1" placeholder="비밀번호">
			</div>
			<button type="button" data-act="login" class="btn btn-primary btn-lg block full-width m-b m-t-xl">로그인</button>
		</form>
	</div>

<script type="text/javascript">
	window.onload = function() {
		/*	로그인	*/
		$('button[data-act=login]').click(function() {
			var queryString = 'user_id='+$('input[name=user_id]').val() + '&pass_wd='+$('input[name=pass_wd]').val();
			console.log('queryString', queryString);
			$.ajax({
				url: contextPath+"/login.do",
				type: "post",
				data: queryString,
				dataType: "json",
				success: function(data) {
					if( data.colData && data.colData.flag == 'success' ) {
						window.location.reload();
					} else {
						alert('로그인을 실패 했습니다.');
					}
				},
				error: function(xhr, textStatus, errorThrown) {
					alert('통신을 실패 했습니다.');
				}
			});
		});
	};
</script>
</body>
</html>