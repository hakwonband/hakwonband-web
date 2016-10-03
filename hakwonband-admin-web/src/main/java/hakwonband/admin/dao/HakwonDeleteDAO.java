package hakwonband.admin.dao;

/**
 * 학원 삭제 DAO
 * @author bumworld
 *
 */
public interface HakwonDeleteDAO {

	/**
	 * 학원 삭제
	 * @param hakwon_no
	 * @return
	 */
	public int delHakwon(long hakwon_no);

	/**
	 * 학원 정보 삭제
	 * @param hakwon_no
	 * @return
	 */
	public int delHakwonInfo(long hakwon_no);

	/**
	 * 학원 반 삭제
	 * @param hakwon_no
	 * @return
	 */
	public int delHakwonClass(long hakwon_no);

	/**
	 * 반 선생님 삭제
	 * @param hakwon_no
	 * @return
	 */
	public int delHakwonClassTeacher(long hakwon_no);

	/**
	 * 반 학생 삭제
	 * @param hakwon_no
	 * @return
	 */
	public int delHakwonClassStudent(long hakwon_no);

	/**
	 * 학원 선생님 삭제
	 * @param hakwon_no
	 * @return
	 */
	public int delHakwonTeacher(long hakwon_no);

	/**
	 * 학원 멤버 삭제
	 * @param hakwon_no
	 * @return
	 */
	public int delHakwonMember(long hakwon_no);

	/**
	 * 학원 이벤트 삭제
	 * @param hakwon_no
	 * @return
	 */
	public int delHakwonEvent(long hakwon_no);
}