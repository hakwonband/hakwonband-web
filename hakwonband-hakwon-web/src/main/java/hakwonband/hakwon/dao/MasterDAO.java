package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 학원 DAO
 * @author bumworld.kim
 *
 */
public interface MasterDAO {

	/**
	 * 원장 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> masterHakwonList(DataMap param);

	/**
	 * 원장 미인증 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> masterHakwonUncertifiedList(DataMap param);

	/**
	 * 미승인 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> unauthorizedHakwonList(DataMap param);

	/**
	 * 원장 학원 리스트 카운트
	 * @param param
	 * @return
	 */
	public int masterHakwonListCount(DataMap param);

	/**
	 * 학원 등록
	 * @param param
	 */
	public void insertHakwon(DataMap param);

	/**
	 * 학원 정보 등록
	 * @param param
	 */
	public void insertHakwonInfo(DataMap param);

	/**
	 * 학원 주소 등록
	 * @param param
	 */
	public int insertHakwonAddress(DataMap param);

	/**
	 * 학원 기본정보 수정
	 * @param param
	 * @return
	 */
	public int masterHakwonUpdate(DataMap param);

	/**
	 * 학원 부가정보 수정
	 * @param param
	 * @return
	 */
	public int masterHakwonInfoUpdate(DataMap param);

	/**
	 * 학원 주소 삭제
	 * @param param
	 * @return
	 */
	public int masterHakwonAddressDelete(DataMap param);

	/**
	 * 학원 반 정보 등록
	 * @param param
	 * @return
	 */
	public int masterHakwonClassInsert(DataMap param);

	/**
	 * 반 정보 수정
	 * @param param
	 * @return
	 */
	public int updateClassInfo(DataMap param);

	/**
	 * 반 삭제 전, 반 소속 선생님, 학생 카운트 체크
	 * @param param
	 * @return
	 */
	public int checkClassMemberCount(DataMap param);

	/**
	 * 반 삭제
	 * @param param
	 * @return
	 */
	public int deleteClass(DataMap param);

	/**
	 * 학원 반 선생 등록
	 * @param param
	 * @return
	 */
	public int insertClassTeacher(DataMap param);

	/**
	 * 학원 반 선생님 삭제
	 * @param param
	 * @return
	 */
	public int deleteClassTeacher(DataMap param);

	/**
	 * 학원 선생님 담당과목 수정
	 * @param param
	 * @return
	 */
	public int updateTeacherSubject(DataMap param);

	/**
	 * 학원 선생님 교과목 수정
	 * @param param
	 * @return
	 */
	public int masterUpdateTeacherSubject(DataMap param);

	/**
	 * 학원 선생님 목록
	 * @param param
	 * @return
	 */
	public List<DataMap> masterTeacherList(DataMap param);

	/**
	 * 학원 선생님 목록 카운트
	 * @param param
	 * @return
	 */
	public int masterTeacherListCount(DataMap param);

	/**
	 * 학원 선생님 목록 (반에 미등록된 선생님 체크)
	 * @param param
	 * @return
	 */
	public List<DataMap> searchTeacherList(DataMap param);

	/**
	 * 학원 선생님 목록 카운트 (반에 미등록된 선생님 체크)
	 * @param param
	 * @return
	 */
	public int searchTeacherListTotCount(DataMap param);

	/**
	 * 학원 소개 수정 및 등록
	 * @param param
	 * @return
	 */
	public int masterUpdateHakwonIntro(DataMap param);

	/**
	 * 미승인 선생님 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> unauthorizedTeacherList(DataMap param);

	/**
	 * 선생님 학원 승인
	 * @param param
	 * @return
	 */
	public int teacherHakwonApproved(DataMap param);

	/**
	 * 선생님 학원 등록
	 * @param param
	 */
	public void teacherHakwonInsert(DataMap param);

	/**
	 * 학원 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonClassList(DataMap param);

	/**
	 * 원장님 전체 학원리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> masterHakwonAllList(DataMap param);

	/**
	 * 학원에서 선생님 제거
	 * @param param
	 * @return
	 */
	public int teacherHakwonDelete(DataMap param);

	/**
	 * 반에서 선생님 제거
	 * @param param
	 * @return
	 */
	public int teacherClassDelete(DataMap param);

	/**
	 * 학원 원장님 체크
	 * @param param
	 * @return
	 */
	public int checkHakwonMaster(DataMap param);
}