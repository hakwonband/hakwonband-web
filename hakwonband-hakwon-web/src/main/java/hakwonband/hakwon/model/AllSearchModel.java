package hakwonband.hakwon.model;

import lombok.Data;

/**
 * 전체 검색 모델
 * @author bumworld
 *
 */
@Data
public class AllSearchModel {

	/**
	 * 사용자 번호
	 */
	private long user_no;

	/**
	 * 학원번호
	 */
	private long hakwon_no;

	/**
	 * 사용자 타입
	 */
	private String user_type;

	/**
	 * 검색어
	 */
	private String search_text;

	/**
	 * 시작번호
	 */
	private int start_no;

	/**
	 * 페이징 스케일
	 */
	private int page_scale;
}