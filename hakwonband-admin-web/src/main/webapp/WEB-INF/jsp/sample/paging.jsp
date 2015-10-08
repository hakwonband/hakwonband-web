<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<title>샘플 페이징 입니다.</title>

	<%@ include file="/WEB-INF/jsp/include/commonHeader.jspf" %>

	<script type="text/javascript" src="<%=jsPath%>/lib/twbs-pagination/jquery.twbsPagination.js"></script>

<script type="text/javascript">
</script>

</head>
<body>

<ul id="pagination-demo" class="pagination-sm"></ul>

<script type="text/javascript">
	window.onload = function() {
		$('#pagination-demo').twbsPagination({
			totalPages : 35
			, visiblePages : 7
			, onPageClick : function (event, page) {
				console.log('page : ' + page, event);
			}
	    });
	};
</script>
</body>
</html>