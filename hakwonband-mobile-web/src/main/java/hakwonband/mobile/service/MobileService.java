
package hakwonband.mobile.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.mobile.dao.CommonDAO;
import hakwonband.mobile.dao.EventDAO;
import hakwonband.mobile.dao.FileDAO;
import hakwonband.mobile.dao.MessageDAO;
import hakwonband.mobile.dao.MobileDAO;
import hakwonband.mobile.dao.NoticeDAO;
import hakwonband.mobile.dao.ReadDAO;
import hakwonband.mobile.dao.ReplyDAO;
import hakwonband.mobile.dao.UserDAO;
import hakwonband.mobile.model.DevicePushData;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

/**
 * 회원 서비스
 * @author jrlim
 *
 */
@Service
public class MobileService {

	public static final Logger logger = LoggerFactory.getLogger(MobileService.class);

	@Autowired
	private MobileDAO mobileDAO;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private NoticeDAO noticeDAO;

	@Autowired
	private ReplyDAO replyDAO;

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private ReadDAO readDAO;

	@Autowired
	private EventDAO eventDAO;

	@Autowired
	private MessageDAO messageDAO;

	@Autowired
	private CommonDAO commonDAO;

	/**
	 * 학원 검색
	 * @param param
	 * @return
	 */
	public DataMap getHakwonSearch(DataMap param) {
		List<DataMap> resultList = mobileDAO.hakwonSearch(param);
		DataMap result = new DataMap();
		result.put("result", resultList);
		return result;
	}

	/**
	 * 학원 검색 리스트
	 * @param param
	 * @return
	 */
	public DataMap getHakwonSearchList(DataMap param) {
		DataMap result = new DataMap();
		List<DataMap> resultList = mobileDAO.hakwonSearchList(param);
		result.put("resultData", resultList);

		int resultCount = mobileDAO.hakwonSearchListCount(param);
		result.put("totalCount", resultCount);

		result.put("pageScale", param.get("page_scale"));

		return result;
	}

	/**
	 * 사용자 학원 리스트
	 * @param param
	 * @return
	 */
	public DataMap userHakwonList(DataMap param) {

		DataMap hakwonInfo = new DataMap();

		/*	학원 리스트	*/
		List<DataMap> hakwonList = mobileDAO.userHakwonList(param);
		hakwonInfo.put("hakwonList",	hakwonList);

		/*	전체 학원 반 리스트	*/
		if( HakwonConstant.UserType.STUDENT.equals(param.getString("user_type")) ) {
			/*	본인이 속한 반 리스트	*/
			List<DataMap> hakwonClassList = mobileDAO.allHakwonClassList(param);
			hakwonInfo.put("hakwonClassList",	hakwonClassList);
		} else if( HakwonConstant.UserType.PARENT.equals(param.getString("user_type")) ) {
			/*	자식이 속한 반 리스트	*/
			List<DataMap> hakwonClassList = mobileDAO.childHakwonClassList(param);
			hakwonInfo.put("hakwonClassList",	hakwonClassList);
		} else {
			throw new HKBandException("executeHakwonMemberOut User Type Fail");
		}
		return hakwonInfo;
	}

	/**
	 * 학원, 반 공지사항 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> noticeReqList(DataMap param) {
		logger.debug("noticeReqList param["+param+"]");

		return noticeDAO.noticeReqList(param);
	}

	/**
	 * 학원, 반 공지사항 리스트 카운트
	 * @param param
	 * @return
	 */
	public int noticeReqListTotCount(DataMap param) {
		logger.debug("noticeReqListTotCount param["+param+"]");

		return noticeDAO.noticeReqListTotCount(param);
	}

	/**
	 * 학원, 반 공지사항 상세정보
	 * @param param
	 * @return
	 */
	public DataMap procNoticeDetail(DataMap param) {
		logger.debug("procNoticeDetail param["+param+"]");

		/* 공지사항 상세정보 조회 */
		DataMap noticeDetail = noticeDAO.noticeDetail(param);

		/* 공지사항 댓글 리스트 조회 */
		List<DataMap> replyList = replyDAO.replyList(param);

		/* 공지사항 파일 리스트 조회 */
		List<DataMap> fileList = fileDAO.fileList(param);

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

		DataMap resultObj = new DataMap();
		resultObj.put("noticeDetail",		noticeDetail);
		resultObj.put("replyList",			replyList);
		resultObj.put("fileList",			fileList);
		resultObj.put("insertContentRead",	resultInsert);

		return resultObj;
	}

	/**
	 * 학원 이벤트 리스트 조회
	 * @param param
	 * @return
	 */
	public DataMap eventList(DataMap param) {
		DataMap eventData = new DataMap();

		List<DataMap> eventList = eventDAO.eventList(param);
		int eventListTotCount = eventDAO.eventListTotCount(param);

		eventData.put("eventList", eventList);
		eventData.put("eventListTotCount", eventListTotCount);

		return eventData;
	}

	/**
	 * 이벤트 추천 받은 리스트
	 * @param param
	 * @return
	 */
	public DataMap eventRecommendList(DataMap param) {
		DataMap eventData = new DataMap();

		List<DataMap> eventList = eventDAO.eventRecommendList(param);
		Integer eventListTotCount = eventDAO.eventRecommendListTotCount(param);

		eventData.put("eventList", eventList);
		if( eventListTotCount == null ) {
			eventData.put("eventListTotCount", 0);
		} else {
			eventData.put("eventListTotCount", eventListTotCount);
		}

		return eventData;
	}

	/**
	 * 학원 이벤트 상세정보
	 * @param param
	 * @return
	 */
	public DataMap procEventDetail(DataMap param) {
		logger.debug("procEventReqDetail param["+param+"]");

		/* 이벤트 상세정보 */
		DataMap eventDetail = eventDAO.eventDetail(param);

		/* 이벤트 관련 파일 리스트 및 카운트 */
		List<DataMap> fileList 	= fileDAO.fileList(param);


		DataMap resultObj = new DataMap();

		if( param.isNotNull("user_no") ) {
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

			List<DataMap> recommendUserList = eventDAO.eventRecommendUserList(param);
			resultObj.put("recommendUserList",		recommendUserList);
		}

		resultObj.put("eventDetail",				eventDetail);
		resultObj.put("fileList",					fileList);

		return resultObj;
	}

	/**
	 * 학원 이벤트 참여
	 * @param param
	 * @return
	 */
	public DataMap registJoinEvent(DataMap param) {
		logger.debug("registJoinEvent param["+param+"]");

		DataMap resultObj = new DataMap();

		long recommend_user_no = 0;
		if( param.isNotNull("recommend_user_id") ) {
			DataMap checkParam = new DataMap();
			checkParam.put("user_id", param.getString("recommend_user_id"));
			DataMap recommendUserInfo = userDAO.checkUserId(checkParam);

			if( recommendUserInfo == null || recommendUserInfo.getLong("user_no") < 1 ) {
				resultObj.put("resultJoinEvent",		"recommend_fail");
				return resultObj;
			} else {
				recommend_user_no = recommendUserInfo.getLong("user_no");
			}
		}

		/* 기존 이벤트 참여 확인 */
		int checkUser = eventDAO.eventUserCheck(param);

		if (checkUser != 0) {
			resultObj.put("resultJoinEvent",		CommonConstant.Flag.exist);
			resultObj.put("eventUserCheck",			checkUser);
			return resultObj;
		}

		/* 이벤트 참여 신청 */
		if( recommend_user_no > 0 ) {
			param.put("recommend_user_no",	recommend_user_no);
		}
		int resultUser = eventDAO.insertEventUser(param);
		if (resultUser != 1) {
			throw new HKBandException("eventDAO.insertEventUser error");
		}

		resultObj.put("resultJoinEvent",		CommonConstant.Flag.success);
		resultObj.put("insertEventUser",		resultUser);
		return resultObj;
	}

	/**
	 * 사용자 참여한 이벤트 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> eventMyJoinList(DataMap param) {
		logger.debug("eventMyJoinList param["+param+"]");

		return eventDAO.eventMyJoinList(param);
	}

	/**
	 * 사용자 참여한 이벤트 리스트 카운트
	 * @param param
	 * @return
	 */
	public int eventMyJoinListTotCount(DataMap param) {
		logger.debug("eventMyJoinListTotCount param["+param+"]");

		return eventDAO.eventMyJoinListTotCount(param);
	}

	/**
	 * 학원 가입을 한 학생 로그인 첫 화면
	 * @param param
	 * @return
	 */
	public DataMap userFirstView(DataMap param) {
		DataMap result = new DataMap();

		/**
		 * 사용자 학원 리스트
		 */
		List<DataMap> resultHakwonList = mobileDAO.userHakwonList(param);
		result.put("hakwonList", resultHakwonList);

		/**
		 * 학생의 학부모 승인 여부
		 */
		if( HakwonConstant.UserType.STUDENT.equals(param.getString("user_type")) ) {
			/*	승인 여부	*/
			List<DataMap> resultApprovedYn = mobileDAO.parentApprovedYn(param);
			result.put("approvedYnList", resultApprovedYn);
		}

		/**
		 * 메세지 리스트
		 */
		List<DataMap> resultMessage = messageDAO.newMessageList(param);
		result.put("messageList", resultMessage);

		/**
		 * 공지 리스트
		 */
		if( HakwonConstant.UserType.STUDENT.equals(param.getString("user_type")) ) {
			List<DataMap> resultNotis = noticeDAO.studentNoticeDashList(param);
			result.put("notisList", resultNotis);
		} else if( HakwonConstant.UserType.PARENT.equals(param.getString("user_type")) ) {
			List<DataMap> resultNotis = noticeDAO.parentNoticeDashList(param);
			result.put("notisList", resultNotis);
		}

		/**
		 * 이벤트 리스트
		 */
		List<DataMap> resultEvent = eventDAO.eventDashList(param);
		result.put("eventList", resultEvent);

		return result;
	}

	/**
	 * 학생 학부모 승인
	 * @param param
	 * @return
	 */
	public DataMap updateParentApproved(DataMap param) {
		DataMap result = new DataMap();

		DevicePushData devicePushData = null;

		int resultInt = 0;
		String approved = (String) param.get("approved");
		if (approved.equals("n")) {
			resultInt = mobileDAO.deleteParentApproved(param);
			result.put("resultInt", resultInt);
			result.put("approved", "no");


			DataMap tempParam = new DataMap();
			tempParam.put("reciveUserNo", param.getString("parent_user_no"));
			List<UserDevice> deviceList = commonDAO.getUserDeviceToken(tempParam);

			if( deviceList != null && deviceList.size() > 0 ) {
				PushMessage pushMessage = new PushMessage();
				pushMessage.setTicker("학원밴드 입니다.");
				pushMessage.setTitle(param.getString("user_name")+"님께서 메세지를 보냈습니다.");
				pushMessage.setIos_title(param.getString("user_name")+"님께서 학생 승인을 거절 하셨습니다.");
				pushMessage.setContent("학생 승인을 거절 하셨습니다.");
				pushMessage.setLink_url("https://m.hakwonband.com/#/userMain");

				devicePushData = new DevicePushData(pushMessage, deviceList);
				result.put("devicePushData", devicePushData);
			}
		}
		else {
			resultInt = mobileDAO.updateParentApproved(param);
			result.put("resultInt", resultInt);
			result.put("approved", "ok");
		}

		return result;
	}

	/**
	 * 학생 아이디 검색
	 * @param param
	 * @return
	 */
	public DataMap getStudentSearch(DataMap param) {
		DataMap result = new DataMap();

		DataMap resultMap = mobileDAO.studentSearch(param);
		result.put("studentData", resultMap);

		DataMap resultCheck = mobileDAO.selectCheckStudentParent(param);
		if (resultCheck != null) {
			String checkString = (String) resultCheck.get("approved_yn");
			if (checkString.equals("N"))
				result.put("status", "wait");
			else if (checkString.equals("Y"))
				result.put("status", "ok");
		}
		else
			result.put("status", "no");

		return result;
	}

	/**
	 * 학원 상세 정보
	 * @param param
	 * @return
	 */
	public DataMap getHakwonDetail(DataMap param) {
		DataMap result = new DataMap();


		DataMap resultHakwonDetail = mobileDAO.selectHakwonDetail(param);
		result.put("resultHakwonDetail", resultHakwonDetail);

		List<DataMap> resultEventList = eventDAO.eventList(param);
		result.put("resultEventList", resultEventList);

		DataMap selectMember = mobileDAO.selectHakwonMember(param);
		if (selectMember != null) {
			List<DataMap> resultNoticeList = noticeDAO.noticeReqList(param);
			result.put("resultNoticeList", resultNoticeList);
		}

		return result;
	}

	/**
	 * 학원 소개
	 * @param param
	 * @return
	 */
	public DataMap getSelectHakwonIntroduction(DataMap param) {
		return mobileDAO.selectHakwonIntroduction(param);
	}

	/**
	 * 학무모 신청
	 * @param param
	 * @return
	 */
	public DataMap insertParentApproved(DataMap param) {
		DataMap result = new DataMap();

		DevicePushData devicePushData = null;

		int resultInt = 0;
		resultInt = mobileDAO.insertParentApproved(param);
		if (resultInt != 1) {
			throw new HKBandException("MobileDao.insertParentApproved error");
		}

		/**
		 * 디바이스 리스트 조회
		 */
		param.put("receiveUserNo", param.getString("student_user_no"));
		List<UserDevice> deviceList = commonDAO.getUserDeviceTokenOne(param);
		if( deviceList != null && deviceList.size() > 0 ) {
			PushMessage pushMessage = new PushMessage();
			pushMessage.setTicker("학원밴드 입니다.");
			pushMessage.setTitle(param.getString("parent_user_name")+"님께서 학부모 신청을 했습니다.");
			pushMessage.setContent("승인해 주세요.");
			pushMessage.setLink_url("https://m.hakwonband.com/index.do#/userMain");
			devicePushData = new DevicePushData(pushMessage, deviceList);
			result.put("devicePushData", devicePushData);
		}

		result.put("resultInt", resultInt);

		return result;
	}

	/**
	 * 반상세정보
	 * @param param
	 * @return
	 */
	public DataMap getClassDetail(DataMap param) {
		logger.debug("getClassDetail param["+param+"]");

		DataMap result = new DataMap();

		List<DataMap> selectClassTeacherList = mobileDAO.selectClassTeacher(param);
		result.put("classTeacherList", selectClassTeacherList);

		DataMap selectClassDetail = mobileDAO.selectClassDetail(param);
		result.put("selectClassDetail", selectClassDetail);

		List<DataMap> selectNotice = noticeDAO.noticeReqList(param);
		result.put("selectNotice", selectNotice);

		return result;
	}

	/**
	 * 카테고리 네임
	 * @param param
	 * @return
	 */
	public DataMap getHakwonCateName(DataMap param) {
		DataMap result = new DataMap();
		List<DataMap> resultList = mobileDAO.selectHakwonCateName(param);
		result.put("resultCate", resultList);
		return result;
	}
}