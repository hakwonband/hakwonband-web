package hakwonband.mobile.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import hakwonband.common.BaseAction;
import hakwonband.mobile.common.constant.HakwonConstant;
import hakwonband.mobile.service.HakwonService;
import hakwonband.mobile.service.MobileService;
import hakwonband.util.DataMap;

/**
 * 학원 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/mobile/hakwon")
@Controller
public class HakwonController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(HakwonController.class);

	@Autowired
	private HakwonService hakwonService;

	@Autowired
	private MobileService mobileService;


	/**
	 * 학원 상세정보 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonDetail")
	public void hakwonDetail(HttpServletRequest request, HttpServletResponse response) {
		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		String hakwon_no = request.getParameter("hakwon_no");

		DataMap param = new DataMap();
		param.put("hakwon_no", hakwon_no);
		if( authUserInfo != null ) {
			param.put("user_no", authUserInfo.getString("user_no"));
		}

		/* 학원 상세정보 조회 */
		DataMap colData = hakwonService.hakwonDetail(param);
		sendColData(colData, request, response);
	}

	/**
	 * 학원 선생님 목록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonTeacherList")
	public void hakwonTeacherList(HttpServletRequest request, HttpServletResponse response) {
		DataMap param = new DataMap();
		param.put("hakwon_no",		request.getParameter("hakwon_no"));

		sendColData(hakwonService.getHakwonTeacherList(param), request, response);
	}

	/**
	 * 소속 반 전체의 선생님 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/allClassTeacherList")
	public void allClassTeacherList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no",	authUserInfo.get("user_no"));
		param.put("user_type",	authUserInfo.get("user_type"));

		sendColData(hakwonService.getAllClassTeacherList(param), request, response);
	}

	/**
	 * 학원 탈퇴
	 * @param request
	 * @param response
	 */
	@RequestMapping("/memberOut")
	public void memberOut(HttpServletRequest request, HttpServletResponse response) {
		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		DataMap param = new DataMap();
		param.put("user_no",	authUserInfo.get("user_no"));
		param.put("user_type",	authUserInfo.get("user_type"));
		param.put("hakwon_no",	request.getParameter("hakwon_no"));

		/*	멤버 탈퇴	*/
		String flag = hakwonService.executeHakwonMemberOut(param);

		sendFlag(flag, request, response);
	}

	/**
	 * 가입 학원 리스트
	 * @param request
	 * @param response
	 * @url /mobile/hakwon/hakwonList.do
	 */
	@RequestMapping("/hakwonList")
	public @ResponseBody void selectHakwonList(HttpServletRequest request, HttpServletResponse response) {

		/* 인증 정보 */
		DataMap authUserInfo = (DataMap) request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

		/* 파라미터 체크 and ... */
		DataMap param = new DataMap();
		param.put("user_no", authUserInfo.getString("user_no"));
		param.put("user_type", authUserInfo.getString("user_type"));

		/*	사용자 학원 리스트	*/
		DataMap hakwonInfo = mobileService.userHakwonList(param);

		sendColData(hakwonInfo, request, response);
	}

}