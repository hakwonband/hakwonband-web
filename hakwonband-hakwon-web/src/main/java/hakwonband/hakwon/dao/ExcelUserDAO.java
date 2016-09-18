package hakwonband.hakwon.dao;

import hakwonband.util.DataMap;

/**
 * 엑셀 회원 등록 DAO
 * @author bumworld
 *
 */
public interface ExcelUserDAO {

	/**
	 * 회원가입 기본정보 tb_user 등록
	 * @param param
	 * @return
	 */
	public int insertUser(DataMap param);

	/**
	 * 회원가입 부가정보 tb_user_info 등록
	 * @param param
	 * @return
	 */
	public int insertUserInfo(DataMap param);


	/**
	 * 특정 학원에 가입신청
	 * @param param
	 * @return
	 */
	public int insertHakwonMember(DataMap param);

	/**
	 * 반 번호 조회
	 * @param param
	 * @return
	 */
	public int getClassNo(DataMap param);

	/**
	 * 학생 반에 등록
	 * @param param
	 */
	public void insertClassStudent(DataMap param);
}