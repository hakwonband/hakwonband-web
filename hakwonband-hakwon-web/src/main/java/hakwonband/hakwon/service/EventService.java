package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.dao.CommonDAO;
import hakwonband.hakwon.dao.EventDAO;
import hakwonband.hakwon.dao.FileDAO;
import hakwonband.hakwon.dao.HakwonDAO;
import hakwonband.hakwon.dao.ReadDAO;
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;
import hakwonband.util.DateUtil;

/**
 * 이벤트 서비스
 * @author bumworld
 *
 */
@Service
public class EventService {

	public static final Logger logger = LoggerFactory.getLogger(EventService.class);

	@Autowired
	private EventDAO eventDAO;

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private ReadDAO readDAO;

	@Autowired
	private HakwonDAO hakwonDAO;

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private FileService fileService;


	/**
	 * 이벤트 리스트
	 * @param param
	 * @return
	 */
	public DataMap eventList(DataMap param) {
		DataMap colData = new DataMap();

		List<DataMap> eventList = eventDAO.eventList(param);
		colData.put("eventList", eventList);

		int eventCount = eventDAO.eventListTotCount(param);
		colData.put("eventCount", eventCount);

		return colData;
	}

	/**
	 * 이벤트 상세
	 * @param param
	 * @return
	 */
	public DataMap eventInfo(DataMap param) {
		DataMap colData = new DataMap();

		/**
		 * 이벤트 상세
		 */
		DataMap eventInfo = eventDAO.eventDetail(param);
		colData.put("eventInfo", eventInfo);

		/**
		 * 이벤트 파일 리스트
		 */
		param.put("file_parent_type", CommonConstant.File.TYPE_EVENT);
		param.put("file_parent_no", param.getString("event_no"));
		List<DataMap> fileList = fileDAO.fileList2(param);
		colData.put("fileList", fileList);


		/*	이벤트 참여자 리스트	*/
		List<DataMap> eventMemberList = eventDAO.eventMemberList(param);
		colData.put("eventMemberList", eventMemberList);


		/* 상세확인시, 기존 읽은상태정보 체크 */
		int resultReadCount = readDAO.contentReadCount(param);
		int resultInsert = 0;

		if (resultReadCount == 0) {
			/* 읽은 컨텐츠로 등록 */
			resultInsert = readDAO.insertContentRead(param);
			if (resultInsert != 1) {
				throw new HKBandException("ReadDAO.insertContentRead error");
			}
		}
		colData.put("insertContentRead", 	resultInsert);

		return colData;
	}

	/**
	 * 학원 이벤트 상세정보
	 * @param param
	 * @return
	 */
	public DataMap procEventDetail(DataMap param) {
		logger.debug("procEventDetail param["+param+"]");

		/* 이벤트 상세정보 */
		DataMap eventDetail = eventDAO.eventDetail(param);

		/* 이벤트 참여자 리스트 및 카운트 */
		List<DataMap> eventJoinUserList = eventDAO.eventJoinUserList(param);
		int eventJoinUserListTotCount 	= eventDAO.eventJoinUserListTotCount(param);

		/* 이벤트 관련 파일 리스트 및 카운트 */
		List<DataMap> fileList 	= fileDAO.fileList(param);

		DataMap resultObj = new DataMap();
		resultObj.put("eventDetail",				eventDetail);
		resultObj.put("eventJoinUserList",			eventJoinUserList);
		resultObj.put("eventJoinUserListTotCount",	eventJoinUserListTotCount);
		resultObj.put("fileList",					fileList);

		return resultObj;
	}

	/**
	 * 학원 이벤트 등록
	 * @param param
	 * @return
	 */
	public DataMap registHakwonEvent(DataMap param) {
		logger.debug("registHakwonEvent param["+param+"]");

		DevicePushData devicePushData = null;

		/* 이벤트 등록 */
		int resultInsert = eventDAO.eventInsert(param);

		/* 이벤트 번호를 파일 부모번호로 입력 */
		long eventNo = param.getLong("idx");
		param.put("file_parent_no", eventNo);

		/* 이벤트 파일정보들 업데이트 */
		DataMap updateFile = new DataMap();
		if( param.isNotNull("file_no_list") ) {
			updateFile = fileService.updateFile(param);
		}

		DataMap hakwonInfo = hakwonDAO.hakwonSimpleDetail(param);
		String hakwon_no = param.getString("hakwon_no");

		/*	시작일	*/
		String beginDateStr = param.getString("begin_date");
		int beginDate = Integer.parseInt(beginDateStr.replaceAll("-", ""));

		/*	오늘 날짜	*/
		int nowDate = Integer.parseInt(DateUtil.getDate(DateUtil.yyyyMMdd));
		/**
		 * 금일 15시 30분 전에는 발송을 안하고 15시 30분 이후에는 직접 발송을 한다.
		 */
		int currentTime = Integer.parseInt(DateUtil.getDate("HHmm"));

		/*	금일 시작일에 현재 시간이 15:30분 이후면 발송한다. 	*/
		if( nowDate == beginDate && currentTime > 1530 ) {
			/*	직접 발송한다.	*/
			List<UserDevice> deviceList = commonDAO.hakwonMemberDeviceList(param);
			if( deviceList != null && deviceList.size() > 0 ) {
				PushMessage pushMessage = new PushMessage();
				pushMessage.setTicker("학원밴드");
				pushMessage.setTitle(hakwonInfo.getString("hakwon_name")+" [이벤트] " + param.getString("event_title"));
				pushMessage.setContent("["+param.getString("event_title")+ "] 이벤트를 시작 했습니다.");
				pushMessage.setLink_url("https://m.hakwonband.com/index.do#/hakwon/eventDetail?hakwon_no="+hakwon_no+"&event_no="+eventNo+"&prev_page=list");

				devicePushData = new DevicePushData(pushMessage, deviceList);
			}

			/*	발송 했다고 업데이트	*/
/*
			param.put("event_no", eventNo);
			int checkCount = eventDAO.eventPushSendUpdate(param);
			if( checkCount != 1 ) {
				throw new HKBandException("eventPushSendUpdate fail["+checkCount+"]");
			}
*/
		}

		DataMap resultObj = new DataMap();
		resultObj.put("flag", 				CommonConstant.Flag.success);
		resultObj.put("eventNo", 			eventNo);
		resultObj.put("eventInsert", 		resultInsert);
		resultObj.put("resultUpdateFile",	updateFile.get("resultUpdateFile"));
		resultObj.put("updateFileCount",	updateFile.get("updateFileCount"));
		resultObj.put("devicePushData", 	devicePushData);

		return resultObj;
	}

	/**
	 * 학원 이벤트 수정
	 * @param param
	 * @return
	 */
	public DataMap editHakwonEvent(DataMap param) {
		logger.debug("editHakwonEvent param["+param+"]");

		/*	이벤트 정보 수정	*/
		int resultUpdate = eventDAO.eventUpdate(param);
		if (resultUpdate != 1) {
			throw new HKBandException("EventDAO.evnetUpdate error");
		}

		/**
		 * 이벤트 파일 수정
		 * 1. 기존 파일 모두 unUsingUpdate 하고
		 * 2. 남은 파일을 다시 UsingUpdate 한다.
		 */
		DataMap fileParam = new DataMap();
		fileParam.put("file_parent_no",		param.getString("event_no"));
		fileParam.put("file_parent_type",	CommonConstant.File.TYPE_EVENT);
		fileParam.put("reg_user_no",		param.getString("user_no"));
		fileDAO.unUsingUpdate(fileParam);

		/*	남은 파일들을 다시 사용 상태로 업데이트	*/
		if( param.isNotNull("file_no_list") ) {
			fileParam.put("file_no_list",		param.getString("file_no_list"));
			fileDAO.usingUpdate(fileParam);
		}

		DataMap resultObj = new DataMap();
		resultObj.put("flag", CommonConstant.Flag.success);
		resultObj.put("eventUpdate", resultUpdate);

		return resultObj;
	}

	/**
	 * 학원 이벤트 상태 삭제로 변경
	 * @param param
	 * @return
	 */
	public DataMap deleteHakwonEvent(DataMap param) {
		logger.debug("deleteHakwonEvent param["+param+"]");

		DataMap resultObj = new DataMap();

		/*	이벤트 참여자 카운트	*/
		int memberCount = eventDAO.eventMemberCount(param);
		if( memberCount > 0 ) {
			resultObj.put("flag", CommonConstant.Flag.exist);
		} else {
			int resultDelete = eventDAO.eventDelete(param);
			if (resultDelete != 1) {
				throw new HKBandException("EventDAO.eventDelete error");
			}
			resultObj.put("flag", CommonConstant.Flag.success);
			resultObj.put("eventDelete", resultDelete);
		}
		return resultObj;
	}
}