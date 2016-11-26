package hakwonband.admin.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import hakwonband.util.DataMap;

/**
 * 회원 DAO
 * @author bumworld
 *
 */
public interface UserDAO {

	/**
	 * tb_user_info 사용자 프로필 사진 수정
	 * @param param
	 * @return
	 */
	public int updateUserPhoto(DataMap param);

	/**
	 * 미승인 사용자 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> unauthorizedUserList(DataMap param);

	/**
	 * 미승인 사용자 카운트
	 * @param param
	 * @return
	 */
	public int unauthorizedUserCount(DataMap param);

	/**
	 * 사용자 정보
	 * @param param
	 * @return
	 */
	public DataMap userInfo(DataMap param);

	/**
	 * 사용자 학교 정보
	 * @param param
	 * @return
	 */
	public DataMap userSchoolInfo(DataMap param);

	/**
	 * 학부모 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> parentList(DataMap param);

	/**
	 * 학생 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> childList(DataMap param);

	/**
	 * 사용자 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> userList(DataMap param);

	/**
	 * 사용자 정지 및 활성화
	 * @param param
	 * @return
	 */
	public int userStopChange(DataMap param);

	/**
	 * 엑셀 사용자 리스트
	 * @return
	 */
	public List<DataMap> excelUserList();

	/**
	 * 엑셀 사용자 리스트
	 * @return
	 */
	public List<DataMap> excelUserStudentParentList();

	/**
	 * 엑셀 사용자 리스트
	 * @return
	 */
	public List<DataMap> excelUserWonjangList();

	/**
	 * 엑셀 사용자 리스트
	 * @return
	 */
	public List<DataMap> excelUserManagerList();

	/**
	 * 사용자 알림 off 등록
	 * @param user_no
	 * @param off_date
	 */
	public void updateUserAlarmOff(@Param("user_no")long user_no, @Param("start_time")String start_time, @Param("end_time")String end_time);
}