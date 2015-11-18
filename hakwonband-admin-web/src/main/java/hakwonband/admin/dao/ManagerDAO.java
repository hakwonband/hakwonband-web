package hakwonband.admin.dao;

import hakwonband.util.DataMap;

import java.util.List;


/**
 * 매니저 DAO
 * @author bumworld
 *
 */
public interface ManagerDAO {

	/**
	 * 매니저님 리스트
	 * @return
	 */
	public List<DataMap> managerList(DataMap param);

	/**
	 * 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonList(DataMap param);

	/**
	 * 매니저님 카운트
	 * @return
	 */
	public int managerCount(DataMap param);

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

	/**
	 * 학원 매니저 정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonManagerInfo(DataMap param);
}