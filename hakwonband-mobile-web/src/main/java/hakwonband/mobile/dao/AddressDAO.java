package hakwonband.mobile.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 주소 DAO
 * @author bumworld.kim
 *
 */
public interface AddressDAO {

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
}