package hakwonband.mobile.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 광고 DAO
 * @author bumworld.kim
 *
 */
public interface AdvertiseDAO {

	/**
	 * 지역 광고 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> areaList(DataMap param);

	/**
	 * 공통 광고 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> commList(DataMap param);

	/**
	 * 블럭 광고 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> blockList(DataMap param);

}