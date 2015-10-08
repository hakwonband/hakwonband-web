package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 셋팅 DAO
 * @author jrlim
 *
 */
public interface SettingDAO {

	/**
	 * 공지 카테고리 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> noticeCateList(DataMap param);


	/**
	 * 공지 카테고리 삭제
	 * @return
	 */
	public int deleteNoticeCate(DataMap param);

	/**
	 * 공지 카테고리 수정
	 * @return
	 */
	public int modifyNoticeCate(DataMap param);

	/**
	 * 공지 카테고리 등록
	 * @param param
	 * @return
	 */
	public void insertNoticeCate(DataMap param);
}