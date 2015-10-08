package hakwonband.admin.dao;

import hakwonband.util.DataMap;

/**
 * 설정 DAO
 * @author bumworld.kim
 *
 */
public interface ConfigDAO {

	/**
	 * 설정 조회
	 * @param param
	 * @return
	 */
	public String selectConfig(DataMap param);

	/**
	 * 설정 저장
	 * @param param
	 * @return
	 */
	public int updateConfig(DataMap param);

}