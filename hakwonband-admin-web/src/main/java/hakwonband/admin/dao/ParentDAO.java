package hakwonband.admin.dao;

import hakwonband.util.DataMap;

import java.util.List;

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
}