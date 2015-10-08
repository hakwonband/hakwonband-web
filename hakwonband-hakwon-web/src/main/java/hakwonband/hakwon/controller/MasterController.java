package hakwonband.hakwon.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.model.DevicePushData;
import hakwonband.hakwon.service.AsyncService;
import hakwonband.hakwon.service.EventService;
import hakwonband.hakwon.service.HakwonService;
import hakwonband.hakwon.service.MasterService;
import hakwonband.hakwon.service.NoticeService;
import hakwonband.util.DataMap;
import hakwonband.util.SecuUtil;
import hakwonband.util.StringUtil;
import net.logstash.logback.encoder.org.apache.commons.lang.RandomStringUtils;

/**
 * 학원 컨트롤러
 * @author bumworld, jszzang9
 *
 */
@RequestMapping("/hakwon/master")
@Controller
public class MasterController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(MasterController.class);


	@Autowired
	private MasterService masterService;

	@Autowired
	private HakwonService hakwonService;

	@Autowired
	private NoticeService noticeService;

	@Autowired
	private EventService eventService;

	@Autowired
	private AsyncService asyncService;


	/**
	 * 원장 개인정보 상세조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/masterReqDetail")
	public void masterReqDetail(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no", authUserInfo.getString("user_no"));

		/* 원장 개인 상세정보 조회 */
		DataMap colData = masterService.masterReqDetail(param);
		sendColData(colData, request, response);
	}

	/**
	 * 원장 개인정보 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/editMasterInfo")
	public void editMasterInfo(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo	= (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String user_email		= request.getParameter("user_email");
		String user_password	= request.getParameter("user_password");
		String user_name		= request.getParameter("user_name");
		String user_gender		= request.getParameter("user_gender");
		String user_birthday 	= request.getParameter("user_birthday");
		String tel1_no 			= request.getParameter("tel1_no");
		String tel2_no 			= request.getParameter("tel2_no");

		DataMap param = new DataMap();
		param.put("user_email",		user_email);
		if (StringUtil.isNotNull(user_password)) {
			param.put("user_password",	SecuUtil.sha256(user_password));
		}
		param.put("user_name", 		user_name);
		param.put("user_gender", 	user_gender);
		param.put("user_birthday", 	user_birthday);
		param.put("tel1_no", 		tel1_no);
		param.put("tel2_no", 		tel2_no);
		param.put("user_no", 		authUserInfo.get("user_no"));

		/* 원장 기본정보 및 부가정보 수정 */
		DataMap colData = masterService.updateMasterInfo(param);

		sendColData(colData, request, response);
	}

	/**
	 * 미승인 학원 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/unauthorizedHakwonList")
	public void masterList(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("master_user_no", authUserInfo.getString("user_no"));


		List<DataMap> hakwonList = masterService.unauthorizedHakwonList(param);

		sendList(hakwonList, request, response);
	}

	/**
	 * 학원 등록
	 * @param request
	 * @param response
	 * @param reqParam
	 */
	@RequestMapping("/regist")
	public void hakwonRegist(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("userNo",		authUserInfo.getString("user_no"));

		/*	관리자 등록 여부	*/
		param.put("adminRegYn", "Y");

		String oldAddr1		= StringUtil.replaceNull(request.getParameter("oldAddr1"), "");
		String oldAddr2		= StringUtil.replaceNull(request.getParameter("oldAddr2"), "");
		String streetAddr1	= StringUtil.replaceNull(request.getParameter("streetAddr1"), "");
		String streetAddr2	= StringUtil.replaceNull(request.getParameter("streetAddr2"), "");

		/**
		 * 학원 정보
		 */
		param.put("hakwonCode",	RandomStringUtils.randomAlphanumeric(10));
		param.put("hakwonCate",	request.getParameter("hakwonCate"));
		param.put("hakwonName",	request.getParameter("hakwonName"));
		param.put("telNo",		request.getParameter("telNo"));
		param.put("logoFileNo",	request.getParameter("logoFileNo"));

		param.put("addrNo",		request.getParameter("addrNo"));

		param.put("oldAddr1",	oldAddr1);
		param.put("oldAddr2",	oldAddr2);
		param.put("streetAddr1",	streetAddr1);
		param.put("streetAddr2",	streetAddr2);

		/*	모든 주소 텍스트 더한다.	*/
		param.put("allAddrText",	oldAddr1+oldAddr2+streetAddr1+streetAddr2);

		/*	학원 등록	*/
		long hakwonNo = masterService.insertHakwon(param);

		DataMap colData = new DataMap();
		colData.put("hakwonNo",	hakwonNo);

		sendColData(colData, request, response);
	}

	/**
	 * 원장 학원정보 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/masterHakwonUpdate")
	public void masterHakwonUpdate(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String old_addr1	= StringUtil.replaceNull(request.getParameter("old_addr1"), "");
		String old_addr2	= StringUtil.replaceNull(request.getParameter("old_addr2"), "");
		String street_addr1	= StringUtil.replaceNull(request.getParameter("street_addr1"), "");
		String street_addr2	= StringUtil.replaceNull(request.getParameter("street_addr2"), "");

		DataMap param = new DataMap();
		param.put("user_no", authUserInfo.getString("user_no"));

		param.put("hakwon_no",		request.getParameter("hakwon_no"));
		param.put("hakwon_cate",	request.getParameter("hakwon_cate"));
		param.put("hakwon_name",	request.getParameter("hakwon_name"));
		param.put("tel_no_1",		request.getParameter("tel_no_1"));
		param.put("tel_no_2",		request.getParameter("tel_no_2"));

		param.put("addrNo",			request.getParameter("addr_no"));

		param.put("hakwonNo",		request.getParameter("hakwon_no"));
		param.put("oldAddr1",		old_addr1);
		param.put("oldAddr2",		old_addr2);
		param.put("streetAddr1",	street_addr1);
		param.put("streetAddr2",	street_addr2);

		/*	모든 주소 텍스트 더한다.	*/
		param.put("allAddrText",	old_addr1+old_addr2+street_addr1+street_addr2);

		sendColData(masterService.updateMasterHakwonInfo(param), request, response);
	}

	/**
	 * 원장 반 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/masterHakwonClassInsert")
	public void masterHakwonClassInsert(HttpServletRequest request, HttpServletResponse response) {
		DataMap param = new DataMap();

		String[] params = {"hakwon_no", "class_title", "class_order", "class_intro"};
		for (String value:params)
			param.put(value, request.getParameter(value));

		sendColData(masterService.insertMasterHakwonClass(param), request, response);
	}

	/**
	 * 원장 반 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/classInfoUpdate")
	public void classInfoUpdate(HttpServletRequest request, HttpServletResponse response) {
		String class_no		= request.getParameter("class_no");
		String class_title	= request.getParameter("class_title");
		String class_intro	= request.getParameter("class_intro");

		DataMap	param = new DataMap();
		param.put("class_no", 		class_no);
		param.put("class_title",	class_title);
		param.put("class_intro",	class_intro);

		sendColData(masterService.updateClassInfo(param), request, response);
	}

	/**
	 * 원장 반 삭제
	 * @param request
	 * @param response
	 */
	@RequestMapping("/removeClass")
	public void removeClass(HttpServletRequest request, HttpServletResponse response) {
		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String hakwon_no	= request.getParameter("hakwon_no");
		String class_no		= request.getParameter("class_no");

		DataMap	param = new DataMap();
		param.put("hakwon_no", 		hakwon_no);
		param.put("class_no", 		class_no);
		param.put("master_user_no", authUserInfo.get("user_no"));

		sendColData(masterService.deleteClass(param), request, response);
	}

	/**
	 * 원장 반에 선생님 등록
	 * @param request
	 */
	@RequestMapping("/insertClassTeacher")
	public void masterHakwonClassTeacherInsert(HttpServletRequest request, HttpServletResponse response) {

		String hakwon_no		= request.getParameter("hakwon_no");
		String class_no			= request.getParameter("class_no");
		String teacher_user_no	= request.getParameter("teacher_user_no");

		DataMap param = new DataMap();
		param.put("hakwon_no",			hakwon_no);
		param.put("class_no",			class_no);
		param.put("teacher_user_no",	teacher_user_no);

		sendColData(masterService.insertClassTeacher(param), request, response);
	}

	/**
	 * 원장 반 소속 선생님 삭제
	 * @param request
	 * @param response
	 */
	@RequestMapping("/deleteClassTeacher")
	public void deleteClassTeacher(HttpServletRequest request, HttpServletResponse response) {
		/*	인증정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no		= request.getParameter("hakwon_no");
		String class_no			= request.getParameter("class_no");
		String teacher_user_no	= request.getParameter("teacher_user_no");

		DataMap param = new DataMap();
		param.put("hakwon_no",			hakwon_no);
		param.put("class_no",			class_no);
		param.put("teacher_user_no",	teacher_user_no);
		param.put("master_user_no",		authUserInfo.get("user_no"));

		sendColData(masterService.deleteClassTeacher(param), request, response);
	}

	/**
	 * 선생님 subject 변경
	 * @param request
	 * @param response
	 */
	@RequestMapping("/updateTeacherSubject")
	public void masterUpdateTeacherSubject(HttpServletRequest request, HttpServletResponse response) {
		String hakwon_no		= request.getParameter("hakwon_no");
		String teacher_user_no	= request.getParameter("teacher_user_no");
		String subject			= request.getParameter("subject");

		DataMap	param = new DataMap();
		param.put("hakwon_no",			hakwon_no);
		param.put("teacher_user_no",	teacher_user_no);
		param.put("subject",			subject);

		sendColData(masterService.updateTeacherSubject(param), request, response);
	}

	/**
	 * 학원 선생님 목록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/masterTeacherListAll")
	public void masterTeacherListAll(HttpServletRequest request, HttpServletResponse response) {
		String hakwon_no	= request.getParameter("hakwon_no");
		int pageNo			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int pageScale		= HakwonConstant.PageScale.TEACHER_REQ;

		DataMap param = new DataMap();
		param.put("approved_yn", 	"Y");
		param.put("hakwon_no",		hakwon_no);
		param.put("startNo",		(pageNo-1)*pageScale);
		param.put("pageScale",		pageScale);

		DataMap colData = masterService.getMasterHakwonTeacherList(param);
		colData.put("pageScale", pageScale);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 선생님 검색 (반에 미등록된 경우 체크)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/searchHakwonTeacherList")
	public void searchHakwonTeacherList(HttpServletRequest request, HttpServletResponse response) {
		String searchText	= request.getParameter("searchText");
		String hakwon_no	= request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("hakwon_no",		hakwon_no);
		param.put("searchText",		searchText);

		DataMap colData = masterService.searchHakwonTeacherList(param);

		sendColData(colData, request, response);
	}

	/**
	 * 원장 학원 소개 수정 및 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/editHakwonIntro")
	public void editHakwonIntro(HttpServletRequest request, HttpServletResponse response) {
		/*	인증정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no",				authUserInfo.get("user_no"));
		param.put("introduction",			request.getParameter("introduction"));
		param.put("hakwon_no",				request.getParameter("hakwon_no"));
		param.put("file_no_list", 			request.getParameter("file_no_list"));			// 업로드 파일 번호들
		param.put("reg_user_no",			authUserInfo.get("user_no"));					// 파일 등록자

		sendColData(masterService.updateMasterHakwonIntro(param), request, response);
	}

	/**
	 * 학원 공지사항 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/registHakwonNotice")
	public void registHakwonNotice(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no			= request.getParameter("hakwon_no");
		String title				= request.getParameter("title");
		String preview_content		= request.getParameter("preview_content");
		String content				= request.getParameter("content");
		String reply_yn				= request.getParameter("reply_yn");
		String file_no_list			= request.getParameter("file_no_list");

		DataMap param = new DataMap();
		param.put("notice_type",		"002");							// 학원 공지
		param.put("notice_parent_no",	hakwon_no);						// 학원 번호
		param.put("title",				title);
		param.put("preview_content", 	preview_content);
		param.put("content", 			content);
		param.put("reply_yn",			reply_yn);						// 공지사항 댓글 허용
		param.put("file_no_list", 		file_no_list);					// 파일 번호들
		param.put("reg_user_no", 		authUserInfo.get("user_no"));	// 파일 등록자

		/* 반 공지사항 등록 */
		DevicePushData devicePushData = noticeService.registNotice(param);

		/**
		 * Async 서비스
		 */
		asyncService.pushMobileDevice(devicePushData);

		DataMap rtnMap = new DataMap();
		rtnMap.put("result",	CommonConstant.Flag.success);
		sendColData(rtnMap, request, response);
	}

	/**
	 * 반 공지사항 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/registClassNotice")
	public void registClassNotice(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String class_no				= request.getParameter("class_no");
		String title				= request.getParameter("title");
		String preview_content		= request.getParameter("preview_content");
		String content				= request.getParameter("content");
		String reply_yn				= request.getParameter("reply_yn");
		String file_no_list			= request.getParameter("file_no_list");

		DataMap param = new DataMap();
		param.put("notice_type",		"003");							// 반 공지
		param.put("notice_parent_no",	class_no);						// 반 번호
		param.put("title",				title);
		param.put("preview_content", 	preview_content);
		param.put("content", 			content);
		param.put("reply_yn",			reply_yn);						// 공지사항 댓글 허용
		param.put("file_no_list", 		file_no_list);					// 파일 번호들
		param.put("reg_user_no", 		authUserInfo.get("user_no"));	// 파일 등록자

		/* 반 공지사항 등록 */
		DevicePushData devicePushData = noticeService.registNotice(param);

		/**
		 * Async 서비스
		 */
		asyncService.pushMobileDevice(devicePushData);

		DataMap rtnMap = new DataMap();
		rtnMap.put("result",	CommonConstant.Flag.success);
		sendColData(rtnMap, request, response);
	}

	/**
	 * 학원, 반 공지사항 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/editNotice")
	public void editNotice(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no		= request.getParameter("hakwon_no");
		String notice_no		= request.getParameter("notice_no");
		String title			= request.getParameter("title");
		String preview_content	= request.getParameter("preview_content");
		String content			= request.getParameter("content");
		String reply_yn			= request.getParameter("reply_yn");
		String file_no_list		= request.getParameter("file_no_list");

		DataMap param = new DataMap();
		param.put("hakwon_no",			hakwon_no);
		param.put("notice_no",			notice_no);
		param.put("title",				title);
		param.put("preview_content",	preview_content);
		param.put("content",			content);
		param.put("reply_yn",			reply_yn);
		param.put("user_no",			authUserInfo.get("user_no"));
		param.put("udp_user_no",		authUserInfo.get("user_no"));
		param.put("user_type",			authUserInfo.get("user_type"));
		param.put("file_no_list", 		file_no_list);					// 파일 번호들

		/* 반 공지사항 수정 */
		sendColData(noticeService.editNotice(param), request, response);
	}

	/**
	 * 학원, 반 공지사항 삭제
	 * @param request
	 * @param response
	 */
	@RequestMapping("/removeNotice")
	public void removeNotice(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String notice_no	= request.getParameter("notice_no");

		DataMap param = new DataMap();
		param.put("notice_no",		notice_no);
		param.put("user_no", 		authUserInfo.get("user_no"));
		param.put("user_type", 		authUserInfo.get("user_type"));

		/* 반 공지사항 상태값 삭제로 변경 */
		sendColData(noticeService.deleteNotice(param), request, response);
	}

	/**
	 * 학원 이벤트 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/registEvent")
	public void registEvent(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no		= request.getParameter("hakwon_no");
		String event_title		= request.getParameter("event_title");
		String event_content	= request.getParameter("event_content");
		String begin_date		= request.getParameter("begin_date");
		String end_date			= request.getParameter("end_date");
		String file_no_list		= request.getParameter("file_no_list");

		DataMap param = new DataMap();
		param.put("hakwon_no",		hakwon_no);
		param.put("event_title",	event_title);
		param.put("event_content",	event_content);
		param.put("begin_date",		begin_date);
		param.put("end_date",		end_date);
		param.put("file_no_list",	file_no_list);
		param.put("reg_user_no",	authUserInfo.get("user_no"));

		DataMap colData = eventService.registHakwonEvent(param);

		DevicePushData devicePushData = (DevicePushData)colData.get("devicePushData");
		asyncService.pushMobileDevice(devicePushData);
		colData.remove("devicePushData");

		sendColData(colData, request, response);
	}

	/**
	 * 학원 이벤트 삭제
	 * @url /hakwon/master/deleteEvent
	 * @param request
	 * @param response
	 */
	@RequestMapping("/deleteEvent")
	public void deleteEvent(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no		= request.getParameter("hakwon_no");
		String event_no		= request.getParameter("event_no");

		DataMap param = new DataMap();
		param.put("hakwon_no",	hakwon_no);
		param.put("event_no",	event_no);
		param.put("user_no",	authUserInfo.get("user_no"));

		DataMap colData = eventService.deleteHakwonEvent(param);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 이벤트 내용 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/editEvent")
	public void editEvent(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String event_no			= request.getParameter("event_no");
		String hakwon_no		= request.getParameter("hakwon_no");
		String event_title		= request.getParameter("event_title");
		String event_content	= request.getParameter("event_content");
		String begin_date		= request.getParameter("begin_date");
		String end_date			= request.getParameter("end_date");
		String file_no_list		= request.getParameter("file_no_list");

		DataMap param = new DataMap();
		param.put("hakwon_no",		hakwon_no);
		param.put("event_title",	event_title);
		param.put("event_content",	event_content);
		param.put("begin_date",		begin_date);
		param.put("end_date",		end_date);
		param.put("event_no",		event_no);
		param.put("file_no_list",	file_no_list);
		param.put("user_no",		authUserInfo.get("user_no"));

		DataMap colData = eventService.editHakwonEvent(param);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 이벤트 삭제 (상태값 변경)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/removeHakwonEvent")
	public void removeHakwonEvent(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String event_no			= request.getParameter("event_no");

		DataMap param = new DataMap();
		param.put("hakwon_no",		event_no);
		param.put("udp_user_no",	authUserInfo.get("user_no"));

		DataMap colData = eventService.deleteHakwonEvent(param);

		sendColData(colData, request, response);
	}

	/**
	 * 가입 요청 선생님 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/unauthorizedTeacherList")
	public void unauthorizedTeacherList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no",	authUserInfo.get("user_no"));

		/*	가입 요청 선생님 리스트	*/
		List<DataMap> unauthorizedTeacherList = masterService.unauthorizedTeacherList(param);

		sendList(unauthorizedTeacherList, request, response);
	}

	/**
	 * 가입 요청 선생님 승인
	 * @param request
	 * @param response
	 */
	@RequestMapping("/approvedTeacher")
	public void approvedTeacher(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no",	authUserInfo.get("user_no"));

		param.put("teacherUserNo",	request.getParameter("teacherUserNo"));
		param.put("hakwonNo",		request.getParameter("hakwonNo"));

		/*	선생님 승인	*/
		masterService.executeApprovedTeacher(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 원장님 반 리스트
	 * @param request
	 * @param response
	 *
	 * @url /hakwon/master/classList.do
	 */
	@RequestMapping("/classList")
	public void classList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("hakwon_no", request.getParameter("hakwon_no"));
		param.put("teacher_user_no", authUserInfo.get("user_no"));

		/*	반 리스트	*/
		List<DataMap> classList = masterService.hakwonClassList(param);

		sendList(classList, request, response);
	}

	/**
	 * 학원 리스트
	 * @param request
	 * @param response
	 *
	 * @url /hakwon/master/hakwonAllList.do
	 */
	@RequestMapping("/hakwonAllList")
	public void hakwonAllList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no", authUserInfo.get("user_no"));

		/*	학원 전체 리스트	*/
		List<DataMap> hakwonAllList = masterService.hakwonAllList(param);

		sendList(hakwonAllList, request, response);
	}

	/**
	 * 선생님 탈퇴
	 * @param request
	 * @param response
	 */
	@RequestMapping("/teacherOut")
	public void teacherOut(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no", authUserInfo.get("user_no"));
		param.put("teacher_user_no", request.getParameter("teacherUserNo"));
		param.put("hakwon_no", request.getParameter("hakwonNo"));
		param.put("message", request.getParameter("message"));

		/**
		 * 선생님 탈퇴
		 */
		DevicePushData devicePushData = masterService.executeTeacherOut(param);
		asyncService.pushMobileDevice(devicePushData);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 학원 소개 미리보기 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/previewIntro")
	public void previewIntro(HttpServletRequest request, HttpServletResponse response) {
		/*	인증정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no",				authUserInfo.get("user_no"));
		param.put("receiveUserNo",			authUserInfo.get("user_no"));
		param.put("introduction",			request.getParameter("introduction"));
		param.put("hakwon_no",				request.getParameter("hakwon_no"));


		DataMap rtnMap = hakwonService.insertPreviewIntro(param);

		long preivewNo = (Long)rtnMap.get("previewNo");
		DevicePushData devicePushData = (DevicePushData)rtnMap.get("devicePushData");
		asyncService.pushMobileDevice(devicePushData);

		DataMap colData = new DataMap();
		colData.put("preivewNo",	preivewNo);

		sendColData(colData, request, response);
	}
}