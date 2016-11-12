package hakwonband.manager.dao;

import org.apache.ibatis.annotations.Param;

import hakwonband.util.DataMap;

/**
 * 회원 DAO
 * @author jrlim
 *
 */
public interface UserDAO {

	/**
	 * 회원 상세 정보
	 * @param param
	 * @return
	 */
	public DataMap userDetail(DataMap param);

	/**
	 * tb_user 사용자 기본정보(이메일, 비밀번호) 수정
	 * @param param
	 * @return
	 */
	public int updateUser(DataMap param);

	/**
	 * tb_user_info 사용자 부가정보 수정
	 * @param param
	 * @return
	 */
	public int updateUserInfo(DataMap param);

	/**
	 * tb_user_info 사용자 프로필 사진 수정
	 * @param param
	 * @return
	 */
	public int updateUserPhoto(DataMap param);

	/**
	 * 사용자 정보
	 * @param param
	 * @return
	 */
	public DataMap userInfo(DataMap param);


	/**
	 * 사용자 알림 off 등록
	 * @param user_no
	 * @param off_date
	 */
	public void updateUserAlarmOff(@Param("user_no")long user_no, @Param("start_time")String start_time, @Param("end_time")String end_time);
}