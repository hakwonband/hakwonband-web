package hakwonband.admin.service;

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.dao.HakwonDAO;
import hakwonband.admin.dao.StudentDAO;
import hakwonband.admin.dao.UserDAO;
import hakwonband.util.DataMap;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 학생 서비스
 * @author bumworld
 *
 */
@Service
public class StudentService {

	public static final Logger logger = LoggerFactory.getLogger(StudentService.class);

	@Autowired
	private StudentDAO studentDAO;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private HakwonDAO hakwonDAO;

	/**
	 * 학생 리스트
	 * @return
	 */
	public DataMap studentList(DataMap param) {

		DataMap colData = new DataMap();

		List<DataMap> dataList = studentDAO.studentList(param);
		colData.put("dataList",	dataList);

		int dataCount	= studentDAO.studentCount(param);
		colData.put("dataCount",	dataCount);

		return colData;
	}

	/**
	 * 학생 정보
	 * @return
	 */
	public DataMap studentView(DataMap param) {

		DataMap colData = new DataMap();

		/**
		 * 사용자 정보
		 */
		param.put("user_type", HakwonConstant.UserType.STUDENT);
		DataMap userInfo = userDAO.userInfo(param);
		colData.put("userInfo",	userInfo);

		/**
		 * 사용자 학교 정보
		 */
		DataMap schoolInfo = userDAO.userSchoolInfo(param);
		colData.put("schoolInfo",	schoolInfo);

		/**
		 * 부모 리스트
		 */
		List<DataMap> parentList = userDAO.parentList(param);
		colData.put("parentList",	parentList);

		/**
		 * 학원 리스트
		 */
		List<DataMap> hakwonList	= hakwonDAO.userHakwonList(param);
		colData.put("hakwonList",	hakwonList);

		return colData;
	}

}