package hakwonband.hakwon.dao;

import java.util.List;

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
	 * 사용자 사용여부 처리
	 * @param param
	 * @return
	 */
	public int updateUseYn(DataMap param);

	/**
	 * 사용자 삭제
	 * @param param
	 * @return
	 */
	public int deleteUser(DataMap param);


	/**
	 * 사용자 승인 여부 체크
	 * @param param
	 * @return
	 */
	public String userApprovedCheck(DataMap param);

	/**
	 * 사용자 승인처리
	 * @param param
	 * @return
	 */
	public int approvedUserUpdate(DataMap param);

	/**
	 * 사용자 승인처리
	 * @param param
	 * @return
	 */
	public int approvedUserInfoUpdate(DataMap param);

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

	public void updateReceiptDate(DataMap param);
}