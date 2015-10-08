package hakwonband.manager.dao;

import hakwonband.util.DataMap;

public interface SignUpDAO {

	/**
	 * 아이디 찾기
	 * @param param
	 * @return
	 */
	public DataMap selectIdSearch(DataMap param);

	/**
	 * 비밀 번호 재발급을 위한 체크
	 * @param param
	 * @return
	 */
	public DataMap pwdUserInfoCheck(DataMap param);

	/**
	 * 비밀번호 재발급.
	 * @param param
	 * @return
	 */
	public int updateForUserPasswd(DataMap param);

	/**
	 * 회원 가입시 아이디 중복 체크
	 * @param param
	 * @return
	 */
	public int checkUserId(DataMap param);

	/**
	 * 회원 가입시 이메일 중복 체크
	 * @param param
	 * @return
	 */
	public int checkEmail(DataMap param);

	/**
	 * 선생님 가입시 학원 코드 검색
	 * @param param
	 * @return
	 */
	public DataMap searchHakwonCode(DataMap param);

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
	 * 매니저 등록
	 * @param param
	 * @return
	 */
	public int insertManager(DataMap param);
}