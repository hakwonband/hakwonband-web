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
import hakwonband.hakwon.dao.MasterDAO;
import hakwonband.hakwon.dao.MessageSendDAO;
import hakwonband.hakwon.dao.NoticeDAO;
import hakwonband.hakwon.dao.ReadDAO;
import hakwonband.hakwon.dao.UserDAO;
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;

/**
 * 원장 서비스
 * @author jszzang9
 *
 */
@Service
public class MasterService {

	public static final Logger logger = LoggerFactory.getLogger(MasterService.class);

	@Autowired
	private MasterDAO masterDAO;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private NoticeDAO noticeDAO;

	@Autowired
	private EventDAO eventDAO;

	@Autowired
	private ReadDAO readDAO;

	@Autowired
	private FileService fileService;

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private ReplyService replyService;

	@Autowired
	private HakwonDAO hakwonDAO;

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private MessageSendDAO messageSendDAO;


	/**
	 * 원장 개인 상세정보
	 * @param param
	 * @return
	 */
	public DataMap masterReqDetail(DataMap param) {
		logger.debug("masterReqDetail param["+param+"]");

		return userDAO.userDetail(param);
	}

	/**
	 * 원장 정보 수정
	 * @param param
	 * @return
	 */
	public DataMap updateMasterInfo(DataMap param) {
		logger.debug("updateMasterInfo param["+param+"]");

		int resultUpdateUser = userDAO.updateUser(param);

		if (resultUpdateUser != 1) {
			throw new HKBandException("UserDAO.updateUser error");
		}

		int resultUpdateUserInfo = userDAO.updateUserInfo(param);

		if (resultUpdateUserInfo != 1) {
			throw new HKBandException("UserDAO.updateUserInfo error");
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result", 		CommonConstant.Flag.success);
		resultObj.put("updateUser", 	resultUpdateUser);
		resultObj.put("updateUserInfo",	resultUpdateUserInfo);

		return resultObj;
	}

	/**
	 * 미승인 학원 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> unauthorizedHakwonList(DataMap param) {
		return masterDAO.unauthorizedHakwonList(param);
	}

	/**
	 * 학원 반 검색 카운트(가입요청 포함)
	 * @param param
	 * @return
	 */
	public int getHakwonListCount(DataMap param) {
		return masterDAO.masterHakwonListCount(param);
	}

	/**
	 * 학원 등록
	 * @param param
	 * @return
	 */
	public long insertHakwon(DataMap param) {

		/*	학원 등록	*/
		masterDAO.insertHakwon(param);
		long hakwonNo = param.getLong("id");
		param.put("hakwonNo",	hakwonNo);

		/*	정보 등록	*/
		masterDAO.insertHakwonInfo(param);

		/*	주소 등록	*/
		masterDAO.insertHakwonAddress(param);

		return hakwonNo;
	}

	/**
	 * 학원 정보 수정(학원, 학원 정보, 학원 주소)
	 * @param param
	 * @return
	 */
	public DataMap updateMasterHakwonInfo(DataMap param) {
		int updateHakwon = 0;
		int updateHakwonInfo = 0;
		int deleteHakwonAddress = 0;
		int insertHakwonAddress = 0;

		updateHakwon = masterDAO.masterHakwonUpdate(param);
		if (updateHakwon != 1)
			throw new HKBandException("update Hakwon error ["+updateHakwon+"]["+param+"]");

		updateHakwonInfo = masterDAO.masterHakwonInfoUpdate(param);
		if (updateHakwonInfo != 1)
			throw new HKBandException("update HakwonInfo error ["+updateHakwonInfo+"]["+param+"]");

		/*	주소 삭제	*/
		deleteHakwonAddress = masterDAO.masterHakwonAddressDelete(param);
		if( deleteHakwonAddress != 1 ) {
			throw new HKBandException("delete HakwonAddress error ["+deleteHakwonAddress+"]["+param+"]");
		}

		/*	주소 재등록 */
		insertHakwonAddress = masterDAO.insertHakwonAddress(param);
		if (insertHakwonAddress != 1)
			throw new HKBandException("insert HakwonAddress error ["+insertHakwonAddress+"]["+param+"]");

		DataMap result = new DataMap();
		result.put("result",				CommonConstant.Flag.success);
		result.put("updateHakwon",			updateHakwon);
		result.put("updateHakwonInfo",		updateHakwonInfo);
		result.put("deleteHakwonAddress",	deleteHakwonAddress);
		result.put("insertHakwonAddress",	insertHakwonAddress);

		return result;
	};

	/**
	 * 학원 반 정보 등록
	 * @param param
	 * @return
	 */
	public DataMap insertMasterHakwonClass(DataMap param) {
		int resultInt = masterDAO.masterHakwonClassInsert(param);

		DataMap result = new DataMap();
		result.put("result", resultInt);

		return result;
	};

	/**
	 * 반 정보 수정
	 * @param param
	 * @return
	 */
	public DataMap updateClassInfo(DataMap param) {
		logger.debug("updateClassInfo param["+param+"]");

		int updateClassInfo = masterDAO.updateClassInfo(param);

		DataMap result = new DataMap();
		result.put("result",			CommonConstant.Flag.success);
		result.put("updateClassInfo",	updateClassInfo);

		return result;
	};

	/**
	 * 반 삭제
	 * @param param
	 * @return
	 */
	public DataMap deleteClass(DataMap param) {
		logger.debug("deleteClass param["+param+"]");

		DataMap resultObj = new DataMap();
		int deleteClass = 0;

		/*	반 소속의 선생님, 학생이 존재하는지 체크	*/
		int checkClassMemberCount = masterDAO.checkClassMemberCount(param);

		if (checkClassMemberCount != 0) {
			resultObj.put("result", CommonConstant.Flag.fail);
		} else {
			deleteClass = masterDAO.deleteClass(param);
			if (deleteClass != 1) {
				throw new HKBandException("MasterDAO.deleteClass error ["+deleteClass+"]["+param+"]");
			}
			resultObj.put("result", CommonConstant.Flag.success);
		}

		resultObj.put("checkClassMemberCount",	checkClassMemberCount);
		resultObj.put("deleteClass",			deleteClass);

		return resultObj;
	};

	/**
	 * 반에 선생님 등록
	 * @param param
	 * @return
	 */
	public DataMap insertClassTeacher(DataMap param) {
		int resultInt = masterDAO.insertClassTeacher(param);

		DataMap result = new DataMap();
		result.put("result", 				CommonConstant.Flag.success);
		result.put("insertClassTeacher",	resultInt);

		return result;
	};

	/**
	 * 반 소속 선생님 삭제
	 * @param param
	 * @return
	 */
	public DataMap deleteClassTeacher(DataMap param) {
		logger.debug("deleteClassTeacher param["+param+"]");

		int resultInt = masterDAO.deleteClassTeacher(param);
		if (resultInt != 1)
			throw new HKBandException("MasterDAO.deleteClassTeacher error, [" + resultInt + "], [" + param + "]");

		DataMap result = new DataMap();
		result.put("result", 				CommonConstant.Flag.success);
		result.put("deleteClassTeacher",	resultInt);

		return result;
	};

	/**
	 * 선생님 담당과목 변경
	 * @param param
	 * @return
	 */
	public DataMap updateTeacherSubject(DataMap param) {
		logger.debug("updateTeacherSubject param["+param+"]");

		int resultInt = masterDAO.masterUpdateTeacherSubject(param);
		if (resultInt != 1)
			throw new HKBandException("MasterDAO.updateTeacherSubject error [" + resultInt + "], [" + param + "]");

		DataMap result = new DataMap();
		result.put("result",						CommonConstant.Flag.success);
		result.put("masterUpdateTeacherOk",			resultInt);
		return result;
	}

	/**
	 * 학원 선생님 전체 목록
	 * @param param
	 * @return
	 */
	public DataMap getMasterHakwonTeacherList(DataMap param) {
		logger.debug("getMasterHakwonTeacherList param["+param+"]");

		List<DataMap> resultList = masterDAO.masterTeacherList(param);
		int resultInt = masterDAO.masterTeacherListCount(param);

		DataMap result = new DataMap();
		result.put("content", 	resultList);
		result.put("count", 	resultInt);

		return result;
	}

	/**
	 * 학원 선생님 검색 (반에 미등록된 선생님일 경우 체크)
	 * @param param
	 * @return
	 */
	public DataMap searchHakwonTeacherList(DataMap param) {
		logger.debug("searchHakwonTeacherList param["+param+"]");

		List<DataMap> searchTeacherList = masterDAO.searchTeacherList(param);
		int searchTeacherListTotCount 	= masterDAO.searchTeacherListTotCount(param);

		DataMap result = new DataMap();
		result.put("result",	CommonConstant.Flag.success);
		result.put("content", 	searchTeacherList);
		result.put("count", 	searchTeacherListTotCount);

		return result;
	}

	/**
	 * 학원 선생님 전체 목록 카운트(가입요청 포함)
	 * @param param
	 * @return
	 */
	public int getMasterHakwonTeacherListCount(DataMap param) {
		return masterDAO.masterTeacherListCount(param);
	}

	/**
	 * 학원 소개 수정 및 등록
	 * @param param
	 * @return
	 */
	public DataMap updateMasterHakwonIntro(DataMap param) {
		logger.debug("updateMasterHakwonIntro param["+param+"]");

		/*	학원소개 수정	*/
		int resultInt = masterDAO.masterUpdateHakwonIntro(param);
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

	/**
	 * 미승인 선생님 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> unauthorizedTeacherList(DataMap param) {
		return masterDAO.unauthorizedTeacherList(param);
	}

	/**
	 * 미승인 선생님 승인
	 * @param param
	 */
	public void executeApprovedTeacher(DataMap param) {

		int checkCount = 0;

		/*	사용자 승인 여부	*/
		String userApproved = userDAO.userApprovedCheck(param);
		if( "Y".equals(userApproved) == false ) {
			/*	선생님 회원가입 승인 처리	*/
			param.put("approvedYn",	"Y");
			checkCount = userDAO.approvedUserUpdate(param);
			if( checkCount != 1 ) {
				throw new HKBandException("approvedUserUpdate update count error");
			}

			checkCount = userDAO.approvedUserInfoUpdate(param);
			if( checkCount != 1 ) {
				throw new HKBandException("approvedUserInfoUpdate update count error");
			}
		}

		/*	선생님 학원 승인 처리	*/
		checkCount = masterDAO.teacherHakwonApproved(param);
		if( checkCount != 1 ) {
			throw new HKBandException("teacherHakwonApproved update count error");
		}

		/*	선생님 학원 등록	*/
		//masterDAO.teacherHakwonInsert(param);
	}

	/**
	 * 학원 반 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonClassList(DataMap param) {
		return masterDAO.hakwonClassList(param);
	}

	/**
	 * 학원 전체 리스트
	 * @param param
	 * @return
	 */
	public List<DataMap> hakwonAllList(DataMap param) {
		return masterDAO.masterHakwonAllList(param);
	}

	/**
	 * 선생님 탈퇴
	 * @param param
	 */
	public DevicePushData executeTeacherOut(DataMap param) {
		DevicePushData devicePushData = null;
		/**
		 * 학원에서 제외
		 */
		int delCnt = masterDAO.teacherHakwonDelete(param);
		if( delCnt != 1 ) {
			throw new HKBandException("teacherHakwonDelete fail delCnt["+delCnt+"]");
		}

		/**
		 * 반에서 제외
		 */
		delCnt = masterDAO.teacherClassDelete(param);
		logger.info("teacherClassDelete delCnt["+delCnt+"]");

		/*	선생님 번호	*/
		String teacherUserNo = param.getString("teacher_user_no");

		/*	학원 정보	*/
		DataMap hakwonInfo = hakwonDAO.hakwonSimpleDetail(param);

		/*	메세지 발송	*/
		String messageContent = param.getString("message");

		DataMap messageMap = new DataMap();
		String title = "학원["+hakwonInfo.getString("hakwon_name") + "]의 원장님께서 선생님을 탈퇴처리 했습니다.";
		String preview_content = "";
		if( messageContent.length() > 20 ) {
			preview_content = messageContent.substring(0, 20);
		} else {
			preview_content = messageContent;
		}
		messageMap.put("title", title);
		messageMap.put("preview_content", preview_content);
		messageMap.put("content", messageContent.replaceAll(CommonConstant.LINE_SEPARATOR, "<br/>"));
		messageMap.put("send_user_no", param.getString("user_no"));
		messageMap.put("group_yn", "N");
		messageMap.put("hakwon_no",		"-1");	//	학원에서 탈퇴되기 때문에 -1로 셋팅
		messageMap.put("messageType", "single");

		messageSendDAO.messageInsert(messageMap);
		long messageNo = messageMap.getLong("idx");

		/*	받는 사용자 등록	*/
		DataMap receiverMap = new DataMap();
		receiverMap.put("message_no",		messageNo);
		receiverMap.put("hakwon_no",		"-1");	//	학원에서 탈퇴되기 때문에 -1로 셋팅
		receiverMap.put("receive_user_no",	teacherUserNo);
		messageSendDAO.messageReceiverSingleInsert(receiverMap);

		/*	push 전송	*/
		/**
		 * 디바이스 리스트 조회
		 */
		DataMap searchParam = new DataMap();
		searchParam.put("searchUserNoArray", teacherUserNo);
		List<UserDevice> deviceList = messageSendDAO.searchUserDeviceToken(searchParam);

		/**
		 * 메세지 발송 처리
		 */
		logger.info("executeHakwonStatus deviceList["+deviceList+"]");
		if( deviceList != null && deviceList.size() > 0 ) {
			PushMessage pushMessage = new PushMessage();
			pushMessage.setTicker("학원밴드 입니다.");
			pushMessage.setTitle(title);
			pushMessage.setContent(title);
			pushMessage.addCustomParam("hakwonNo", "-1");
			pushMessage.setLink_url("https://m.hakwonband.com/message.do?hakwonNo=-1");

			devicePushData = new DevicePushData(pushMessage, deviceList);
		}

		return devicePushData;
	}
}