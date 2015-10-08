package hakwonband.admin.dao;

import hakwonband.util.DataMap;

import java.util.List;

/**
 * 학생 DAO
 * @author bumworld
 *
 */
public interface StudentDAO {


	/**
	 * 학생 리스트
	 * @return
	 */
	public List<DataMap> studentList(DataMap param);

	/**
	 * 학생 카운트
	 * @return
	 */
	public int studentCount(DataMap param);
}