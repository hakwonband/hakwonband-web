package hakwonband.hakwon.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.dao.CommonDAO;
import hakwonband.hakwon.dao.FileDAO;
import hakwonband.hakwon.dao.HakwonDAO;
import hakwonband.hakwon.dao.NoticeDAO;
import hakwonband.hakwon.dao.ReadDAO;
import hakwonband.hakwon.dao.ReplyDAO;
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.push.PushMessage;
import hakwonband.push.UserDevice;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 공지 서비스
 * @author bumworld
 *
 */
@Service
public class NoticeService {

	public static final Logger logger = LoggerFactory.getLogger(NoticeService.class);

	@Autowired
	private NoticeDAO noticeDAO;

	@Autowired
	private FileService fileService;

	@Autowired
	private FileDAO fileDAO;

	@Autowired
	private ReplyDAO replyDAO;

	@Autowired
	private ReadDAO readDAO;

	@Autowired
	private CommonDAO commonDAO;

	@Autowired
	private HakwonDAO hakwonDAO;

	/**
	 * 공지사항 목록 조회
	 * @param param
	 * @return
	 */
	public DataMap noticeList(DataMap param) {
		DataMap noticeMap = new DataMap();

		List<DataMap> noticeList = noticeDAO.noticeList(param);
		int noticeCount	= noticeDAO.noticeListTotCount(param);

		noticeMap.put("noticeList", noticeList);
		noticeMap.put("noticeCount", noticeCount);
		noticeMap.put("page_scale", param.getString("page_scale"));

		return noticeMap;
	}

	/**
	 * 공지사항 상세
	 * @param param
	 * @return
	 */
	public DataMap noticeDetail(DataMap param) {

		logger.debug("param", param);

		DataMap noticeDetail = noticeDAO.noticeDetail(param);

		/* 공지사항 댓글 리스트 조회 */
		List<DataMap> replyList = replyDAO.replyList(param);

		/**
		 * 공지사항 파일 리스트 조회
		 * 기본 공지의 파일 조회 및 공유받은 공지의 파일도 같이 조회.
		 */
		List<DataMap> fileList = new ArrayList<DataMap>();
		fileList.addAll(fileDAO.fileList(param));

		if( noticeDetail.isNotNull("rel_notice_no") && noticeDetail.isNotNull("share_no") ) {
			DataMap fileParam = new DataMap();
			fileParam.put("file_parent_type", param.getString("file_parent_type"));
			fileParam.put("file_parent_no", noticeDetail.getString("rel_notice_no"));

			fileList.addAll(fileDAO.fileList(fileParam));
		}

		/* 상세확인시, 기존 읽은상태정보 체크 */
		int resultReadCount = readDAO.contentReadCount(param);
		int resultInsert = 0;

		if (resultReadCount == 0) {
			/* 읽은 컨텐츠로 등록 */
			resultInsert = readDAO.insertContentRead(param);
			if (resultInsert != 1) {
				throw new HKBandException("ReadDAO.insertContentRead error [" + resultInsert + "],[" + param + "]");
			}
		}

		DataMap resultObj = new DataMap();
		if( noticeDetail.equals("notice_type", "003") ) {
			/*	반 공지는 읽은 상태 리스트 가져온다.	*/

			DataMap readerParam = new DataMap();
			readerParam.put("class_no", noticeDetail.getString("notice_parent_no"));
			readerParam.put("notice_no", noticeDetail.getString("notice_no"));
			List<DataMap> classNoticeReaderList = noticeDAO.classNoticeReaderList(readerParam);
			resultObj.put("classNoticeReaderList",		classNoticeReaderList);
		}

		resultObj.put("result",				CommonConstant.Flag.success);
		resultObj.put("noticeDetail",		noticeDetail);
		resultObj.put("replyList",			replyList);
		resultObj.put("fileList",			fileList);
		resultObj.put("insertContentRead", 	resultInsert);

		return resultObj;
	}

	/**
	 * 공지사항 등록
	 * @param param
	 * @return
	 */
	public DevicePushData registNotice(DataMap param) {
		logger.debug("registNotice param["+param+"]");

		if( param.isNotNull("reservationDate") && param.isNotNull("reservationTime") ) {
			param.put("reservationDate",	param.getString("reservationDate") + " " + param.getString("reservationTime"));
			param.put("reservationYn",		"Y");
		} else {
			param.put("reservationYn",		"N");
			param.put("reservationDate",	null);
		}

		DevicePushData devicePushData = null;

		/* 공지사항 등록 */
		int resultInsert = noticeDAO.noticeInsert(param);

		if (resultInsert != 1) {
			throw new HKBandException("NoticeDAO.resultInsert error [" + resultInsert + "],[" + param + "]");
		}

		/* 공지사항 번호를 파일 부모번호로 입력 */
		long noticeNo = param.getLong("idx");
		param.put("file_parent_no", noticeNo);

		/* 공지사항 파일정보들 업데이트 */
		DataMap updateFile = new DataMap();
		if (StringUtil.isNotBlank( (String)param.get("file_no_list") )) {
			updateFile = fileService.updateFile(param);
		}

		/**
		 * 알림 전송
		 */
		if( param.equals("mobile_push_yn", "Y") && (param.equals("notice_type", "002") || param.equals("notice_type", "003")) ) {
			/*	002 : 학원, 003 : 클래스	*/

			List<UserDevice> deviceList = null;
			PushMessage pushMessage = new PushMessage();
			if( param.equals("notice_type", "002") ) {
				String hakwonNo	= param.getString("notice_parent_no");

				if( param.equals("reservationYn", "N") ) {
					if( param.isNull("target_user") ) {
						deviceList = commonDAO.hakwonMemberDeviceList(hakwonNo);
					} else if( param.equals("target_user", HakwonConstant.UserType.STUDENT) ) {
						deviceList = commonDAO.hakwonMemberStudentParentDeviceList(hakwonNo, HakwonConstant.UserType.STUDENT);
					} else if( param.equals("target_user", HakwonConstant.UserType.PARENT) ) {
						deviceList = commonDAO.hakwonMemberStudentParentDeviceList(hakwonNo, HakwonConstant.UserType.PARENT);
					}
				}

				DataMap hakwonInfo = hakwonDAO.hakwonSimpleDetail(hakwonNo);
				String title = "[전체공지] " + hakwonInfo.getString("hakwon_name")+ " " + param.getString("title");

				pushMessage.setTicker("학원밴드");
				pushMessage.setTitle(title);
				pushMessage.setIos_title(title);
				pushMessage.addCustomParam("hakwonNo", hakwonInfo.getString("hakwon_no"));
				pushMessage.setLink_url("https://m.hakwonband.com/notice.do?hakwon_no="+hakwonInfo.getString("hakwon_no")+"&notice_no="+noticeNo);
			} else if( param.equals("notice_type", "003") ) {
				String classNo	= param.getString("notice_parent_no");

				if( param.equals("reservationYn", "N") ) {

					if( param.isNull("target_user") ) {
						/*	전체	*/

						/**
						 * 학생
						 */
						deviceList = commonDAO.classStudentDeviceList(classNo);

						/**
						 * 학부모 디바이스 리스트
						 */
						List<UserDevice> parentDeviceList = commonDAO.classParentDeviceList(classNo);
						if( parentDeviceList != null && parentDeviceList.size() > 0 ) {
							deviceList.addAll(parentDeviceList);
						}

						/**
						 * 선생님 리스트
						 */
						List<UserDevice> teacherDeviceList = commonDAO.classTeacherDeviceList(classNo);
						if( teacherDeviceList != null && teacherDeviceList.size() > 0 ) {
							deviceList.addAll(teacherDeviceList);
						}

					} else if( param.equals("target_user", HakwonConstant.UserType.STUDENT) ) {
						/*	학생	*/
						deviceList = commonDAO.classStudentDeviceList(classNo);
					} else if( param.equals("target_user", HakwonConstant.UserType.PARENT) ) {
						/*	학부모	*/
						deviceList = commonDAO.classParentDeviceList(classNo);
					}
				}

				DataMap classInfo = hakwonDAO.classSimpleDetail(classNo);
				String title = "[반공지] " + classInfo.getString("hakwon_name")+" " + param.getString("title");

				pushMessage.setTicker("학원밴드");
				pushMessage.setTitle(title);
				pushMessage.setIos_title(title);
				pushMessage.addCustomParam("hakwonNo", classInfo.getString("hakwon_no"));
				pushMessage.addCustomParam("classNo", classInfo.getString("class_no"));
				pushMessage.setLink_url("https://m.hakwonband.com/notice.do?hakwon_no="+classInfo.getString("hakwon_no")+"&class_no="+classInfo.getString("class_no")+"&notice_no="+noticeNo);
			}

			if( deviceList != null && deviceList.size() > 0 ) {
				pushMessage.setContent(param.getString("title"));
				pushMessage.setImage_url("");

				devicePushData = new DevicePushData(pushMessage, deviceList);
			}
		}

		return devicePushData;
	}

	/**
	 * 학원, 반 공지사항 수정
	 * @param param
	 * @return
	 */
	public DataMap editNotice(DataMap param) {
		logger.debug("editNotice param["+param+"]");

		if( param.isNotNull("reservationDate") && param.isNotNull("reservationTime") ) {
			param.put("reservationDate",	param.getString("reservationDate") + " " + param.getString("reservationTime"));
			param.put("reservationYn",		"Y");
		} else {
			param.put("reservationYn",		"N");
			param.put("reservationDate",	null);
		}

		/* 공지사항 변경 */
		int resultUpdate = noticeDAO.noticeUpdate(param);
		if (resultUpdate != 1) {
			throw new HKBandException("NoticeDAO.noticeUpdate error [" + resultUpdate + "],[" + param + "]");
		}

		/**
		 * 공지사항 파일 수정
		 * 1. 기존 파일 모두 unUsingUpdate 하고
		 * 2. 남은 파일을 다시 UsingUpdate 한다.
		 */
		int usingFiles		= 0;

		DataMap fileParam = new DataMap();
		fileParam.put("file_parent_no",		param.getString("notice_no"));
		fileParam.put("file_parent_type",	CommonConstant.File.TYPE_NOTICE);
		fileParam.put("reg_user_no",		param.getString("user_no"));
		fileParam.put("user_type",			param.getString("user_type"));
		int unUsingFiles = fileDAO.unUsingUpdate(fileParam);
		if (param.isNotNull("file_no_list")) {
			/*	남은 파일들을 다시 사용 상태로 업데이트	*/
			fileParam.put("file_no_list",		param.getString("file_no_list"));
			usingFiles = fileDAO.usingUpdate(fileParam);
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result", 		CommonConstant.Flag.success);
		resultObj.put("noticeUpdate", 	resultUpdate);
		resultObj.put("unUsingFiles", 	unUsingFiles);
		resultObj.put("usingFiles", 	usingFiles);
		return resultObj;
	}

	/**
	 * 학원, 반 공지사항 삭제
	 * @param param
	 * @return
	 */
	public DataMap deleteNotice(DataMap param) {
		logger.debug("deleteNotice param["+param+"]");

		/* 반공지사항 상태 삭제로 변경 */
		int resultDelete = noticeDAO.noticeDelete(param);

		if (resultDelete != 1) {
			throw new HKBandException("NoticeDAO.noticeDelete error [" + resultDelete + "],[" + param + "]");
		}

		DataMap resultObj = new DataMap();
		resultObj.put("result", CommonConstant.Flag.success);
		resultObj.put("noticeDelete", resultDelete);

		return resultObj;
	}
}