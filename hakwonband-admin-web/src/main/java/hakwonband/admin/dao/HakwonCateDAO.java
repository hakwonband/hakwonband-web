package hakwonband.admin.dao;

import hakwonband.util.DataMap;

import java.util.List;

/**
 * 학원 카테 고리 DAO
 * @author bumworld
 *
 */
public interface HakwonCateDAO {


	/**
	 * 학원 카테고리 리스트
	 * @return
	 */
	public List<DataMap> hakwonCateList();

	/**
	 * 학원 카테고리 맵핑 카운트
	 * @return
	 */
	public int hakwonCateMappingCount(DataMap param);

	/**
	 * 카테고리 삭제
	 * @return
	 */
	public int deleteHakwonCate(DataMap param);

	/**
	 * 카테고리 수정
	 * @return
	 */
	public int modifyHakwonCate(DataMap param);

	/**
	 * 카테고리 등록
	 * @param param
	 * @return
	 */
	public void insertHakwonCate(DataMap param);

	/**
	 * 학원 카테고리 to String
	 * @param param
	 * @return
	 */
	public String cateCodeToString(DataMap param);
}