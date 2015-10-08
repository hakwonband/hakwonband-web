
var BaseModule = function(moduleName) {
	this.moduleName = moduleName;

	console.info(moduleName+' is Create');

	/**
	 * 현재 모듈 이름 리턴
	 */
	this.getModuleName = function() {
		return this.moduleName;
	}

	/**
	 * 전체 페이지 카운트 조회
	 */
	this.getTotalPage = function(totalCount, pageScale) {
		if( totalCount == 0 ) {
			return 1;
		}
		var totalPage = 0;
		if((totalCount % pageScale) == 0){
			totalPage = totalCount / pageScale;
		} else {
			totalPage = (totalCount / pageScale) + 1;
		}
		return totalPage;
	}
};