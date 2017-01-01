package hakwonband.mobile.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.mobile.model.DevicePushData;
import hakwonband.mobile.service.AsyncService;
import hakwonband.mobile.service.MobileService;
import hakwonband.mobile.service.UserService;
import hakwonband.util.DataMap;
import hakwonband.util.StringUtil;

/**
 * 학원 컨트롤러
 * @author bumworld
 */
@RequestMapping("/mobile")
@Controller
public class MobileController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(MobileController.class);

	@Autowired
	private MobileService mobileService;

	@Autowired
	private UserService userService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 메인 페이지
	 * @return
	 */
	@RequestMapping("/main")
	public ModelAndView main() {

		return new ModelAndView("/main");
	}

	/**
	 * 학원 검색(code, name)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwon/searchHakwon")
	public void serarchHakwon(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("search_text", request.getParameter("search_text"));

		sendColData(mobileService.getHakwonSearch(param), request, response);
	}

	/**
	 * 학원 검색(addr, name)
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwon/searchHakwonList")
	public void serarchHakwonList(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("search_text", StringUtil.replaceNull(request.getParameter("search_text")).trim());
		param.put("sido",		StringUtil.replaceNull(request.getParameter("sido")));
		param.put("gugun",		StringUtil.replaceNull(request.getParameter("gugun")));

		if (request.getParameter("hakwon_cate") != null)
			param.put("hakwon_cate", request.getParameter("hakwon_cate"));

		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.HAKWON_REQ;
		param.put("start_no",			(page_no-1) * page_scale);
		param.put("page_scale",			page_scale);

		sendColData(mobileService.getHakwonSearchList(param), request, response);
	}

	/**
	 * 학원 공지사항 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/notice/hakwonNoticeReqList")
	public void hakwonNoticeReqList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no	= request.getParameter("hakwon_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.NOTICE_REQ;

		DataMap param = new DataMap();
		param.put("notice_type",		"002");						// 공지사항 타입 = 학원 공지
		param.put("notice_parent_no",	hakwon_no);					// 공지사항 부모 번호 = 학원 번호
		param.put("start_no",			(page_no-1)*page_scale);
		param.put("page_scale",			page_scale);
		param.put("separatorChar", 		CommonConstant.ChDiv.CH_DEL);
		param.put("user_no", 			authUserInfo.get("user_no"));
		param.put("user_type", 			authUserInfo.get("user_type"));

		/* 학원 공지사항 리스트 조회 */
		List<DataMap> noticeReqList = mobileService.noticeReqList(param);

		/* 학원 공지사항 카운트 */
		int noticeReqListTotCount = mobileService.noticeReqListTotCount(param);

		DataMap colData = new DataMap();
		colData.put("pageScale",				page_scale);
		colData.put("noticeReqList",			noticeReqList);
		colData.put("noticeReqListTotCount",	noticeReqListTotCount);

		sendColData(colData, request, response);
	}

	/**
	 * 반 공지사항 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/notice/classNoticeReqList")
	public void classNoticeReqList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String class_no		= request.getParameter("class_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.NOTICE_REQ;

		DataMap param = new DataMap();
		param.put("notice_type",		"003");						// 공지사항 타입 = 반 공지
		param.put("notice_parent_no",	class_no);					// 공지사항 부모 번호 = 반 번호
		param.put("start_no",			(page_no-1)*page_scale);
		param.put("page_scale",			page_scale);
		param.put("separatorChar", 		CommonConstant.ChDiv.CH_DEL);
		param.put("user_no", 			authUserInfo.get("user_no"));
		param.put("user_type", 			authUserInfo.get("user_type"));

		/* 반 공지사항 리스트 조회 */
		List<DataMap> noticeReqList = mobileService.noticeReqList(param);

		/* 반 공지사항 카운트 */
		int noticeReqListTotCount = mobileService.noticeReqListTotCount(param);

		DataMap colData = new DataMap();
		colData.put("pageScale",				page_scale);
		colData.put("pageNo",					page_no);
		colData.put("noticeReqList",			noticeReqList);
		colData.put("noticeReqListTotCount",	noticeReqListTotCount);

		sendColData(colData, request, response);
	}

	/**
	 * 공지사항 상제정보 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/notice/noticeDetail")
	public void noticeDetail(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String notice_no = request.getParameter("notice_no");

		DataMap param = new DataMap();
		param.put("notice_no",			notice_no);
		param.put("content_type", 		"001");								// 댓글 컨텐츠 타입 001 공지
		param.put("content_parent_no",	notice_no);
		param.put("file_parent_type",	CommonConstant.File.TYPE_NOTICE);	// 파일 타입 001 공지
		param.put("file_parent_no",		notice_no);
		param.put("user_no", 			authUserInfo.get("user_no"));		// 읽은상태 등록시 사용
		param.put("user_type", 			authUserInfo.get("user_type"));

		/* 공지사항 상세조회, 공지사항 댓글 조회, 공지사항 파일 조회, 읽은상태 등록 */
		DataMap noticeDetail = mobileService.procNoticeDetail(param);

		sendColData(noticeDetail, request, response);
	}

	/**
	 * 학원 이벤트 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/event/hakwonEventList")
	public void hakwonEventList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no	= request.getParameter("hakwon_no");
		int page_no			= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale		= HakwonConstant.PageScale.EVENT_REQ;

		DataMap param = new DataMap();
		param.put("hakwon_no",	hakwon_no);
		if( authUserInfo != null ) {
			param.put("user_no",	authUserInfo.get("user_no"));
		}
		param.put("start_no",	(page_no-1)*page_scale);
		param.put("page_scale",	page_scale);

		/* 이벤트 리스트 조회 */
		DataMap eventData = mobileService.eventList(param);
		eventData.put("pageScale", 			page_scale);

		sendColData(eventData, request, response);
	}

	/**
	 * 학원 이벤트 상세정보
	 * @param request
	 * @param response
	 */
	@RequestMapping("/event/hakwonEventDetail")
	public void hakwonEventReqDetail(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String event_no = request.getParameter("event_no");

		DataMap param = new DataMap();
		param.put("event_no",			event_no);
		param.put("file_parent_type",	"003");					// 파일타입 002 이벤트
		param.put("file_parent_no",		event_no);

		param.put("content_type",		"003");					// 읽은상태 등록시 사용
		param.put("content_parent_no",	event_no);
		if( authUserInfo != null ) {
			param.put("user_no",			authUserInfo.get("user_no"));
		}

		/* 이벤트 상세 조회 */
		DataMap colData = mobileService.procEventDetail(param);

		sendColData(colData, request, response);
	}

	/**
	 * 사용자 학원 이벤트 참여
	 * @param request
	 * @param response
	 */
	@RequestMapping("/event/joinEvent")
	public void joinEvent(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		String event_no				= request.getParameter("event_no");
		String recommend_user_id	= request.getParameter("recommend_user_id");
		String add_info				= request.getParameter("add_info");

		DataMap param = new DataMap();
		param.put("event_no",			event_no);
		param.put("recommend_user_id",	recommend_user_id);
		param.put("add_info",			add_info);
		param.put("user_no",			authUserInfo.get("user_no"));

		/* 이벤트 참여 */
		DataMap colData = mobileService.registJoinEvent(param);

		sendColData(colData, request, response);
	}

	/**
	 * 사용자 참여한 이벤트 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/event/eventMyJoinList")
	public void eventMyJoinList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo	= (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		int page_no				= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale			= HakwonConstant.PageScale.EVENT_REQ;

		DataMap param = new DataMap();
		param.put("user_no", 	authUserInfo.get("user_no"));
		param.put("start_no",	(page_no-1)*page_scale);
		param.put("page_scale",	page_scale);

		/* 참여한 이벤트 리스트 조회 */
		List<DataMap> eventMyJoinList = mobileService.eventMyJoinList(param);

		/* 참여한 이벤트 리스트 카운트 */
		int eventMyJoinListTotCount = mobileService.eventMyJoinListTotCount(param);

		DataMap colData = new DataMap();
		colData.put("pageScale",	 			page_scale);
		colData.put("eventMyJoinList", 			eventMyJoinList);
		colData.put("eventMyJoinListTotCount",	eventMyJoinListTotCount);

		sendColData(colData, request, response);
	}

	/**
	 * 이벤트 추천 받은 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/event/eventRecommendList")
	public void eventRecommendList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo	= (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);
		int page_no				= StringUtil.parseInt(request.getParameter("page_no"), 1);
		int page_scale			= HakwonConstant.PageScale.EVENT_REQ;

		DataMap param = new DataMap();
		param.put("user_no", 	authUserInfo.get("user_no"));
		param.put("start_no",	(page_no-1)*page_scale);
		param.put("page_scale",	page_scale);

		/* 참여한 이벤트 리스트 조회 */
		DataMap colData = mobileService.eventRecommendList(param);
		colData.put("pageScale",	 			page_scale);

		sendColData(colData, request, response);
	}



	/**
	 * 학원 가입 학생 첫 화면
	 * @param request
	 * @param response
	 */
	@RequestMapping("/main/firstView")
	public void userFirstView(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보
		 * user_type : 학부모 : 005 / 학생 : 006
		 * */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int page_scale	= HakwonConstant.PageScale.MESSAGE_REQ_TOP3;

		DataMap param = new DataMap();
		param.put("user_no",			authUserInfo.get("user_no"));
		param.put("user_type",			authUserInfo.get("user_type"));
		param.put("receive_user_no",	authUserInfo.get("user_no"));
		param.put("start_no",			(1-1) * page_scale);
		param.put("page_scale",			page_scale);

		sendColData(mobileService.userFirstView(param), request, response);
	}

	/**
	 * 학부모 승인
	 * @param request
	 * @param response
	 */
	@RequestMapping("/main/editApproved")
	public void editApproved(HttpServletRequest request, HttpServletResponse response) {
		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_name", authUserInfo.get("user_name"));
		param.put("student_user_no", authUserInfo.get("user_no"));
		param.put("approved", request.getParameter("approved"));
		param.put("parent_user_no", request.getParameter("parent_user_no"));

		DataMap colData = mobileService.updateParentApproved(param);
		DevicePushData devicePushData = (DevicePushData)colData.get("devicePushData");
		asyncService.pushMobileDevice(devicePushData);

		sendColData(colData, request, response);
	}

	/**
	 * 학생 아이디 검색
	 * @param request
	 * @param response
	 */
	@RequestMapping("/main/searchStudent")
	public void searchStudent(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_id", request.getParameter("user_id"));
		param.put("user_no", authUserInfo.get("user_no"));

		sendColData(mobileService.getStudentSearch(param), request, response);
	}


	/**
	 * 학원 상세 내용
	 * @param request
	 * @param response
	 */
	@RequestMapping("/main/hakwonDetail")
	public void hakwonDetail(HttpServletRequest request, HttpServletResponse response) {
		int page_scale	= HakwonConstant.PageScale.MESSAGE_REQ_TOP3;

		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		if( authUserInfo != null ) {
			param.put("user_no", authUserInfo.get("user_no"));
		}
		param.put("hakwon_no", request.getParameter("hakwon_no"));
		param.put("start_no",			(1-1) * page_scale);
		param.put("page_scale",			page_scale);
		param.put("notice_parent_no", request.getParameter("hakwon_no"));
		param.put("notice_type", "002");
		param.put("separatorChar", 		CommonConstant.ChDiv.CH_DEL);

		sendColData(mobileService.getHakwonDetail(param), request, response);
	}

	/**
	 * 학원 소개
	 * @param request
	 * @param response
	 */
	@RequestMapping("/main/hakwonIntroduction")
	public void hakwonIntroduction(HttpServletRequest request,  HttpServletResponse response) {
		DataMap param = new DataMap();
		param.put("hakwon_no", request.getParameter("hakwon_no"));

		sendColData(mobileService.getSelectHakwonIntroduction(param), request, response);
	}

	/**
	 * 학부모 신청
	 * @param request
	 * @param response
	 */
	@RequestMapping("/main/putApproved")
	public void putApproved(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("student_user_no", request.getParameter("student_user_no"));
		param.put("parent_user_no", authUserInfo.get("user_no"));
		param.put("parent_user_name", authUserInfo.get("user_name"));

		DataMap colData = mobileService.insertParentApproved(param);
		DevicePushData devicePushData = (DevicePushData)colData.get("devicePushData");
		asyncService.pushMobileDevice(devicePushData);

		sendColData(colData, request, response);
	}

	/**
	 * 반 상세정보, 반 담당선생님, 반 공지사항 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/main/classDetail")
	public void classDetail(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("notice_type",		"003");
		param.put("notice_parent_no",	request.getParameter("class_no"));
		param.put("class_no",			request.getParameter("class_no"));
		param.put("start_no",			0);
		param.put("page_scale",			20);
		param.put("hakwon_no",			request.getParameter("hakwon_no"));
		param.put("separatorChar", 		CommonConstant.ChDiv.CH_DEL);
		param.put("user_no", 			authUserInfo.get("user_no"));

		sendColData(mobileService.getClassDetail(param), request, response);
	}

	/**
	 * 학원 가입
	 * @param request
	 * @param response
	 */
	@RequestMapping("/main/insertHakwonMember")
	public void insertHakwonMember(HttpServletRequest request, HttpServletResponse response) {
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("hakwon_no", request.getParameter("hakwon_no"));
		param.put("user_no", authUserInfo.get("user_no"));
		param.put("user_type", authUserInfo.get("user_type"));

		sendColData(userService.registHakwonMember(param), request, response);
	}

	@RequestMapping("/main/getHakwon_cate")
	public void getHakwonCate(HttpServletRequest request, HttpServletResponse response) {
		DataMap param =  new DataMap();
		sendColData(mobileService.getHakwonCateName(param), request, response);
	}
}