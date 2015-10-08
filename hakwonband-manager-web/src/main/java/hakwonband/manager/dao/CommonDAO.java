package hakwonband.manager.dao;

import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

import java.util.List;

public interface CommonDAO {

	/**
	 * 설정 조회
	 * @param param
	 * @return
	 */
	public String selectConfig(String param);

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
	 * config 값 조회
	 * @param configKey
	 * @return
	 */
	public String selectConfigVal(String configKey);

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
	 * 반 학생들의 디바이스 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> classStudentDeviceList(DataMap param);

	/**
	 * 반 학생의 학부모 디바이스 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> classParentDeviceList(DataMap param);

	/**
	 * 학원 멤버들의 디바이스 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> hakwonMemberDeviceList(DataMap param);

	/**
	 * 앱 버전 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> getAppVersion();

	/**
	 * 코드 to String
	 * @param param
	 * @return
	 */
	public String codeToString(DataMap param);

	/**
	 * 사용자 디바이스 인증 토큰
	 * @param loginHis
	 * @return
	 */
	public List<UserDevice> getUserDeviceToken(DataMap param);

	/**
	 * 관리자 디바이스 리스트
	 * @return
	 */
	public List<UserDevice> getAdminDeviceToken();

	/**
	 * 학원 멤버 디바이스 리스트
	 * @param param
	 * @return
	 */
	public List<UserDevice> getHakwonMemberDeviceToken(DataMap param);

	/**
	 * 로그인 사용자 디바이스 토큰 업데이트
	 * @param param
	 * @return
	 */
	public int loginUserDeviceTokenUpdate(DataMap param);

	/**
	 * 코드 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> getCodeList(DataMap param);


	/**
	 * 뷰 달력 리스트
	 * @return
	 */
	public List<String> showMonthList();

	/**
	 * 반년 월 리스트
	 * @return
	 */
	public List<String> show6MonthList();
}