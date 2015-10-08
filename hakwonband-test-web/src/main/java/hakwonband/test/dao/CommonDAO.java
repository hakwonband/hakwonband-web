package hakwonband.test.dao;

import hakwonband.util.DataMap;

import java.util.List;

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
	 * 사용자 정보 조회
	 * @param param
	 * @return
	 */
	public DataMap getUserInfo(DataMap param);

	/**
	 * 로그인 이력 저장
	 * @param loginHis
	 * @return
	 */
	public int insertLoginHis(DataMap loginHis);

}