package hakwonband.mobile.dao;

import java.util.List;

import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

public interface CommonDAO {


	/**
	 * 공통 코드 그룹 리스트
	 * @return
	 */
	public List<String> getCommonGrp();

	/**
	 * 공통 코드 상세 리스트
	 * @param keyType
	 * @return
	 */
	public List<DataMap> getCommonCode(String grpCd);

	/**
	 * DB에서 현재 시간 조회
	 * @return
	 */
	public String selectTime();

	/**
	 * 로그인
	 * @param param
	 * @return
	 */
	public DataMap selectLoginInfo(DataMap param);

	/**
	 * 마지막 로그인 일자 업데이트
	 * @param param
	 * @return
	 */
	public int updateLastLogin(DataMap param);

	/**
	 * 인증 체크 유저
	 * @param param
	 * @return
	 */
	public DataMap authCheckUser(DataMap param);

	/**
	 * 로그인 이력 저장
	 * @param loginHis
	 * @return
	 */
	public int insertLoginHis(DataMap loginHis);

	/**
	 * 디바이스 로그인 이력 삭제
	 * @param param
	 * @return
	 */
	public int cleanDeviceLoginHist(DataMap param);

	/**
	 * 로그인 이력 삭제
	 * @param param
	 * @return
	 */
	public int deleteLoginHis(DataMap param);


	/**
	 * 사용자 디바이스 정보
	 * @param param
	 * @return
	 */
	public List<UserDevice> getUserDeviceToken(DataMap param);

	/**
	 * 사용자 디바이스 정보
	 * @param param
	 * @return
	 */
	public List<UserDevice> getUserDeviceTokenOne(DataMap param);

	/**
	 * 앱 버전 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> getAppVersion();

	/**
	 * 미리보기 정보
	 * @param param
	 * @return
	 */
	public DataMap getPreview(DataMap param);

	/**
	 * 로그인 사용자 디바이스 토큰 업데이트
	 * @param param
	 * @return
	 */
	public int loginUserDeviceTokenUpdate(DataMap param);
}