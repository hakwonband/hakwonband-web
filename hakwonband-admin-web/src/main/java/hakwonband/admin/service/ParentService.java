package hakwonband.admin.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.dao.HakwonDAO;
import hakwonband.admin.dao.ParentDAO;
import hakwonband.admin.dao.UserDAO;
import hakwonband.util.DataMap;

/**
 * 학부모 서비스
 * @author bumworld
 *
 */
@Service
public class ParentService {

	public static final Logger logger = LoggerFactory.getLogger(ParentService.class);

	@Autowired
	private ParentDAO parentDAO;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private HakwonDAO hakwonDAO;


	/**
	 * 학부모 리스트
	 * @return
	 */
	public DataMap parentList(DataMap param) {

		DataMap colData = new DataMap();

		List<DataMap> dataList = parentDAO.parentList(param);
		colData.put("dataList",	dataList);

		int dataCount	= parentDAO.parentCount(param);
		colData.put("dataCount",	dataCount);

		return colData;
	}

	/**
	 * 학부모 정보
	 * @return
	 */
	public DataMap parentView(DataMap param) {

		DataMap colData = new DataMap();

		/**
		 * 사용자 정보
		 */
		param.put("user_type", HakwonConstant.UserType.PARENT);
		DataMap userInfo = userDAO.userInfo(param);
		colData.put("userInfo",	userInfo);

		/**
		 * 자식 리스트
		 */
		List<DataMap> childList = userDAO.childList(param);
		colData.put("childList",	childList);

		/**
		 * 학원 리스트
		 */
		List<DataMap> hakwonList	= hakwonDAO.userHakwonList(param);
		colData.put("hakwonList",	hakwonList);

		return colData;
	}
}