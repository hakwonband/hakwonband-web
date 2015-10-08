package hakwonband.manager.dao;

import hakwonband.util.DataMap;

import java.util.List;

/**
 * 학원 DAO
 * @author bumworld
 *
 */
public interface HakwonDAO {


	/**
	 * 학원 카테고리 리스트
	 * @return
	 */
	public List<DataMap> hakwonCateList();

	/**
	 * 학원 리스트
	 * @return
	 */
	public List<DataMap> hakwonList(DataMap param);

	/**
	 * 학원 카운트
	 * @param param
	 * @return
	 */
	public int hakwonCount(DataMap param);

	/**
	 * 학원 상세 정보
	 * @return
	 */
	public DataMap hakwonInfo(DataMap param);

	/**
	 * 학원 소개 미리보기
	 * @param param
	 */
	public void insertPreviewIntro(DataMap param);

	/**
	 * 학원 소개 수정 및 등록
	 * @param param
	 * @return
	 */
	public int updateHakwonIntro(DataMap param);
}