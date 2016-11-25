package hakwonband.admin.dao;

import java.util.List;

import hakwonband.util.DataMap;


/**
 * 원장 DAO
 * @author bumworld
 *
 */
public interface MasterDAO {

	/**
	 * 원장님 리스트
	 * @return
	 */
	public List<DataMap> masterList(DataMap param);

	/**
	 * 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonList(DataMap param);

	/**
	 * 원장님 카운트
	 * @return
	 */
	public int masterCount(DataMap param);

	/**
	 * 승인/거절 처리
	 * @param param
	 * @return
	 */
	public int approvedUserUpdate(DataMap param);

	/**
	 * 승인/거절 처리
	 * @param param
	 * @return
	 */
	public int approvedUserInfoUpdate(DataMap param);
}