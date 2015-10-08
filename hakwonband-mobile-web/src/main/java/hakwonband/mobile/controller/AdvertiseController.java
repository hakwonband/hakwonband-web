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
import hakwonband.mobile.service.AdvertiseService;
import hakwonband.util.DataMap;

/**
 * 광고 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/mobile/advert")
@Controller
public class AdvertiseController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(AdvertiseController.class);

	@Autowired
	private AdvertiseService advertiseService;

	/**
	 * 블럭 광고 리스트
	 * @param param
	 * @return
	 */
	@RequestMapping("/blockList")
	public void blockList(HttpServletRequest request, HttpServletResponse response) {
		DataMap param = new DataMap();

		String hakwonNo = request.getParameter("hakwon_no");
		param.put("hakwon_no", hakwonNo);

		/*	블럭 광고 리스트	*/
		List<DataMap> blockList = advertiseService.blockList(param);

		sendList(blockList, request, response);
	}

	/**
	 * 지역 광고 리스트
	 * @url /mobile/advert/areaList.do
	 * @param param
	 * @return
	 */
	@RequestMapping("/areaList")
	public void areaList(HttpServletRequest request, HttpServletResponse response) {
		DataMap param = new DataMap();

		String hakwonNo = request.getParameter("hakwon_no");
		param.put("hakwon_no", hakwonNo);

		/*	블럭 광고 리스트	*/
		List<DataMap> blockList = advertiseService.blockList(param);

		/*	지역 광고 리스트	*/
		List<DataMap> areaList = advertiseService.areaList(param);

		int blockSize = 0, areaSize = 0;
		if( blockList != null ) blockSize = blockList.size();
		if( areaList != null ) areaSize = areaList.size();

		DataMap colData = new DataMap();
/*
		if( blockSize == 0 && areaSize == 0 ) {
			List<DataMap> commList = advertiseService.commList(param);
			colData.put("commList",	commList);
		} else {
			colData.put("commList",	null);
		}
*/
		colData.put("blockList",	blockList);
		colData.put("areaList",		areaList);

		sendColData(colData, request, response);
	}
}