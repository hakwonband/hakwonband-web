package hakwonband.hakwon.controller;

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
import hakwonband.util.DataMap;
import hakwonband.util.HTMLCleaner;
import hakwonband.util.StringUtil;

/**
 * 관리자 문의 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/hakwon/adminQuestion")
@Controller
public class AdminQuestionController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(AdminQuestionController.class);

	@Autowired
	private NoticeService noticeService;

	@Autowired
	private AsyncService asyncService;

	/**
	 * 관리자 문의하기 리스트
	 * @url /hakwon/adminQuestion/list.do
	 * @return
	 */
	@RequestMapping("/list")
	public void list(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		int pageNo			= StringUtil.parseInt(request.getParameter("pageNo"), 1);
		int pageScale		= HakwonConstant.PageScale.NOTICE_REQ;
		String hakwon_no	= request.getParameter("hakwon_no");


		DataMap param = new DataMap();
		param.put("user_no",			authUserInfo.getString("user_no"));
		param.put("user_type",			authUserInfo.getString("user_type"));
		param.put("notice_parent_no",	hakwon_no);
		param.put("notice_type",		"004");
		param.put("start_no",			(pageNo-1)*pageScale);
		param.put("page_scale",			pageScale);

		/**
		 * 문의 메일 조회
		 */
		DataMap noticeMap = noticeService.noticeList(param);

		sendColData(noticeMap, request, response);
	}

	/**
	 * 관리자 문의하기 리스트
	 * @url /hakwon/adminQuestion/view.do
	 * @return
	 */
	@RequestMapping("/view")
	public void view(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no	= request.getParameter("hakwon_no");
		String notice_no	= request.getParameter("notice_no");


		DataMap param = new DataMap();
		param.put("user_no",			authUserInfo.getString("user_no"));
		param.put("user_type",			authUserInfo.getString("user_type"));
		param.put("notice_parent_no",	hakwon_no);
		param.put("notice_type",		"004");
		param.put("content_type",		"001");//공지는 001이다.
		param.put("content_parent_no",	notice_no);
		param.put("notice_no",			notice_no);

		/**
		 * 문의 메일 조회
		 */
		DataMap noticeMap = noticeService.noticeDetail(param);

		sendColData(noticeMap, request, response);
	}

	/**
	 * 관리자에게 문의하기 등록
	 * @param request
	 * @param response
	 * @url /hakwon/adminQuestion/write.do
	 */
	@RequestMapping("/write")
	public void write(HttpServletRequest request, HttpServletResponse response) {

		/* 인증정보 */
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no			= request.getParameter("hakwon_no");
		String content				= request.getParameter("content");
		String title				= request.getParameter("title");

		String preview_content = HTMLCleaner.clean(content);
		if( preview_content.length() > 20 ) {
			preview_content = preview_content.substring(0, 20);
		}
		String file_no_list			= request.getParameter("file_no_list");

		DataMap param = new DataMap();
		param.put("notice_type",		"004");							// 관리자에게 문의 하기
		param.put("notice_parent_no",	hakwon_no);						// 학원번호
		param.put("title",				title);
		param.put("preview_content", 	preview_content);
		param.put("content", 			content);
		param.put("reply_yn",			"Y");							// 공지사항 댓글 허용
		param.put("reg_user_no", 		authUserInfo.get("user_no"));	// 파일 등록자
		param.put("file_no_list", 		file_no_list);					// 파일 번호들
		param.put("hakwon_no",			hakwon_no);						// 학원 번호
		param.put("is_file_view",		"1");
		param.put("target_user",		"");

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
	 * 관리자 문의하기 삭제
	 * @url /hakwon/adminQuestion/del.do
	 * @return
	 */
	@RequestMapping("/del")
	public void del(HttpServletRequest request, HttpServletResponse response) {

		/*	인증 정보	*/
		DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no	= request.getParameter("hakwon_no");
		String notice_no	= request.getParameter("notice_no");

		DataMap param = new DataMap();
		param.put("user_no",			authUserInfo.getString("user_no"));
		param.put("notice_no",			notice_no);

		/**
		 * 문의 메일 삭제
		 */
		noticeService.deleteNotice(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}