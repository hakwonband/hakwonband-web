package hakwonband.admin.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import hakwonband.admin.service.HakwonCateService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.util.DataMap;

/**
 * 학원 카테 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/admin/hakwonCate")
@Controller
public class HakwonCateController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(HakwonCateController.class);

	@Autowired
	private HakwonCateService hakwonCateService;

	/**
	 * 학원 카테고리 리스트
	 * @param request
	 * @param response
	 * @param reqParam
	 *
	 * /admin/hakwonCate/cateList.do
	 *
	 */
	@RequestMapping("/cateList")
	public void hakwonCateList(HttpServletRequest request, HttpServletResponse response) {
		List<DataMap> hakwonCateList = hakwonCateService.hakwonCateList();

		sendList(hakwonCateList, request, response);
	}

	/**
	 * 카테고리 삭제
	 * @param request
	 * @param response
	 */
	@RequestMapping("/delete")
	public void deleteHakwonCate(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("cateCode", request.getParameter("cateCode"));

		String flag = hakwonCateService.deleteHakwonCate(param);

		sendFlag(flag, request, response);
	}

	/**
	 * 카테고리 수정
	 * @param request
	 * @param response
	 */
	@RequestMapping("/modify")
	public void modifyHakwonCate(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("cateCode", request.getParameter("cateCode"));
		param.put("cateName", request.getParameter("cateName"));
		param.put("cateOrder", request.getParameter("cateOrder"));

		hakwonCateService.modifyHakwonCate(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}

	/**
	 * 카테고리 등록
	 * @param request
	 * @param response
	 */
	@RequestMapping("/insert")
	public void insertHakwonCate(HttpServletRequest request, HttpServletResponse response) {

		DataMap param = new DataMap();
		param.put("cateName", request.getParameter("cateName"));
		param.put("cateOrder", request.getParameter("cateOrder"));

		hakwonCateService.insertHakwonCate(param);

		sendFlag(CommonConstant.Flag.success, request, response);
	}
}