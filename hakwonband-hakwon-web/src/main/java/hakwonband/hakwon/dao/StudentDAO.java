package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 학생 DAO
 * @author bumworld.kim
 *
 */
public interface StudentDAO {

	/**
	 * 학생 리스트
	 * @return
	 */
	public List<DataMap> studentList(DataMap param);

	/**
	 * 학생 리스트
	 * @return
	 */
	public List<DataMap> notClass(DataMap param);

	/**
	 * 학생 카운트
	 * @return
	 */
	public int studentCount(DataMap param);

	/**
	 * 반 소속 학생 리스트
	 * @return
	 */
	public List<DataMap> classStudentList(DataMap param);

	/**
	 * 반 소속 학생 카운트
	 * @return
	 */
	public int classStudentCount(DataMap param);

	/**
	 * 학교 정보 수정
	 * @param param
	 * @return
	 */
	public int updateSchool(DataMap param);

	/**
	 * 학생 권한 체크
	 * @return
	 */
	public DataMap studentRoleCheck(DataMap param);

	/**
	 * 학부모 맵핑
	 * @param param
	 */
	public void parentMapping(DataMap param);

	/**
	 * 학부모 맵핑 멤버 체크
	 * @param param
	 * @return
	 */
	public int parentMappingMemberCheck(DataMap param);
}