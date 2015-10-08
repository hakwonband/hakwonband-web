package hakwonband.admin.dao;

import hakwonband.util.DataMap;

import java.util.List;

/**
 * 선생님 DAO
 * @author bumworld
 *
 */
public interface TeacherDAO {


	/**
	 * 선생님 리스트
	 * @return
	 */
	public List<DataMap> teacherList(DataMap param);


	/**
	 * 선생님 카운트
	 * @return
	 */
	public int teacherCount(DataMap param);

	/**
	 * 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonList(DataMap param);
}