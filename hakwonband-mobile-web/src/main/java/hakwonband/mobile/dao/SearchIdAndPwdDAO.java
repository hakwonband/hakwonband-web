package hakwonband.mobile.dao;

import hakwonband.util.DataMap;

public interface SearchIdAndPwdDAO {


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
	public int updateForUserInfo(DataMap param);
}