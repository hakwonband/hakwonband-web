package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;


/**
 * 회원 탈퇴 DAO
 * @author jrlim
 *
 */
public interface MemberOutDAO {

	/**
	 * 사용자 삭제
	 * @param param
	 * @return
	 */
	public int delUser(DataMap param);

	/**
	 * 사용자 정보 삭제
	 * @param param
	 * @return
	 */
	public int delUserInfo(DataMap param);

	/**
	 * 로그인 이력 삭제
	 * @param param
	 * @return
	 */
	public int delLoginHist(DataMap param);

	/**
	 * 메세지 삭제
	 * @param param
	 * @return
	 */
	public int delMessage(DataMap param);

	/**
	 * 받은 메세지 삭제
	 * @param param
	 * @return
	 */
	public int delMessageReceiver(DataMap param);

	/**
	 * 읽은 컨텐츠 삭제
	 * @param param
	 * @return
	 */
	public int delContentRead(DataMap param);

	/**
	 * 파일 사용 안함 처리
	 * @param param
	 * @return
	 */
	public int fileUnUsingUpdate(DataMap param);


	/**
	 * 선생님 반에서 삭제
	 * @param param
	 * @return
	 */
	public int delTeacherHakwonClassTeacher(DataMap param);

	/**
	 * 선생님 학원에서 삭제
	 * @param param
	 * @return
	 */
	public int delTeacherHakwonTeacher(DataMap param);

	/**
	 * 원장님 반 삭제
	 * @param param
	 * @return
	 */
	public int delMasterHakwonClass(DataMap param);

	/**
	 * 반 선생님 삭제
	 * @param param
	 * @return
	 */
	public int delMasterHakwonClassTeacher(DataMap param);

	/*
	 * 반 학생 삭제
	 */
	public int delMasterHakwonClassStudent(DataMap param);

	/**
	 * 학원 선생님 삭제
	 * @param param
	 * @return
	 */
	public int delMasterHakwonTeacher(DataMap param);

	/**
	 * 학원 멤버 삭제
	 * @param param
	 * @return
	 */
	public int delMasterHakwonMember(DataMap param);

	/**
	 * 학원 삭제
	 * @param param
	 * @return
	 */
	public int delMasterHakwon(DataMap param);

	/**
	 * 학원 이벤트 삭제
	 * @param param
	 * @return
	 */
	public int delMasterHakwonEvent(DataMap param);

	/**
	 * 학원 상태 변경
	 * @param param
	 * @return
	 */
	public int masterHakwonOut(DataMap param);

	/**
	 * 마스터 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> masterHakwonList(DataMap param);

	/**
	 * 선생님 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> teacherHakwonList(DataMap param);

	/**
	 * 탈퇴 이력 등록
	 * @param param
	 */
	public void insertOutHist(DataMap param);
}