package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 학부모 DAO
 * @author bumworld
 *
 */
public interface ParentDAO {


	/**
	 * 학부모 리스트
	 * @return
	 */
	public List<DataMap> parentList(DataMap param);

	/**
	 * 학부모 카운트
	 * @return
	 */
	public int parentCount(DataMap param);

	/**
	 * 반소속 학부모 리스트
	 * @return
	 */
	public List<DataMap> classParentList(DataMap param);

	/**
	 * 반소속 학부모 카운트
	 * @return
	 */
	public int classParentCount(DataMap param);


	/**
	 * 학부모 권한 체크
	 * @param param
	 * @return
	 */
	public DataMap parentRoleCheck(DataMap param);
}