package hakwonband.admin.dao;

import java.util.List;

import hakwonband.admin.model.GoogleAuthModel;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

public interface CommonDAO {


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
	 * 사용자 디바이스 인증 토큰
	 * @param loginHis
	 * @return
	 */
	public List<UserDevice> getUserDeviceToken(DataMap param);

	/**
	 * 디바이스 로그인 이력 삭제
	 * @param param
	 * @return
	 */
	public int cleanDeviceLoginHist(DataMap param);

	/**
	 * 문의 메일 등록
	 * @param param
	 */
	public void insertQuestionsMail(DataMap param);

	/**
	 * 로그인 이력 삭제
	 * @param param
	 * @return
	 */
	public int deleteLoginHis(DataMap param);


	/**
	 * 코드 리스트 조회
	 * @param param
	 * @return
	 */
	public List<DataMap> getCodeList(DataMap param);

	/**
	 * 전체 사용자 디바이스 인증 토큰
	 * @param loginHis
	 * @return
	 */
	public List<UserDevice> getAllDeviceToken();

	/**
	 * 신규 앱 버전 등록
	 * @param loginHis
	 * @return
	 */
	public int insertAppVersion(DataMap loginHis);

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
	 * 로그인 사용자 디바이스 토큰 업데이트
	 * @param param
	 * @return
	 */
	public int loginUserDeviceTokenUpdate(DataMap param);

	/**
	 * 구글 인증 정보 업데이트
	 * @param googleAuthModel
	 */
	public int googleAuthUpdate(GoogleAuthModel googleAuthModel);
}