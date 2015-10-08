package hakwonband.manager.dao;

import hakwonband.util.DataMap;

import java.util.List;

/**
 * 주소 DAO
 * @author bumworld.kim
 *
 */
public interface AddressDAO {

	/**
	 * 구 주소 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> searchOldDong(DataMap param);

	/**
	 * 시도 리스트
	 * @param param
	 * @return
	 */
	public List<String> sidoList(DataMap param);

	/**
	 * 구군 리스트
	 * @param param
	 * @return
	 */
	public List<String> gugunList(DataMap param);

	/**
	 * 동 리스트
	 * @param param
	 * @return
	 */
	public List<String> dongList(DataMap param);
}