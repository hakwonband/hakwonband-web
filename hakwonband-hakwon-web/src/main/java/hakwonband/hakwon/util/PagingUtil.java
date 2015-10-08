package hakwonband.hakwon.util;

import hakwonband.hakwon.common.constant.HakwonConstant;


/**
 * 페이징 유틸
 * @author bumworld
 *
 */
public class PagingUtil {

	/**
	 * 블럭당 보여줄 페이지의 갯수.
	 */
	private static int blockSize = 5;

	/**
	 * generate page
	 * @param searchText : 검색어
	 * @param searchType : 검색 타입
	 * @param currentPage : 현재 페이지번호
	 * @param totalNumber : 전체 글의 갯수
	 * @param contextPath : context path
	 * @param apiUrl : api 호출 url
	 * @param request
	 * @return
	 */
	public static String generatePage(String searchText, String searchType, String orderText, String orderType, int currentPage, int totalNumber, String contextPath, String apiUrl){
		apiUrl = contextPath + "/" +  apiUrl;
		String url = "";
		String str = "";
		int scaleOfPage = HakwonConstant.Common.SELECT_SCALE;	// 한페이당, 리스트의 개수
		int totalPage = 0;		// 전체 페이지수
		int back = 0;			// 이전 페이지
		//currentPage - 1;		// 이전 페이지
		int forward = 0;		// 다음 페이지
		//currentPage + 1;		// 다음 페이지

		if((totalNumber % scaleOfPage) == 0){
			totalPage = totalNumber / scaleOfPage;
		} else {
			totalPage = (totalNumber / scaleOfPage) + 1;
		}

		//int blockSize = 3;	// 페이지 리스트 크기 ( 10개씩 페이지를 보여줌.)
		int totalBlock = totalPage / blockSize;		// 전체 블럭의 개수

		if(totalPage % blockSize != 0){
			totalBlock++;
		}
		int currentBlock = currentPage / blockSize;		// 현재 페이지가 속한 블럭 번호

		if(currentPage % blockSize != 0){
			currentBlock++;
		}



		back = (currentBlock - 2) * blockSize + 1;
		forward = (currentBlock * blockSize ) + 1;

		url = apiUrl + "?currentPageNo=" + 1 + "&searchText=" +  searchText  + "&searchType=" + searchType + "&orderText=" + orderText + "&orderType=" + orderType;
		str = str + "<td><a href ='" + url + "'>처음</a></td>";

		if(back != 0 && back > 0) {																	//이전 버튼
			url = apiUrl + "?currentPageNo=" + back + "&searchText=" +  searchText  + "&searchType=" + searchType+ "&orderText=" + orderText + "&orderType=" + orderType;
			str = str + "<td><a href ='" + url + "'>이전</a></td>";
		}
		for( int i=(currentBlock-1)*blockSize+1; i<=currentBlock*blockSize && i<=totalPage; i++ ) { //페이징
			url = apiUrl + "?currentPageNo=" + i + "&searchText=" +  searchText  + "&searchType=" + searchType+ "&orderText=" + orderText + "&orderType=" + orderType;
			if( i == currentPage){
				str = str + "<td><a href ='" + url + "' style=' font-size: 15; color: red;'>" + i + "</a></td>";
			} else {
				str = str + "<td><a href ='" + url + "'>" + i + "</a></td>";
			}

		}

		if(currentBlock < totalBlock ) {												//다음 버튼
			url = apiUrl + "?currentPageNo=" + forward + "&searchText=" +  searchText  + "&searchType=" + searchType+ "&orderText=" + orderText + "&orderType=" + orderType;
			str = str + "<td><a href ='" + url + "'>다음</a></td>";
		}

		url = apiUrl + "?currentPageNo=" + totalPage + "&searchText=" +  searchText  + "&searchType=" + searchType+ "&orderText=" + orderText + "&orderType=" + orderType;
		str = str + "<td><a href ='" + url + "'>마지막</a></td>";
		return str;
	}

	public static String generatePage(int currentPage, int totalNumber){

		String str = "";
		int scaleOfPage = HakwonConstant.Common.SELECT_SCALE;	// 한페이당, 리스트의 개수
		int totalPage = 0;		// 전체 페이지수
		int back = 0;			// 이전 페이지
		//currentPage - 1;		// 이전 페이지
		int forward = 0;		// 다음 페이지
		//currentPage + 1;		// 다음 페이지

		if((totalNumber % scaleOfPage) == 0){
			totalPage = totalNumber / scaleOfPage;
		} else {
			totalPage = (totalNumber / scaleOfPage) + 1;
		}

		//int blockSize = 3;	// 페이지 리스트 크기 ( 10개씩 페이지를 보여줌.)
		int totalBlock = totalPage / blockSize;		// 전체 블럭의 개수

		if(totalPage % blockSize != 0){
			totalBlock++;
		}
		int currentBlock = currentPage / blockSize;		// 현재 페이지가 속한 블럭 번호

		if(currentPage % blockSize != 0){
			currentBlock++;
		}

		back = (currentBlock - 2) * blockSize + 1;
		forward = (currentBlock * blockSize ) + 1;

		if(totalNumber > 0) {
			str += "<td><a href='#none' current-page='1'>처음</a></td>";
		}


		if(back != 0 && back > 0) {																	//이전 버튼
			str += "<td><a href='#none' current-page='"+back+"'>이전</a></td>";
		}
		for( int i=(currentBlock-1)*blockSize+1; i<=currentBlock*blockSize && i<=totalPage; i++ ) { //페이징
			if( i == currentPage){
				str += "<td><a href='#none' current-page='"+i+"'><span style=' color:red; '>"+i+"</span></a></td>";
			} else {
				str += "<td><a href='#none' current-page='"+i+"'>"+i+"</a></td>";
			}

		}

		if(currentBlock < totalBlock ) {												//다음 버튼
			str += "<td><a href='#none' current-page='"+forward+"'>다음</a></td>";
		}


		if(totalNumber > 0) {
			str += "<td><a href='#none' current-page='"+totalPage+"'>마지막</a></td>";
		}
		return str;
	}
}