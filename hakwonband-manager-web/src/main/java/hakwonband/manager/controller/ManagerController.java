package hakwonband.manager.controller;

import hakwonband.common.BaseAction;
import hakwonband.manager.service.HakwonService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 매니저 컨트롤러
 * @author bumworld
 *
 */
@RequestMapping("/manager")
@Controller
public class ManagerController extends BaseAction {

	public static final Logger logger = LoggerFactory.getLogger(ManagerController.class);

	@Autowired
	private HakwonService hakwonService;
}