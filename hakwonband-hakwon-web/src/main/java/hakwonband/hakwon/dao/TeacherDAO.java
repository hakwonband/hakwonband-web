package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 선생님 DAO
 * @author jrlim
 *
 */
public interface TeacherDAO {

	/**
	 * 선생님 목록 (학원과 반에 소속된)
	 * @param param
	 * @return
	 */
	public List<DataMap> teacherReqList(DataMap param);

	/**
	 * 선생님 목록 카운트
	 * @param param
	 * @return
	 */
	public int teacherListTotCount(DataMap param);

	/**
	 * 승인된 선생님 목록
	 * @param param
	 * @return
	 */
	public List<DataMap> approvedTeacherReqList(DataMap param);

	/**
	 * 소속 학원 상세정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonReqDetail(DataMap param);

	/**
	 * 선생님 소속 학원리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> teacherHakwonList(DataMap param);

	/**
	 * 해당 학원의 선생님, 학생, 학부모 카운트
	 * @param param
	 * @return
	 */
	public DataMap hakwonUsersCount(DataMap param);

	/**
	 * 학원에 선생님 등록
	 * @param param
	 * @return
	 */
	public int insertHakwonTeacher(DataMap param);

	/**
	 * 학원 가입 요청 취소
	 * @param param
	 * @return
	 */
	public int deleteRegistHakwonReqCancel(DataMap param);


	/**
	 * 반에 학생 추가 (선생님 권한)
	 * @param param
	 * @return
	 */
	public int insertClassStudentForTeacher(DataMap param);

	/**
	 * 학원내 반 목록 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonClassList(DataMap param);

	/**
	 * 학원내 반 목록 카운트
	 * @param param
	 * @return
	 */
	public int hakwonClassListTotCount(DataMap param);

	/**
	 * 반 선생님 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> classTeacherList(DataMap param);

	/**
	 * 반 선생님 리스트 카운트
	 * @param param
	 * @return
	 */
	public int classTeacherListTotCount(DataMap param);

	/**
	 * 반 학생 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> classStudentList(DataMap param);

	/**
	 * 반 학생 리스트 카운트
	 * @param param
	 * @return
	 */
	public int classStudentListTotCount(DataMap param);

	/**
	 * 반 학생의 학부모 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> classParentList(DataMap param);

	/**
	 * 반 학생의 학부모 리스트 카운트
	 * @param param
	 * @return
	 */
	public int classParentListTotCount(DataMap param);

	/**
	 * 선생님 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> classList(DataMap param);

	/**
	 * 등록 학원 검색
	 * @param param
	 * @return
	 */
	public DataMap registHakwonSearch(DataMap param);

	/**
	 * 학원 전체 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonAllList(DataMap param);

	/**
	 * 선생님 권한 체크
	 * @param param
	 * @return
	 */
	public int checkHakwonTeacher(DataMap param);
}