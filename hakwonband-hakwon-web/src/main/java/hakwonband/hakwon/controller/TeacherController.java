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
import hakwonband.hakwon.service.NoticeService;
import hakwonband.hakwon.service.TeacherService;
import hakwonband.util.DataMap;
import hakwonband.util.SecuUtil;
import hakwonband.util.StringUtil;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;

/**
 * 선생님 컨트롤러
 * @author jrlim
 *
 */
@RequestMapping("/hakwon/teacher")
@Controller
public class TeacherController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(TeacherController.class);

	@Autowired
	private TeacherService teacherService;

	@Autowired
	private NoticeService noticeService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 학원 or 반소속 선생님 목록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/teacherList")
	public void teacherList(HttpServletRequest request, HttpServletResponse response) {

		String hakwon_no	= request.getParameter("hakwon_no");
		String class_no		= request.getParameter("class_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.CLASS_REQ;

		DataMap param = new DataMap();
		param.put("hakwon_no",	hakwon_no);
		param.put("class_no",	class_no);
		param.put("start_no",	(page_no-1)*page_scale);
		param.put("page_scale",	page_scale);

		/* 선생님 목록 조회 */
		List<DataMap> teacherReqList = teacherService.teacherReqList(param);

		/* 선생님 목록 카운트 */
		int teacherListTotCount = teacherService.teacherListTotCount(param);

		DataMap colData = new DataMap();
		colData.put("teacherReqList", teacherReqList);
		colData.put("teacherListTotCount", teacherListTotCount);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 상세정보 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonReqDetail")
	public void hakwonReqDetial(HttpServletRequest request, HttpServletResponse response) {
		String hakwon_no = request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("hakwon_no", hakwon_no);

		/* 학원 상세정보 조회 */
		DataMap colData = teacherService.hakwonReqDetail(param);
		sendColData(colData, request, response);
	}

	/**
	 * 선생님 소속 학원목록 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/teacherHakwonReqList")
	public void teacherHakwonReqList(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no", authUserInfo.get("user_no"));

		/* 선생님 소속 학원목록 조회 */
		List<DataMap> teacherHakwonReqList = teacherService.teacherHakwonReqList(param);

		DataMap colData = new DataMap();
		colData.put("teacherHakwonReqList", teacherHakwonReqList);

		sendColData(colData, request, response);
	}

	/**
	 * 학원의 선생님, 학생, 학부모 카운트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonUsersCount")
	public void hakwonUsersCount(HttpServletRequest request, HttpServletResponse response){
		String hakwon_no = request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("hakwon_no", hakwon_no);

		/* 학원 소속 선생님, 학생, 학부모 카운트 조회 */
		DataMap colData = teacherService.hakwonUsersCount(param);
		sendColData(colData, request, response);
	}

	/**
	 * 선생님 개인정보 상세조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/teacherReqDetail")
	public void teacherReqDetail(HttpServletRequest request, HttpServletResponse response) {
		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no", authUserInfo.getString("user_no"));

		/* 선생님 개인 상세정보 조회 */
		DataMap colData = teacherService.teacherReqDetail(param);
		sendColData(colData, request, response);
	}

	/**
	 * 선생님 개인정보 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/editTeacherInfo")
	public void editTeacherInfo(HttpServletRequest request, HttpServletResponse response) {
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
		param.put("user_password",	SecuUtil.sha256(user_password));
		param.put("user_name", 		user_name);
		param.put("user_gender", 	user_gender);
		param.put("user_birthday", 	user_birthday);
		param.put("tel1_no", 		tel1_no);
		param.put("tel2_no", 		tel2_no);
		param.put("user_no", 		authUserInfo.get("user_no"));

		/* 선생님 기본정보 및 부가정보 수정 */
		DataMap colData = teacherService.updateTeacherInfo(param);

		sendColData(colData, request, response);
	}

	/**
	 * 반에 학생 등록 (선생님 권한)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/registStudentToClass")
	public void registStudentToClass(HttpServletRequest request, HttpServletResponse response) {
		String hakwon_no		= request.getParameter("hakwon_no");
		String class_no			= request.getParameter("class_no");
		String student_user_no	= request.getParameter("student_user_no");

		DataMap param = new DataMap();
		param.put("hakwon_no",			hakwon_no);
		param.put("class_no",			class_no);
		param.put("student_user_no",	student_user_no);

		/* 반에 학생 등록 */
		DataMap colData = teacherService.registClassStudentForTeacher(param);

		sendColData (colData, request, response);
	}

	/**
	 * 학원내 반 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonClassList")
	public void hakwonClassList(HttpServletRequest request, HttpServletResponse response) {
		String hakwon_no = request.getParameter("hakwon_no");
		int page_no		= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale	= HakwonConstant.PageScale.CLASS_REQ;

		DataMap param = new DataMap();
		param.put("hakwon_no",	hakwon_no);
		param.put("start_no",	(page_no-1)*page_scale);
		param.put("page_scale",	page_scale);

		/* 반 리스트 조회 */
		List<DataMap> hakwonClassList = teacherService.hakwonClassList(param);

		/* 반 리스트 카운트 */
		int hakwonClassListTotCount = teacherService.hakwonClassListTotCount(param);

		DataMap colData = new DataMap();
		colData.put("page_scale", page_scale);
		colData.put("hakwonClassList", hakwonClassList);
		colData.put("hakwonClassListTotCount", hakwonClassListTotCount);

		sendColData(colData, request, response);
	}

	/**
	 * 반 소속 선생님 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/classTeacherReqList")
	public void classTeacherReqList(HttpServletRequest request, HttpServletResponse response) {
		String class_no = request.getParameter("class_no");

		DataMap param = new DataMap();
		param.put("class_no", class_no);

		/* 반 소속 선생님 목록 */
		List<DataMap> classTeacherList = teacherService.classTeacherList(param);

		/* 반 소속 선생님 카운트 */
		int classTeacherListTotCount = teacherService.classTeacherListTotCount(param);

		DataMap colData = new DataMap();
		colData.put("classTeacherList", classTeacherList);
		colData.put("classTeacherListTotCount", classTeacherListTotCount);

		sendColData(colData, request, response);
	}

	/**
	 * 반 소속의 학생 및 학부모 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/classStudentReqList")
	public void classStudentReqList(HttpServletRequest request, HttpServletResponse response) {
		String class_no = request.getParameter("class_no");

		DataMap param = new DataMap();
		param.put("class_no", class_no);

		/* 반 학생 리스트 및 카운트 조회 */
		List<DataMap> classStudentList = teacherService.classStudentList(param);
		int classStudentTotCount = teacherService.classStudentListTotCount(param);

		/* 반 학생의 학부모 리스트 및 카운트 조회 */
		List<DataMap> classParentList = teacherService.classParentList(param);
		int classParentListTotCount = teacherService.classParentListTotCount(param);

		DataMap colData = new DataMap();
		colData.put("classStudentList", classStudentList);
		colData.put("classStudentTotCount", classStudentTotCount);
		colData.put("classParentList", classParentList);
		colData.put("classParentListTotCount", classParentListTotCount);

		sendColData(colData, request, response);
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
		int is_file_view			= StringUtil.parseInt(request.getParameter("is_file_view"), 1);
		if( is_file_view == 1 || is_file_view == 0 ) {
		} else {
			is_file_view = 1;
		}

		/*	예약 전송	*/
		String reservationDate		= request.getParameter("reservationDate");
		String reservationTime		= request.getParameter("reservationTime");
		if( StringUtils.isNotBlank(reservationDate) && StringUtils.isNotBlank(reservationTime) ) {
		} else {
			reservationDate = "";
			reservationTime = "";
		}

		DataMap param = new DataMap();
		param.put("notice_type",		"003");							// 공지사항 타입 = 반 공지
		param.put("notice_parent_no",	class_no);						// 공지사항 부모 번호 = 반 번호
		param.put("title",				title);
		param.put("preview_content", 	preview_content);
		param.put("content", 			content);
		param.put("file_no_list", 		file_no_list);					// 파일 번호들
		param.put("reg_user_no", 		authUserInfo.get("user_no"));	// 파일 등록자
		param.put("reply_yn",			reply_yn);						// 공지사항 댓글 허용

		param.put("reservationDate",	reservationDate);
		param.put("reservationTime",	reservationTime);

		param.put("is_file_view",		is_file_view);

		/* 공지사항 등록 */
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
	 * 반 공지사항 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/editClassNotice")
	public void editClassNotice(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no		= request.getParameter("hakwon_no");
		String notice_no		= request.getParameter("notice_no");
		String title			= request.getParameter("title");
		String preview_content	= request.getParameter("preview_content");
		String content			= request.getParameter("content");
		String reply_yn			= request.getParameter("reply_yn");
		String file_no_list		= request.getParameter("file_no_list");
		int is_file_view			= StringUtil.parseInt(request.getParameter("is_file_view"), 1);
		if( is_file_view == 1 || is_file_view == 0 ) {
		} else {
			is_file_view = 1;
		}

		/*	예약 전송	*/
		String reservationDate		= request.getParameter("reservationDate");
		String reservationTime		= request.getParameter("reservationTime");
		if( StringUtils.isNotBlank(reservationDate) && StringUtils.isNotBlank(reservationTime) ) {
		} else {
			reservationDate = "";
			reservationTime = "";
		}

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

		param.put("reservationDate",	reservationDate);
		param.put("reservationTime",	reservationTime);

		param.put("is_file_view",		is_file_view);

		/* 반 공지사항 수정 */
		DataMap colData = noticeService.editNotice(param);

		sendColData(colData, request, response);
	}

	/**
	 * 반 공지사항 삭제
	 * @param request
	 * @param response
	 */
	@RequestMapping("/removeClassNotice")
	public void removeClassNotice(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String notice_no	= request.getParameter("notice_no");

		DataMap param = new DataMap();
		param.put("notice_no",		notice_no);
		param.put("user_no", 		authUserInfo.get("user_no"));
		param.put("user_type", 		authUserInfo.get("user_type"));

		/* 반 공지사항 상태값 삭제로 변경 */
		DataMap colData = noticeService.deleteNotice(param);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 이벤트 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonEventList")
	public void hakwonEventList(HttpServletRequest request, HttpServletResponse response) {
		String hakwon_no	= request.getParameter("hakwon_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.EVENT_REQ;

		DataMap param = new DataMap();
		param.put("hakwon_no",	hakwon_no);
		param.put("start_no",	(page_no-1)*page_scale);
		param.put("page_scale",	page_scale);

		/* 이벤트 리스트 조회 */
		List<DataMap> eventList = teacherService.eventList(param);

		/* 이벤트 리스트 카운트 */
		int eventListTotCount = teacherService.eventListTotCount(param);

		DataMap colData = new DataMap();
		colData.put("eventList", eventList);
		colData.put("eventListTotCount", eventListTotCount);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 이벤트 상세정보
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonEventDetail")
	public void hakwonEventDetail(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String event_no = request.getParameter("event_no");

		DataMap param = new DataMap();
		param.put("event_no",			event_no);
		param.put("file_parent_type",	CommonConstant.File.TYPE_EVENT);					// 파일타입 002 이벤트
		param.put("file_parent_no",		event_no);

		param.put("content_type",		"003");					// 읽은상태 등록시 사용
		param.put("content_parent_no",	event_no);
		param.put("user_no",			authUserInfo.get("user_no"));

		/* 이벤트 상세 조회 */
		DataMap colData = teacherService.procEventDetail(param);

		sendColData(colData, request, response);
	}


	/**
	 * 선생님의 반 리스트
	 * @param request
	 * @param response
	 *
	 * @url /hakwon/teacher/classList.do
	 */
	@RequestMapping("/classList")
	public void classList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("hakwon_no", request.getParameter("hakwon_no"));
		param.put("teacher_user_no", authUserInfo.get("user_no"));

		/*	반 리스트	*/
		List<DataMap> classList = teacherService.classList(param);

		sendList(classList, request, response);
	}

	/**
	 * 선생님의 등록 학원 검색
	 * @param request
	 * @param response
	 *
	 * @url /hakwon/teacher/registHakwonSearch.do
	 */
	@RequestMapping("/registHakwonSearch")
	public void registHakwonSearch(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("hakwon_code", request.getParameter("hakwonCode"));
		param.put("teacher_user_no", authUserInfo.get("user_no"));

		/*	학원 검색	*/
		DataMap hakwonInfo = teacherService.registHakwonSearch(param);

		DataMap colData = new DataMap();
		colData.put("hakwonInfo", hakwonInfo);

		sendColData(colData, request, response);
	}

	/**
	 * 학원 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonRegist")
	public void hakwonRegist(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("hakwon_no", request.getParameter("hakwonNo"));
		param.put("teacher_user_no", authUserInfo.get("user_no"));


		/* 학원에 선생님 등록신청 */
		teacherService.registHakwonTeacher(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 학원 등록 취소
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonReqCancel")
	public void hakwonReqCancel(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("hakwon_no", request.getParameter("hakwonNo"));
		param.put("teacher_user_no", authUserInfo.get("user_no"));

		/*	학원 검색	*/
		teacherService.deleteRegistHakwonReqCancel(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 학원 리스트
	 * @param request
	 * @param response
	 *
	 * @url /hakwon/teacher/hakwonAllList.do
	 */
	@RequestMapping("/hakwonAllList")
	public void hakwonAllList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no", authUserInfo.get("user_no"));

		/*	학원 전체 리스트	*/
		List<DataMap> hakwonAllList = teacherService.hakwonAllList(param);

		sendList(hakwonAllList, request, response);
	}
}