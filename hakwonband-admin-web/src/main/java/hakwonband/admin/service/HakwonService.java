package hakwonband.admin.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.admin.dao.CommonDAO;
import hakwonband.admin.dao.FileDAO;
import hakwonband.admin.dao.HakwonCateDAO;
import hakwonband.admin.dao.HakwonDAO;
import hakwonband.admin.dao.ManagerDAO;
import hakwonband.admin.dao.MessageSendDAO;
import hakwonband.admin.model.DevicePushData;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

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
	private FileDAO fileDAO;

	@Autowired
	private HakwonCateDAO hakwonCateDAO;

	@Autowired
	private MessageSendDAO messageSendDAO;

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private ManagerDAO managerDAO;

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

		return colData;
	}

	/**
	 * 학원 등록
	 * @param param
	 * @return
	 */
	public long insertHakwon(DataMap param) {

		/*	학원 등록	*/
		hakwonDAO.insertHakwon(param);
		long hakwonNo = param.getLong("id");
		param.put("hakwonNo",	hakwonNo);

		/*	정보 등록	*/
		hakwonDAO.insertHakwonInfo(param);

		/*	주소 등록	*/
		hakwonDAO.insertHakwonAddress(param);

		if( hakwonDAO.hakwonAddressCheck(param) != 1 ) {
			throw new HKBandException("주소 등록 오류["+param+"]");
		}

		return hakwonNo;
	}

	/**
	 * 학원 수정
	 * @param param
	 * @return
	 */
	public void modifyHakwon(DataMap param) {

		/*	학원 수정	*/
		int checkCnt = hakwonDAO.modifyHakwon(param);
		if( checkCnt != 1 ) {
			throw new HKBandException("checkCoutError["+checkCnt+"]["+param+"]");
		}

		/*	정보 수정	*/
		checkCnt = hakwonDAO.modifyHakwonInfo(param);
		if( checkCnt != 1 ) {
			throw new HKBandException("checkCoutError["+checkCnt+"]["+param+"]");
		}

		/*	주소 삭제	*/
		checkCnt = hakwonDAO.deleteHakwonAddress(param);
		if( checkCnt != 1 ) {
			throw new HKBandException("checkCoutError["+checkCnt+"]["+param+"]");
		}

		/*	주소 등록	*/
		hakwonDAO.insertHakwonAddress(param);
	}

	/**
	 * 학원 삭제
	 * @param param
	 * @return
	 */
	public void adminDelete(DataMap param) {
		/*	학원 삭제	*/
		int checkCnt = hakwonDAO.deleteHakwon(param);
		if( checkCnt != 1 ) {
			throw new HKBandException("checkCoutError["+checkCnt+"]["+param+"]");
		}

		/*	정보 정보 삭제	*/
		checkCnt = hakwonDAO.deleteHakwonInfo(param);
		if( checkCnt != 1 ) {
			throw new HKBandException("checkCoutError["+checkCnt+"]["+param+"]");
		}

		/*	주소 삭제	*/
		checkCnt = hakwonDAO.deleteHakwonAddress(param);
		if( checkCnt != 1 ) {
			throw new HKBandException("checkCoutError["+checkCnt+"]["+param+"]");
		}
	}

	/**
	 * 학원 수정 정보
	 * @param param
	 * @return
	 */
	public DataMap hakwonModifyInfo(DataMap param) {
		DataMap colData = new DataMap();

		/**
		 * 학원 카테고리 리스트
		 */
		List<DataMap> hakwonCateList = hakwonCateDAO.hakwonCateList();
		colData.put("hakwonCateList", hakwonCateList);

		/**
		 * 학원 상세 정보
		 */
		DataMap hakwonInfo = hakwonDAO.hakwonInfo(param);
		colData.put("hakwonInfo", hakwonInfo);

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
		 * 매니저 정보
		 */
		DataMap managerInfo = managerDAO.hakwonManagerInfo(param);
		colData.put("managerInfo", managerInfo);

		return colData;
	}

	/**
	 * 학원 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonClassList(DataMap param) {
		return hakwonDAO.hakwonClassList(param);
	}

	/**
	 * 학원 상세 업데이트
	 * @param param
	 * @return
	 */
	public DevicePushData executeHakwonStatus(DataMap param) {
		DevicePushData devicePushData = null;

		int updateCnt = hakwonDAO.hakwonStatusUpdate(param);
		if( updateCnt != 1 ) {
			throw new HKBandException("executeHakwonStatus Update Count Fail["+updateCnt+"]["+param+"]");
		}

		/*	학원 정보	*/
		DataMap hakwonInfo = hakwonDAO.hakwonInfo(param);
		String masterUserNo = hakwonInfo.getString("master_user_no");

		/*	메세지 발송	*/
		String messageContent = param.getString("message");

		DataMap messageMap = new DataMap();
		String title = "학원["+hakwonInfo.getString("hakwon_name") + "] 상태가 관리자에 의해 변경되었습니다.";
		String preview_content = "";
		if( messageContent.length() > 20 ) {
			preview_content = messageContent.substring(0, 20);
		} else {
			preview_content = messageContent;
		}
		messageMap.put("title", title);
		messageMap.put("preview_content", preview_content);
		messageMap.put("content", messageContent.replaceAll(CommonConstant.LINE_SEPARATOR, "<br/>"));
		messageMap.put("send_user_no", param.getString("userNo"));
		messageMap.put("group_yn", "N");
		messageMap.put("messageType", "single");

		messageSendDAO.messageInsert(messageMap);
		long messageNo = messageMap.getLong("idx");

		/*	받는 사용자 등록	*/
		DataMap receiverMap = new DataMap();
		receiverMap.put("message_no",		messageNo);
		if( param.equals("status", "001") ) {
			/*	인증	*/
			receiverMap.put("hakwon_no",		hakwonInfo.getString("hakwon_no"));
		} else if( param.equals("status", "002") ) {
			/*	관리자 미인증 처리	*/
			receiverMap.put("hakwon_no",		"-1");
		} else if( param.equals("status", "003") ) {
			/*	관리자 중지	*/
			receiverMap.put("hakwon_no",		"-1");
		}
		receiverMap.put("receive_user_no",	masterUserNo);
		messageSendDAO.messageReceiverSingleInsert(receiverMap);

		/*	push 전송	*/
		/**
		 * 디바이스 리스트 조회
		 */
		DataMap searchParam = new DataMap();
		searchParam.put("searchUserNoArray", masterUserNo);
		List<UserDevice> deviceList = messageSendDAO.searchUserDeviceToken(searchParam);

		/**
		 * 메세지 발송 처리
		 */
		logger.info("executeHakwonStatus deviceList["+deviceList+"]");
		if( deviceList != null && deviceList.size() > 0 ) {
			PushMessage pushMessage = new PushMessage();
			pushMessage.setTicker("학원밴드 입니다.");
			pushMessage.setTitle(title);
			if( param.equals("status", "001") ) {
				/*	인증	*/
				pushMessage.setContent("확원이 인증 상태로 변경되었습니다.");
				pushMessage.addCustomParam("hakwonNo", hakwonInfo.getString("hakwon_no"));
			} else if( param.equals("status", "002") ) {
				/*	관리자 중지	*/
				pushMessage.setContent("학원이 관리자에 의해 미인증 되었습니다.");
				pushMessage.addCustomParam("hakwonNo", "-1");
			} else if( param.equals("status", "003") ) {
				/*	관리자 중지	*/
				pushMessage.setContent("학원이 관리자에 의해 중지 되었습니다.");
				pushMessage.addCustomParam("hakwonNo", "-1");
			}

			pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo=-1");

			devicePushData = new DevicePushData(pushMessage, deviceList);
		}

		return devicePushData;
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

		rtnMap.put("devicePushData",devicePushData);
		rtnMap.put("previewNo",		previewNo);

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