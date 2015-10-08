package hakwonband.mobile.dao;

import hakwonband.util.DataMap;


/**
 * 회원 탈퇴 DAO
 * @author jrlim
 *
 */
public interface MemberOutDAO {

	/**
	 * 반 학생 삭제
	 * @param param
	 * @return
	 */
	public int delHakwonClassStudent(DataMap param);

	/**
	 * 학원 멤버 삭제
	 * @param param
	 * @return
	 */
	public int delHakwonMember(DataMap param);

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
	 * 학생 부모 삭제
	 * @param param
	 * @return
	 */
	public int delStudentParent(DataMap param);

	/**
	 * 학생 학교 정보 삭제
	 * @param param
	 * @return
	 */
	public int delStudentSchool(DataMap param);

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
	 * 이벤트 가입 삭제
	 * @param param
	 * @return
	 */
	public int delEventUser(DataMap param);

	/**
	 * 파일 사용 안함 처리
	 * @param param
	 * @return
	 */
	public int fileUnUsingUpdate(DataMap param);

	/**
	 * 탈퇴 이력 등록
	 * @param param
	 */
	public void insertOutHist(DataMap param);
}