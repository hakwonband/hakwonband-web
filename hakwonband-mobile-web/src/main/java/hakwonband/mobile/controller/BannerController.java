package hakwonband.mobile.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.common.BaseAction;
import hakwonband.mobile.service.BannerService;
import hakwonband.util.DataMap;

/**
 * 베너 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/mobile/banner")
@Controller
public class BannerController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(BannerController.class);

	@Autowired
	private BannerService bannerService;

	/**
	 * 학원 베너 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/hakwonBannerList")
	public void hakwonBannerList(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("hakwon_no", request.getParameter("hakwon_no"));

		/* 학원 베너 리스트 */
		List<DataMap> bannerList = bannerService.hakwonBannerList(param);

		sendList(bannerList, request, response);
	}

	/**
	 * 지역 베너 리스트
	 * @param request
	 * @param response
	 */
	@RequestMapping("/localBannerList")
	public void localBannerList(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("hakwon_no", request.getParameter("hakwon_no"));

		param.put("sido",	request.getParameter("sido"));
		param.put("gugun",	request.getParameter("gugun"));
		param.put("dong",	request.getParameter("dong"));

		/* 지역 베너 리스트 */
		List<DataMap> bannerList = bannerService.localBannerList(param);

		sendList(bannerList, request, response);
	}
}