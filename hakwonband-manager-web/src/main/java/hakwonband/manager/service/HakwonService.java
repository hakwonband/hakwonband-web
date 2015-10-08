package hakwonband.manager.service;

import hakwonband.api.PushSend;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.manager.dao.AdvertiseDAO;
import hakwonband.manager.dao.CommonDAO;
import hakwonband.manager.dao.FileDAO;
import hakwonband.manager.dao.HakwonDAO;
import hakwonband.manager.model.DevicePushData;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 학원 서비스
 * @author bumworld
 *
 */
@Service
public class HakwonService {

	public static final Logger logger = LoggerFactory.getLogger(HakwonService.class);

	@Autowired
	private HakwonDAO hakwonDAO;

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private AdvertiseDAO advertiseDAO;

	@Autowired
	private FileDAO fileDAO;

	/**
	 * 학원 카테고리 리스트
	 * @return
	 */
	public List<DataMap> hakwonCateList() {
		return hakwonDAO.hakwonCateList();
	}

	/**
	 * 학원 리스트
	 * @return
	 */
	public DataMap hakwonList(DataMap param) {
		DataMap colData = new DataMap();

		/*	학원 리스트	*/
		List<DataMap> hakwonList = hakwonDAO.hakwonList(param);
		colData.put("hakwonList",	hakwonList);

		int hakwonCount = hakwonDAO.hakwonCount(param);
		colData.put("hakwonCount",	hakwonCount);

		/*	보여줄 월 리스트	*/
		List<String> showMonthList = commonDAO.showMonthList();
		colData.put("showMonthList",	showMonthList);

		return colData;
	}

	/**
	 * 학원 상세 정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonDetail(DataMap param) {
		DataMap colData = new DataMap();

		/**
		 * 학원 상세 정보
		 */
		DataMap hakwonInfo = hakwonDAO.hakwonInfo(param);
		colData.put("hakwonInfo", hakwonInfo);

		/**
		 * 반년 월 리스트
		 */
		List<String> show6MonthList = commonDAO.show6MonthList();
		colData.put("show6MonthList",	show6MonthList);

		/**
		 * 최근 6개월 금액 리스트
		 */
		List<DataMap> sixMonthAmountList = advertiseDAO.sixMonthAmount(param);
		colData.put("sixMonthAmountList",	sixMonthAmountList);

		return colData;
	}

	/**
	 * 학원 소개 introduction 정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonIntroDetail(DataMap param) {
		logger.debug("hakwonIntroDetail param["+param+"]");

		/*	학원상세정보	*/
		DataMap hakwonDetail = hakwonDAO.hakwonInfo(param);

		/*	학원소개 파일 리스트 조회	*/
		List<DataMap> fileList = fileDAO.fileList(param);

		DataMap resultObj = new DataMap();
		resultObj.put("hakwonInfo",			hakwonDetail);
		resultObj.put("fileList",			fileList);
		return resultObj;
	}


	/**
	 * 학원 소개 미리보기 등록
	 * @param param
	 * @return
	 */
	public DataMap insertPreviewIntro(DataMap param) {

		DataMap rtnMap = new DataMap();

		hakwonDAO.insertPreviewIntro(param);
		long previewNo = param.getLong("id");


		List<UserDevice> deviceList = commonDAO.getUserDeviceToken(param);

		PushMessage pushMessage = new PushMessage();
		pushMessage.setTicker("학원밴드 입니다.");
		pushMessage.setTitle("학원 소개 미리보기 정보 입니다.");
		pushMessage.setLink_url("https://m.hakwonband.com/preview.do?preview_no="+previewNo);

		DevicePushData devicePushData = new DevicePushData(pushMessage, deviceList);
		rtnMap.put("devicePushData", devicePushData);
		rtnMap.put("previewNo", previewNo);

		return rtnMap;
	}

	/**
	 * 학원 소개 수정 및 등록
	 * @param param
	 * @return
	 */
	public DataMap updateHakwonIntro(DataMap param) {
		logger.debug("updateMasterHakwonIntro param["+param+"]");

		/*	학원소개 수정	*/
		int resultInt = hakwonDAO.updateHakwonIntro(param);
		if (resultInt != 1)
			throw new HKBandException("MasterDAO masterUpdateHakwonIntro error [" + resultInt + "],[" + param + "]");

		/**
		 * 학원소개 파일 수정
		 * 1. 기존 파일 모두 unUsingUpdate 하고
		 * 2. 남은 파일을 다시 UsingUpdate 한다.
		 */
		int updateFiles = 0;
		if (param.isNotNull("file_no_list")) {
			DataMap fileParam = new DataMap();
			fileParam.put("file_parent_no",		param.getString("hakwon_no"));
			fileParam.put("file_parent_type",	CommonConstant.File.TYPE_INTRODUCTION);
			fileParam.put("reg_user_no",		param.getString("user_no"));
			fileDAO.unUsingUpdate(fileParam);

			/*	남은 파일들을 다시 사용 상태로 업데이트	*/
			fileParam.put("file_no_list",		param.getString("file_no_list"));
			updateFiles = fileDAO.usingUpdate(fileParam);
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result", 					CommonConstant.Flag.success);
		resultObj.put("masterUpdateHakwonIntro",	resultInt);
		resultObj.put("updateFiles", 	updateFiles);

		return resultObj;
	}
}