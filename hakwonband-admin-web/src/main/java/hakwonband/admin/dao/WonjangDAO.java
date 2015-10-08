package hakwonband.admin.dao;

import hakwonband.util.DataMap;


/**
 * 원장 DAO
 * @author bumworld
 *
 */
public interface WonjangDAO {

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