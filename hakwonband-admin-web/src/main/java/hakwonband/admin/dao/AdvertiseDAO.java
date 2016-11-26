package hakwonband.admin.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 광고 dao
 * @author bumworld.kim
 *
 */
public interface AdvertiseDAO {

	/**
	 * 입금 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> getAdvertiseBankDepositList(DataMap param);

	/**
	 * 입금 리스트 카운트
	 * @param param
	 * @return
	 */
	public int getAdvertiseBankDepositCount(DataMap param);

	/**
	 * 입금 정보 상세
	 * @param param
	 * @return
	 */
	public DataMap getAdvertiseBankDepositInfo(DataMap param);

	/**
	 * 입금 맵핑 광고 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> advertiseSearch(DataMap param);

	/**
	 * 광고 무통장 입금 등록
	 * @param param
	 */
	public void insertAdvertiseBankDeposit(DataMap param);

	/**
	 * 광고 무통장 입금 수정
	 * @param param
	 */
	public int updateAdvertiseBankDeposit(DataMap param);

	/**
	 * 무통장 입금 삭제
	 * @param param
	 */
	public int deleteAdvertiseBankDeposit(DataMap param);

	/**
	 * 입금 맵핑 확인
	 * @param param
	 */
	public int checkDepositMapping(DataMap param);

	/**
	 * 무통장 입금 이력 등록
	 * @param param
	 */
	public void insertAdvertiseBankDepositHist(DataMap param);

	/**
	 * 이미 맵핑 되어 있는 광고인지 체크
	 * @param param
	 * @return
	 */
	public int checkAlreadyAdvertiseDeposit(DataMap param);

	/**
	 * 광고 입금 완료 처리
	 * @param param
	 * @return
	 */
	public int updateAdvertiseDeposit(DataMap param);

	/**
	 * 광고 입금 완료 취소 처리
	 * @param param
	 * @return
	 */
	public int updateAdvertiseDepositMappgingCancel(DataMap param);


	/**
	 * 무통장 입금 광고랑 맵핑 처리
	 * @param param
	 * @return
	 */
	public int updateAdvertiseDepositMappging(DataMap param);


	/**
	 * 광고 요청 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> advertiseReqList(DataMap param);

	/**
	 * 광고 요청 카운트
	 * @param param
	 * @return
	 */
	public int advertiseReqTotCount(DataMap param);

	/**
	 * 광고 요청 상세
	 * @param param
	 * @return
	 */
	public DataMap advertiseReqDetail(DataMap param);


	/**
	 * 광고 요청 지역 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> advertiseReqLocalList(DataMap param);


	/**
	 * 등록된 광고 월별 가격 리스트
	 * @return
	 */
	public List<DataMap> hakwonRegMonthPriceList(DataMap param);

	/**
	 * 광고 중지 및 활성화
	 * @param param
	 * @return
	 */
	public int updateAdvertiseStop(DataMap param);
}