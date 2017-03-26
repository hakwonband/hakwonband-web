package hakwonband.hakwon.model;

import lombok.Data;

/**
 * 전체 검색 결과
 * @author bumworld
 *
 */
@Data
public class AllSearchResultModel {

	/**
	 * 검색 타입
	 * 001 : 그룹 메세지
	 * 002 : 개별 메세지
	 * 003 : 학원 공지
	 * 004 : 반공지
	 * 005 : 이벤트
	 */
	private String search_type;

	/**
	 * 검색 번호
	 */
	private long search_no;

	/**
	 * 학원 번호
	 */
	private long hakwon_no;

	/**
	 * 제목
	 */
	private String title;

	/**
	 * 등록일
	 */
	private String reg_date;

	/**
	 * 검색 데이타
	 */
	private String search_data;

	/**
	 * 작성자
	 */
	private String reg_user_name;
}