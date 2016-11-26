package hakwonband.admin.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.dao.HakwonDAO;
import hakwonband.admin.dao.TeacherDAO;
import hakwonband.admin.dao.UserDAO;
import hakwonband.util.DataMap;

/**
 * 선생님 서비스
 * @author bumworld
 *
 */
@Service
public class TeacherService {

	public static final Logger logger = LoggerFactory.getLogger(TeacherService.class);

	@Autowired
	private TeacherDAO teacherDAO;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private HakwonDAO hakwonDAO;

	/**
	 * 선생님 리스트
	 * @return
	 */
	public DataMap teacherList(DataMap param) {

		DataMap colData = new DataMap();

		List<DataMap> dataList = teacherDAO.teacherList(param);
		colData.put("dataList",	dataList);

		int dataCount	= teacherDAO.teacherCount(param);
		colData.put("dataCount",	dataCount);

		return colData;
	}

	/**
	 * 선생님 정보
	 * @return
	 */
	public DataMap teacherView(DataMap param) {

		DataMap colData = new DataMap();

		/**
		 * 사용자 정보
		 */
		param.put("user_type", HakwonConstant.UserType.TEACHER);
		DataMap userInfo = userDAO.userInfo(param);
		colData.put("userInfo",	userInfo);

		/**
		 * 학원 리스트
		 */
		List<DataMap> hakwonList	= teacherDAO.hakwonList(param);
		colData.put("hakwonList",	hakwonList);

		return colData;
	}
}