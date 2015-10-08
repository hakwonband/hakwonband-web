package hakwonband.runtime.createUser.dao;

import org.springframework.stereotype.Repository;

import hakwonband.util.DataMap;

/**
 * 사용자 생성
 * @author bumworld
 *
 */
@Repository
public interface CreateUserDAO {

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
	 * 회원가입 학생 가입자의 경우, tb_student_school 등록
	 * @param param
	 * @return
	 */
	public int insertUserSchool(DataMap param);

	/**
	 * 특정 학원에 가입신청
	 * @param param
	 * @return
	 */
	public int insertHakwonMember(DataMap param);
}