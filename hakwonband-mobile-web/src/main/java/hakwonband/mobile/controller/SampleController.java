package hakwonband.mobile.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import hakwonband.common.BaseAction;

/**
 * 샘플 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/mobile/sample")
@Controller
public class SampleController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(SampleController.class);

	@Resource(name = "messageSourceAccessor")
	protected MessageSourceAccessor messageSource;

	/**
	 * 샘플 에디터
	 * @return
	 */
	@RequestMapping("/editor")
	public ModelAndView sampleEditor() throws Exception {

		return new ModelAndView("/sample/editor");
	}

	/**
	 * 샘플 페이징
	 * @return
	 */
	@RequestMapping("/paging")
	public ModelAndView samplePaging() {

		return new ModelAndView("/sample/paging");
	}
	
	@RequestMapping("/testBody")
	public @ResponseBody String testBody(HttpServletRequest request) {
		return "ok";
	}
}