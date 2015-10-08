package hakwonband.manager.controller;

import hakwonband.common.BaseAction;
import hakwonband.manager.service.AddressService;
import hakwonband.util.DataMap;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * address 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/manager/address")
@Controller
public class AddressController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(AddressController.class);

	@Autowired
	private AddressService addressService;

	/**
	 * 주소 동 검색
	 * /manager/address/searchOldDong.do
	 * @return
	 */
	@RequestMapping("/searchOldDong")
	public void searchOldDong(HttpServletRequest request, HttpServletResponse response) {

		String searchOldDong = request.getParameter("searchOldDong");

		DataMap param = new DataMap();
		param.put("searchOldDong",	searchOldDong);

		List<DataMap> oldSearchList = addressService.searchOldDong(param);

		sendList(oldSearchList, request, response);
	}

	/**
	 * 시도 리스트
	 * @return
	 * @url /manager/address/sidoList.do
	 */
	@RequestMapping("/sidoList")
	public void sidoList(HttpServletRequest request, HttpServletResponse response) {
		DataMap param = new DataMap();

		List<String> sidoList = addressService.sidoList(param);

		sendList(sidoList, request, response);
	}

	/**
	 * 구군 리스트
	 * @param sido
	 * @return
	 * @url /manager/address/gugunList.do
	 */
	@RequestMapping("/gugunList")
	public void gugunList(HttpServletRequest request, HttpServletResponse response) {
		DataMap param = new DataMap();

		String sido = request.getParameter("sido");
		param.put("sido",	sido);

		List<String> gugunList = addressService.gugunList(param);

		sendList(gugunList, request, response);
	}
}