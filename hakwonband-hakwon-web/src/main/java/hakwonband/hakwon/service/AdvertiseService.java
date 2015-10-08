package hakwonband.hakwon.service;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.dao.AdvertiseDAO;
import hakwonband.hakwon.dao.CommonDAO;
import hakwonband.hakwon.dao.FileDAO;
import hakwonband.util.DataMap;
import hakwonband.util.DateUtil;
import hakwonband.util.StringUtil;

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

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private CommonDAO commonDAO;

	/**
	 * 월별, 베너 크기별 가격 리스트
	 * @return
	 */
	public DataMap advertiseMonthPrice() {

		/**
		 * 베너 크기별 기본 가격
		 */
		DataMap defaultPriceMap = defaultBannerPrice();

		/**
		 * 조회 할 월별 베너 리스트
		 */
		List<DataMap> monthListParam = new ArrayList<DataMap>();

		int currentYear = Integer.parseInt(DateUtil.getDate("yyyy"));
		int currentMonth = Integer.parseInt(DateUtil.getDate("MM"));
		for(int i=0; i<12; i++) {
			String currentYearMonth = currentYear+""+(currentMonth>9?currentMonth:"0"+currentMonth);
			for(int j=1; j<=4; j++) {
				DataMap tempMap = new DataMap();
				tempMap.put("adMonth",		currentYearMonth);
				tempMap.put("bannerSize",	j);
				monthListParam.add(tempMap);
			}
			if( currentMonth == 12 ) {
				currentYear++;
				currentMonth = 1;
			} else {
				currentMonth++;
			}
		}

		/*	등록되어 있는 월별 베너 크기별 가격	*/
		DataMap priceListMap = monthBannerPrice(monthListParam);

		/*	전체 가격 정보	*/
		DataMap monthBannerPrice = new DataMap();
		for(int i=0; i<monthListParam.size(); i++) {
			DataMap monthData = monthListParam.get(i);
			String adMonth	= monthData.getString("adMonth");
			int bannerSize	= monthData.getInt("bannerSize");

			String priceKey = adMonth+"_"+bannerSize;

			int price = 0;
			String priceStr = priceListMap.getString(priceKey);
			if( StringUtil.isBlank(priceStr) ) {
				if( bannerSize == 1 ) {
					price = defaultPriceMap.getInt("1");
				} else if( bannerSize == 2 ) {
					price = defaultPriceMap.getInt("2");
				} else if( bannerSize == 3 ) {
					price = defaultPriceMap.getInt("3");
				} else if( bannerSize == 4 ) {
					price = defaultPriceMap.getInt("4");
				}
			} else {
				price = Integer.parseInt(priceStr);
			}

			monthBannerPrice.put(priceKey, price);
		}

		return monthBannerPrice;
	}

	/**
	 * 베너 크기별 기본 가격
	 * @return
	 */
	public DataMap defaultBannerPrice() {
		String defaultPriceStr = commonDAO.selectConfigVal("advertise_default_price");
		DataMap defaultPriceMap = null;
		try {
			defaultPriceMap = (new ObjectMapper()).readValue(defaultPriceStr, DataMap.class);
		} catch (Exception e) {
			throw new HKBandException("Price Parsing Error : " + defaultPriceStr);
		}
		int defaultPrice_1 = Integer.parseInt(defaultPriceMap.getString("1"));
		int defaultPrice_2 = Integer.parseInt(defaultPriceMap.getString("2"));
		int defaultPrice_3 = Integer.parseInt(defaultPriceMap.getString("3"));
		int defaultPrice_4 = Integer.parseInt(defaultPriceMap.getString("4"));
		if( defaultPrice_1 < 0 || defaultPrice_2 < 0 || defaultPrice_3 < 0 || defaultPrice_4 < 0 ) {
			throw new HKBandException("Default Price Fail : " + defaultPriceStr);
		}

		return defaultPriceMap;
	}

	/**
	 * 등록되어 있는 월별, 베너 크기별 가격 리스트
	 * @param monthListParam
	 * @return
	 */
	private DataMap monthBannerPrice(List<DataMap> monthListParam) {
		/*	등록된 월별 베너별 가격 리스트	*/
		List<DataMap> priceList = advertiseDAO.monthBannerPrice(monthListParam);
		DataMap priceListMap = new DataMap();
		for(int i=0; i<priceList.size(); i++) {
			DataMap tempMap = priceList.get(i);
			priceListMap.put(tempMap.getString("adMonth")+"_"+tempMap.getString("bannerSize"), tempMap.getString("price"));
		}
		return priceListMap;
	}

	/**
	 * 광고 등록
	 * @param param
	 */
	public long registAdvertise(DataMap param) {
		logger.debug("registAdvertise param["+param+"]");

		/*	입금 계좌 정보	*/
		String bankInfo = commonDAO.selectConfig("advertise_bank_info");
		param.put("bankInfo", bankInfo);


		/*	요청 등록	*/
		advertiseDAO.insertAdvertiseReq(param);
		long advertiseReqNo = param.getLong("id");

		/*	선택 광고 데이타	*/
		String [] selectAdDataArray = (String [])param.get("selectAdDataArray");

		/*	광고 데이타 리스트	*/
		List<DataMap> adDataList = new ArrayList<DataMap>();

		/*	선택 월 목록을 뽑기 위한 map	*/
		DataMap adMonthMap = new DataMap();

		/*	베너 싸이즈	*/
		int bannerSize = Integer.parseInt(param.getString("bannerSize"));

		/*	광고 데이타	*/
		for(int i=0; i<selectAdDataArray.length; i++) {
			String [] adDataArray = selectAdDataArray[i].split(CommonConstant.ChDiv.CH_DEL);

			String viewMonth = adDataArray[1].replaceAll("-", "");

			DataMap adData = new DataMap();
			adData.put("advertiseReqNo",advertiseReqNo);
			adData.put("viewMonth",		viewMonth);
			adData.put("sido",			param.getString("sido"));
			adData.put("gugun",			param.getString("gugun"));
			adData.put("dong",			adDataArray[0]);
			adData.put("bannerSize",	bannerSize);

			/*	viewMonthCount는 몇개의 동이 선택되어 있는지 체크 하기 위해서	*/
			int viewMonthCount = adMonthMap.getInt(viewMonth, 0);
			viewMonthCount++;
			adMonthMap.put(viewMonth, viewMonthCount);

			adDataList.add(adData);
		}

		/**
		 * 베너 크기별 기본 가격
		 */
		DataMap defaultPriceMap = defaultBannerPrice();

		/**
		 * 결제 금액 계산
		 */

		/*	월별 가격 셋팅	*/
		List<String> adMonthList = adMonthMap.getKeyList();
		List<DataMap> adMonthListParam = new ArrayList<DataMap>();
		for(int i=0; i<adMonthList.size(); i++) {
			String viewMonth = adMonthList.get(i);
			DataMap tempMap = new DataMap();
			tempMap.put("adMonth",		viewMonth);
			tempMap.put("bannerSize",	bannerSize);

			adMonthListParam.add(tempMap);
		}

		/*	등록되어 있는 월별/베너 크기별 가격	*/
		DataMap priceListMap = monthBannerPrice(adMonthListParam);

		/*	전체 가격 정보	*/
		DataMap monthPriceMap = new DataMap();
		for(int i=0; i<adMonthList.size(); i++) {
			String adMonth = adMonthList.get(i);

			int price = 0;
			String priceStr = priceListMap.getString(adMonth+"_"+bannerSize);
			if( StringUtil.isBlank(priceStr) ) {
				if( bannerSize == 1 ) {
					price = defaultPriceMap.getInt("1");
				} else if( bannerSize == 2 ) {
					price = defaultPriceMap.getInt("2");
				} else if( bannerSize == 3 ) {
					price = defaultPriceMap.getInt("3");
				} else if( bannerSize == 4 ) {
					price = defaultPriceMap.getInt("4");
				}
			} else {
				price = Integer.parseInt(priceStr);
			}

			monthPriceMap.put(adMonth, price);
		}

		/*	전체 가격	*/
		int totalPrice = 0;
		for(int i=0; i<selectAdDataArray.length; i++) {
			String [] adDataArray = selectAdDataArray[i].split(CommonConstant.ChDiv.CH_DEL);

			String viewMonth = adDataArray[1].replaceAll("-", "");

			int thisPrice = Integer.parseInt(monthPriceMap.getString(viewMonth));
			totalPrice += thisPrice;
		}
		logger.debug("totalPrice["+totalPrice+"]");


		/*	월별 가격 정보 등록	*/
		List<DataMap> payList = new ArrayList<DataMap>();
		for(int i=0; i<adMonthList.size(); i++) {
			String viewMonth = adMonthList.get(i);

			DataMap payInfo = new DataMap();
			payInfo.put("advertiseReqNo", advertiseReqNo);
			payInfo.put("viewMonth", viewMonth);
			payInfo.put("bannerSize", bannerSize);
			payInfo.put("price", monthPriceMap.getString(viewMonth));
			payInfo.put("dongCount", adMonthMap.getString(viewMonth));
			payInfo.put("totalPrice", adMonthMap.getInt(viewMonth)*monthPriceMap.getInt(viewMonth));	//	월별 지역 카운트 * 가격 = 월 전체 가격
			payList.add(payInfo);
		}
		advertiseDAO.insertAdvertiseReqPayInfo(payList);

		/*	가격 업데이트	*/
		DataMap priceMap = new DataMap();
		priceMap.put("advertiseReqNo", advertiseReqNo);
		priceMap.put("totalPrice", totalPrice);
		priceMap.put("regUserNo", param.getString("regUserNo"));
		int priceUpdateCount = advertiseDAO.updateAdvertiseReqPrice(priceMap);
		if( priceUpdateCount != 1 ) {
			throw new HKBandException("price update fail["+priceUpdateCount+"]" + priceMap);
		}


		/*	지역 및 월 등록	*/
		advertiseDAO.insertAdvertiseLocal(adDataList);

		/*	파일 사용하도록 업데이트	*/
		DataMap fileMap = new DataMap();
		fileMap.put("file_parent_no", advertiseReqNo);
		fileMap.put("file_no_list", param.getInt("bannerFileNo"));
		fileMap.put("reg_user_no", param.getString("regUserNo"));

		int updateCnt = fileDAO.usingUpdate(fileMap);
		if( updateCnt != 1 ) {
			throw new HKBandException("베너 정보 업데이트 실패");
		}

		return advertiseReqNo;
	}

	/**
	 * 광고 수정
	 * @param param
	 */
	public void updateAdvertise(DataMap param) {
		logger.debug("updateAdvertise param["+param+"]");

		/*	기존 요청 정보	*/
		param.put("reqNo", param.getString("advertiseReqNo"));
		DataMap oldAdInfo = advertiseDAO.advertiseReqDetail(param);

		/*	요청 수정	*/
		int updateCnt = advertiseDAO.updateAdvertiseReq(param);
		if( updateCnt != 1 ) {
			throw new HKBandException("베너 정보 업데이트 실패");
		}

		if( oldAdInfo.equals("banner_file_no", param.getInt("bannerFileNo")) ) {
			/*	기존 번호와 같으면 업데이트 안한다.	*/
			logger.info("기존 베너와 동일");
		} else {
			/*	기존 파일 사용 불가 처리	*/
			DataMap delFileMap = new DataMap();
			delFileMap.put("file_no", oldAdInfo.getString("banner_file_no"));
			fileDAO.deleteFile(param);

			/*	파일 사용하도록 업데이트	*/
			DataMap fileMap = new DataMap();
			fileMap.put("file_parent_no", param.getString("advertiseReqNo"));
			fileMap.put("file_no_list", param.getInt("bannerFileNo"));
			fileMap.put("reg_user_no", param.getString("regUserNo"));

			updateCnt = fileDAO.usingUpdate(fileMap);
			if( updateCnt != 1 ) {
				throw new HKBandException("베너 정보 업데이트 실패");
			}
		}
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
		param.put("reqNo", reqDetail.getString("advertise_req_no"));
		List<DataMap> advertiseReqLocalList = advertiseDAO.advertiseReqLocalList(param);
		reqDetail.put("advertiseReqLocalList", advertiseReqLocalList);

		/*	월별 가격 리스트	*/
		List<DataMap> monthPriceList = advertiseDAO.hakwonRegMonthPriceList(param);
		reqDetail.put("monthPriceList", monthPriceList);

		return reqDetail;
	}

	/**
	 * 광고 요청 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> advertiseReqList(DataMap param) {
		return advertiseDAO.advertiseReqList(param);
	}

	/**
	 * 광고 요청 카운트
	 * @param param
	 * @return
	 */
	public int advertiseReqTotCount(DataMap param) {
		return advertiseDAO.advertiseReqTotCount(param);
	}

	/**
	 * 지역 등록된 광고 리스트
	 * @param param
	 * @return
	 */
	public DataMap localRegBannerList(DataMap param) {

		DataMap colData = new DataMap();

		/*	등록된 동 광고 리스트	*/
		List<DataMap> regDongBannerList = advertiseDAO.regDongBannerList(param);

		/*	등록된 학원 동 광고 리스트	*/
		List<DataMap> hakwonRegDongBannerList = advertiseDAO.hakwonRegDongBannerList(param);

		colData.put("regDongBannerList",		regDongBannerList);
		colData.put("hakwonRegDongBannerList",	hakwonRegDongBannerList);

		return colData;
	}

	/**
	 * 광고 취소
	 * @param param
	 */
	public void executeAdvertiseCancel(DataMap param) {

		int updateCnt = advertiseDAO.updateAdvertiseReqCancel(param);
		if( updateCnt != 1 ) {
			throw new HKBandException("베너 취소 업데이트 실패");
		}
	}
}