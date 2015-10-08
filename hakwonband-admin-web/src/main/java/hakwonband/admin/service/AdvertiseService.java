package hakwonband.admin.service;

import hakwonband.admin.common.exception.AlreadyAdvertiseDepositException;
import hakwonband.admin.dao.AdvertiseDAO;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 광고 서비스
 * @author bumworld
 *
 */
@Service
public class AdvertiseService {

	public static final Logger logger = LoggerFactory.getLogger(AdvertiseService.class);

	@Autowired
	private AdvertiseDAO advertiseDAO;


	/**
	 * 입금 리스트
	 * @param param
	 * @return
	 */
	public DataMap getAdvertiseBankDepositList(DataMap param) {
		DataMap colData = new DataMap();

		/*	입금 리스트	*/
		List<DataMap> bankDepositList = advertiseDAO.getAdvertiseBankDepositList(param);
		colData.put("bankDepositList",	bankDepositList);

		/*	입금 전체 카운트	*/
		int bankDepositCount = advertiseDAO.getAdvertiseBankDepositCount(param);
		colData.put("bankDepositCount",	bankDepositCount);

		return colData;
	}

	/**
	 * 입금 정보 상세
	 * @param param
	 * @return
	 */
	public DataMap getAdvertiseBankDepositInfo(DataMap param) {
		return advertiseDAO.getAdvertiseBankDepositInfo(param);
	}

	/**
	 * 입금 맵핑 광고 검색
	 * @param param
	 * @return
	 */
	public List<DataMap> advertiseSearch(DataMap param) {
		return advertiseDAO.advertiseSearch(param);
	}

	/**
	 * 광고 무통장 입금 등록
	 * @param param
	 */
	public long insertAdvertiseBankDeposit(DataMap param) {
		advertiseDAO.insertAdvertiseBankDeposit(param);
		long depositNo = param.getLong("id");

		param.put("depositNo",	depositNo);

		/*	광고 맵핑되어 있으면 맵핑정보 업데이트	*/
		if( param.isNotNull("advertiseReqNo") ) {

			/*	광고 입금 완료 처리	*/
			int checkUpdate = advertiseDAO.updateAdvertiseDeposit(param);
			if( checkUpdate != 1 ) {
				throw new HKBandException("updateAdvertiseDeposit count error["+checkUpdate+"]");
			}

			/*	입금 맵핑 처리	*/
			checkUpdate = advertiseDAO.updateAdvertiseDepositMappging(param);
			if( checkUpdate != 1 ) {
				throw new HKBandException("updateAdvertiseDepositMappging count error["+checkUpdate+"]");
			}
		}

		/*	무통장 입금 이력 등록	*/
		advertiseDAO.insertAdvertiseBankDepositHist(param);

		return depositNo;
	}

	/**
	 * 입금 맵핑
	 * @param param
	 */
	public void updateAdvertiseDepositMappging(DataMap param) {

		/*	이미 맵핑되어 있는 광고 인지 체크	*/
		int checkAlreadyCount = advertiseDAO.checkAlreadyAdvertiseDeposit(param);
		if( checkAlreadyCount != 0 ) {
			throw new AlreadyAdvertiseDepositException();
		}

		/*	광고 입금 완료 처리	*/
		int checkUpdate = advertiseDAO.updateAdvertiseDeposit(param);
		if( checkUpdate != 1 ) {
			throw new HKBandException("updateAdvertiseDeposit count error["+checkUpdate+"]");
		}

		/*	입금 맵핑 처리	*/
		checkUpdate = advertiseDAO.updateAdvertiseDepositMappging(param);
		if( checkUpdate != 1 ) {
			throw new HKBandException("updateAdvertiseDepositMappging count error["+checkUpdate+"]");
		}
	}

	/**
	 * 입금 맵핑 취소
	 * @param param
	 */
	public void updateAdvertiseDepositMappgingCancel(DataMap param) {
		/*	광고 입금 취소 처리	*/
		int checkUpdate = advertiseDAO.updateAdvertiseDeposit(param);
		if( checkUpdate != 1 ) {
			throw new HKBandException("updateAdvertiseDeposit count error["+checkUpdate+"]");
		}

		/**
		 * 입금 맵핑 취소 처리
		 */
		checkUpdate = advertiseDAO.updateAdvertiseDepositMappgingCancel(param);
		if( checkUpdate != 1 ) {
			throw new HKBandException("updateAdvertiseDepositMappgingCancel count error["+checkUpdate+"]");
		}
	}

	/**
	 * 광고 무통장 입금 수정
	 * @param param
	 */
	public void updateAdvertiseBankDeposit(DataMap param) {
		int checkUpdate = advertiseDAO.updateAdvertiseBankDeposit(param);
		if( checkUpdate != 1 ) {
			throw new HKBandException("updateAdvertiseBankDeposit count error["+checkUpdate+"]");
		}
		/*	무통장 입금 이력 등록	*/
		advertiseDAO.insertAdvertiseBankDepositHist(param);
	}

	/**
	 * 광고 무통장 입금 삭제
	 * @param param
	 */
	public void deleteAdvertiseBankDeposit(DataMap param) {

		/*	이미 맵핑되어 있는 광고 인지 체크	*/
		int checkAlreadyCount = advertiseDAO.checkDepositMapping(param);
		if( checkAlreadyCount != 0 ) {
			throw new AlreadyAdvertiseDepositException();
		}

		/*	무통장 입금 이력 등록(삭제 이력 먼저 등록한다.)	*/
		param.put("deleteYn",	"Y");
		advertiseDAO.insertAdvertiseBankDepositHist(param);

		int checkCount = advertiseDAO.deleteAdvertiseBankDeposit(param);
		if( checkCount != 1 ) {
			throw new HKBandException("deleteAdvertiseBankDeposit count error["+checkCount+"]");
		}
	}

	/**
	 * 광고 요청 상세
	 * @param param
	 * @return
	 */
	public DataMap advertiseReqDetail(DataMap param) {
		return advertiseDAO.advertiseReqDetail(param);
	}

	/**
	 * 광고 요청 리스트
	 * @param param
	 * @return
	 */
	public DataMap advertiseReqList(DataMap param) {
		DataMap colData = new DataMap();

		logger.debug("advertiseReqList param : " + param);

		/*	요청 리스트	*/
		List<DataMap> advertiseReqList = advertiseDAO.advertiseReqList(param);
		colData.put("advertiseReqList",	advertiseReqList);

		/*	요청 카운트	*/
		int advertiseReqCount = advertiseDAO.advertiseReqTotCount(param);
		colData.put("advertiseReqCount",	advertiseReqCount);

		return colData;
	}

	/**
	 * 요청 상세 정보
	 * @param param
	 * @return
	 */
	public DataMap reqDetailData(DataMap param) {

		DataMap reqDetail = advertiseDAO.advertiseReqDetail(param);
		if( reqDetail == null ) {
			return null;
		}
		List<DataMap> advertiseReqLocalList = advertiseDAO.advertiseReqLocalList(param);
		reqDetail.put("advertiseReqLocalList", advertiseReqLocalList);

		/*	월별 가격 리스트	*/
		List<DataMap> monthPriceList = advertiseDAO.hakwonRegMonthPriceList(param);
		reqDetail.put("monthPriceList", monthPriceList);

		return reqDetail;
	}

	/**
	 * 요청 중지
	 * @param param
	 * @return
	 */
	public DataMap bannerStop(DataMap param) {

		DataMap reqDetail = advertiseDAO.advertiseReqDetail(param);

		if( reqDetail.equals("stop_admin_yn", "Y") ) {
			/*	활성화(현재 중지 상태)	*/
			param.put("stopAdminYn", "N");
		} else {
			/*	중지 처리(현재 중지 상태 아니다.)	*/
			param.put("stopAdminYn", "Y");
		}

		/**
		 * 상태 업데이트
		 */
		int checkCount = advertiseDAO.updateAdvertiseStop(param);
		if( checkCount != 1 ) {
			throw new HKBandException("updateAdvertiseStop fail");
		}
		param.put("flag", CommonConstant.Flag.success);

		return param;
	}
}