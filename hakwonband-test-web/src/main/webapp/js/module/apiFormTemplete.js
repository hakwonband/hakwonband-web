
/**
 * 메인 api 폼 템플릿
 */
var mainApiFormTemplete = '';
mainApiFormTemplete += '<input type="hidden" name="apiNo" value="">';
mainApiFormTemplete += '<div class="form-group">';
mainApiFormTemplete += '	<label class="col-sm-2 control-label" for="test_03">API Name</label>';
mainApiFormTemplete += '	<div class="col-sm-10">';
mainApiFormTemplete += '		<input type="text" class="form-control" name="apiName" id="test_03" placeholder="API Name">';
mainApiFormTemplete += '	</div>';
mainApiFormTemplete += '</div>';
mainApiFormTemplete += '<div class="form-group">';
mainApiFormTemplete += '	<label class="col-sm-2 control-label" for="test_50">등록자 이름</label>';
mainApiFormTemplete += '	<div class="col-sm-10">';
mainApiFormTemplete += '		<input type="text" class="form-control" name="regUserName" id="test_50" placeholder="등록자 이름">';
mainApiFormTemplete += '	</div>';
mainApiFormTemplete += '</div>';
mainApiFormTemplete += '<div class="hr-line-dashed"></div>';
mainApiFormTemplete += '<div class="form-group">';
mainApiFormTemplete += '	<label class="col-sm-2 control-label" for="test_04">API 설명</label>';
mainApiFormTemplete += '	<div class="col-sm-10">';
mainApiFormTemplete += '		<input type="text" class="form-control" name="apiDesc" id="test_04" placeholder="API 설명">';
mainApiFormTemplete += '	</div>';
mainApiFormTemplete += '</div>';
mainApiFormTemplete += '<div class="hr-line-dashed"></div>';
mainApiFormTemplete += '<div class="form-group">';
mainApiFormTemplete += '	<label class="col-sm-2 control-label" for="test_05">API URL</label>';
mainApiFormTemplete += '	<div class="col-sm-10">';
mainApiFormTemplete += '		<input type="text" class="form-control" name="apiUrl" id="test_05" placeholder="API URL">';
mainApiFormTemplete += '	</div>';
mainApiFormTemplete += '</div>';
mainApiFormTemplete += '<div class="hr-line-dashed"></div>';
mainApiFormTemplete += '<div class="form-group">';
mainApiFormTemplete += '	<label class="col-sm-2 control-label">Method</label>';
mainApiFormTemplete += '	<div class="col-sm-10 radio i-checks">';
mainApiFormTemplete += '			<label for="test_06"> <input type="radio" value="get" name="method" id="test_06"> <i></i> Get </label>';
mainApiFormTemplete += '			<label for="test_07"> <input type="radio" value="post" name="method" id="test_07" checked="checked"> <i></i> Post </label>';
mainApiFormTemplete += '			<label for="test_08"> <input type="radio" value="put" name="method" id="test_08"> <i></i> Put </label>';
mainApiFormTemplete += '			<label for="test_09"> <input type="radio" value="patch" name="method" id="test_09"> <i></i> Patch </label>';
mainApiFormTemplete += '			<label for="test_10"> <input type="radio" value="delete" name="method" id="test_10"> <i></i> Delete </label>';
mainApiFormTemplete += '			<label for="test_11"> <input type="radio" value="options" name="method" id="test_11"> <i></i> Options </label>';
mainApiFormTemplete += '	</div>';
mainApiFormTemplete += '</div>';
mainApiFormTemplete += '<div class="hr-line-dashed"></div>';
mainApiFormTemplete += '<div class="form-group" data-target="header">';
mainApiFormTemplete += '	<label class="col-sm-2 control-label">Headers</label>';
mainApiFormTemplete += '	<div class="col-sm-10">';
mainApiFormTemplete += '		<button type="button" class="btn btn-info" data-act="header_add">추가</button>';
mainApiFormTemplete += '	</div>';
mainApiFormTemplete += '</div>';
mainApiFormTemplete += '<div class="hr-line-dashed"></div>';
mainApiFormTemplete += '<div class="form-group" data-target="form">';
mainApiFormTemplete += '	<label class="col-sm-2 control-label">form</label>';
mainApiFormTemplete += '	<div class="col-sm-10">';
mainApiFormTemplete += '		<button type="button" class="btn btn-info" data-act="form_add">추가</button>';
mainApiFormTemplete += '	</div>';
mainApiFormTemplete += '</div>';

mainApiFormTemplete += '<div class="hr-line-dashed"></div>';
mainApiFormTemplete += '<div data-type="login_user_node" class="form-group"></div>';

mainApiFormTemplete += '<div class="hr-line-dashed"></div>';
mainApiFormTemplete += '<div class="form-group text-center p-sm">';
mainApiFormTemplete += '	<button class="btn btn-success btn-lg btn-w-m" data-act="save" type="button">저장</button>';
mainApiFormTemplete += '	<button class="btn btn-primary btn-lg btn-w-m" data-act="run" type="button">실행</button>';
mainApiFormTemplete += '</div>';
mainApiFormTemplete += '<div class="hr-line-dashed"></div>';


/**
 * 헤더 추가 템플릿
 */
var addHeaderTemplete = '';
addHeaderTemplete += '<div class="form-group m-t" data-type="header-row">';
addHeaderTemplete += '	<label class="col-sm-1 control-label" for="num_01">Key</label>';
addHeaderTemplete += '	<div class="col-sm-3">';
addHeaderTemplete += '		<input type="text" placeholder="Hakwon_no" name="headersKey" value="${headerKey}" class="form-control" id="num_01">';
addHeaderTemplete += '	</div>';
addHeaderTemplete += '	<label class="col-sm-1 control-label" for="number_01">Value</label>';
addHeaderTemplete += '	<div class="col-sm-4">';
addHeaderTemplete += '		<input type="text" placeholder="10" class="form-control" name="headersValue" value="${headerValue}" id="number_01">';
addHeaderTemplete += '	</div>';
addHeaderTemplete += '	<div class="col-sm-1">';
addHeaderTemplete += '		<button type="button" data-act="header_remove" class="btn btn-white">삭제</button>';
addHeaderTemplete += '	</div>';
addHeaderTemplete += '</div>';


/**
 * 폼 추가 템플릿
 */
var addFormTemplete = '';
addFormTemplete += '<div class="form-group m-t" data-type="form-row">';
addFormTemplete += '	<label class="col-sm-1 control-label" for="name_01">Key</label>';
addFormTemplete += '	<div class="col-sm-3">';
addFormTemplete += '		<input type="text" placeholder="formKey" name="formKey" value="${formKey}" class="form-control" id="name_01">';
addFormTemplete += '	</div>';
addFormTemplete += '	<label class="col-sm-1 control-label" for="kim_01">Value</label>';
addFormTemplete += '	<div class="col-sm-4">';
addFormTemplete += '		<input type="text" placeholder="formValue" name="formValue" value="${formValue}" class="form-control" id="kim_01">';
addFormTemplete += '	</div>';
addFormTemplete += '	<div class="col-sm-1">';
addFormTemplete += '		<button type="button" data-act="form_remove" class="btn btn-white">삭제</button>';
addFormTemplete += '	</div>';
addFormTemplete += '</div>';


/**
 * 로그인 사용자 정보 템플릿
 */
var loginUserInfoTemplete = '';
loginUserInfoTemplete += '	<label class="col-sm-2 control-label">사용자 정보</label>';
loginUserInfoTemplete += '	<div data-type="login_user_info" class="col-sm-10">';
loginUserInfoTemplete += '		<strong>이름</strong> : {{= user_name}}';
loginUserInfoTemplete += '		/ <strong>사용자 번호</strong> : {{= user_no}}';
loginUserInfoTemplete += '		/ <strong>사용자 아이디</strong> : {{= user_id}}';
loginUserInfoTemplete += '		/ <strong>사용자 타입</strong> : {{= user_type_name}}';
loginUserInfoTemplete += '		<button type="button" data-act="user_logout" class="btn btn-default m-l">로그아웃</button>';
loginUserInfoTemplete += '	</div>';

/**
 * 사용자 로그인 템플릿
 */
var userLoginTemplete = '';
userLoginTemplete += '<div class="form-group">';
userLoginTemplete += '	<label class="col-sm-2 control-label" for="test_login_id">로그인</label>';
userLoginTemplete += '	<div class="col-sm-10">';
userLoginTemplete += '	<form id="userLoginForm" onsubmit="return false;">';
userLoginTemplete += '		<div class="col-sm-3">';
userLoginTemplete += '			<input type="text" name="userId" id="test_login_id" class="form-control" placeholder="아이디">';
userLoginTemplete += '		</div>';
userLoginTemplete += '		<div class="col-sm-3">';
userLoginTemplete += '			<input type="password" name="userPass" id="test_login_pw" class="form-control" placeholder="비밀번호">';
userLoginTemplete += '		</div>';
userLoginTemplete += '		<div class="col-sm-3">';
userLoginTemplete += '			<button type="button" data-act="user_login" class="btn btn-primary">로그인</button>';
userLoginTemplete += '		</div>';
userLoginTemplete += '	</form>';
userLoginTemplete += '	</div>';
userLoginTemplete += '</div>';