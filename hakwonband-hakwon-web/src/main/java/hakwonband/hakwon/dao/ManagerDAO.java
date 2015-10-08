package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

public interface ManagerDAO {

	/**
	 * 학원 매니저 정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonManagerInfo(DataMap param);

	/**
	 * 매니저 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> managerSearch(DataMap param);

	/**
	 * 학원 매니저 셋팅
	 * @param param
	 * @return
	 */
	public int hakwonManagerSetting(DataMap param);
}