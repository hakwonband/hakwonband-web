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
import hakwonband.hakwon.service.FileService;
import hakwonband.util.DataMap;

/**
 * 테스트 API 컨트롤러 (트랜잭션 처리 없이 DAO, XML만 존재하는 몇몇 기능의 단독 테스트를 위해 생성)
 * @author jrlim
 *
 */
@RequestMapping("/hakwon/test")
@Controller
public class TestApiController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(TestApiController.class);

	@Autowired
	private FileService fileService;

	/**
	 * 파일 리스트 조회
	 * @param request
	 * @param response
	 */
	@RequestMapping("/fileList")
	public void fileList(HttpServletRequest request, HttpServletResponse response) {

		String file_parent_no	= request.getParameter("file_parent_no");
		String reg_user_no		= request.getParameter("reg_user_no");

		DataMap param = new DataMap();
		param.put("file_parent_no",	file_parent_no);
		param.put("reg_user_no",	reg_user_no);

		/* 파일 리스트 */
		List<DataMap> fileList = fileService.fileList(param);

		DataMap colData = new DataMap();
		colData.put("fileList", 			fileList);

		sendColData(colData, request, response);
	}

}