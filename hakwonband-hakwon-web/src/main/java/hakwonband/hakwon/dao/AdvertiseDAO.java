package hakwonband.hakwon.dao;

import java.util.List;

import hakwonband.util.DataMap;

/**
 * 광고 DAO
 * @author bumworld.kim
 *
 */
public interface AdvertiseDAO {


	/**
	 * 광고 요청 등록
	 * @param param
	 */
	public long insertAdvertiseReq(DataMap param);

	/**
	 * 광고 요청 가격 등록
	 * @param param
	 * @return
	 */
	public int updateAdvertiseReqPrice(DataMap param);

	/**
	 * 광고 요청 수정
	 * @param param
	 * @return
	 */
	public int updateAdvertiseReq(DataMap param);

	/**
	 * 광고 취소
	 * @param param
	 * @return
	 */
	public int updateAdvertiseReqCancel(DataMap param);

	/**
	 * 광고 지역 등록
	 * @param param
	 */
	public void insertAdvertiseLocal(List<DataMap> paramList);

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
	 * 광고 동 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> regDongBannerList(DataMap param);

	/**
	 * 학원 광고 동 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonRegDongBannerList(DataMap param);

	/**
	 * 월 베너 가격
	 * @return
	 */
	public List<DataMap> monthBannerPrice(List<DataMap> monthList);

	/**
	 * 광고 요청 지불 정보 등록
	 * @param payList
	 */
	public void insertAdvertiseReqPayInfo(List<DataMap> payList);

	/**
	 * 등록된 광고 월별 가격 리스트
	 * @return
	 */
	public List<DataMap> hakwonRegMonthPriceList(DataMap param);


}