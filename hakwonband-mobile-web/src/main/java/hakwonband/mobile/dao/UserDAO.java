package hakwonband.mobile.dao;

import java.util.List;

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
	 * 회원 가입시 아이디 중복 체크
	 * @param param
	 * @return
	 */
	public DataMap checkUserId(DataMap param);

	/**
	 * 회원 가입시 이메일 중복 체크
	 * @param param
	 * @return
	 */
	public DataMap checkEmail(DataMap param);

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
	 * tb_student_school 학생 학교정보 수정
	 * @param param
	 * @return
	 */
	public int updateUserSchool(DataMap param);

	/**
	 * tb_user_info 사용자 프로필 사진 수정
	 * @param param
	 * @return
	 */
	public int updateUserPhoto(DataMap param);

	/**
	 * 부모 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> parentList(DataMap param);

	/**
	 * 자식 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> childList(DataMap param);

	/**
	 * 학교 정보
	 * @param param
	 * @return
	 */
	public DataMap schoolInfo(DataMap param);

	/**
	 * 사용자 알림 off 시간
	 * @param user_no
	 * @return
	 */
	public String userAlarmInfo(long user_no);

	/**
	 * 사용자 알림 off 등록
	 * @param user_no
	 * @param off_date
	 */
	public void updateUserAlarmOff(@Param("user_no")long user_no, @Param("off_date")String off_date);

	/**
	 * 사용자 알림 등록
	 * @param user_no
	 */
	public void insertUserAlarm(@Param("user_no")long user_no);
}