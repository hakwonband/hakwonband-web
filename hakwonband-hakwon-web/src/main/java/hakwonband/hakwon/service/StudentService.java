	package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.hakwon.common.constant.HakwonConstant;
import hakwonband.hakwon.dao.HakwonDAO;
import hakwonband.hakwon.dao.StudentDAO;
import hakwonband.hakwon.dao.UserDAO;
import hakwonband.util.DataMap;

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
	 * 반에 속하지 않은 학생 리스트
	 * @return
	 */
	public List<DataMap> notClass(DataMap param) {

		List<DataMap> dataList = studentDAO.notClass(param);

		return dataList;
	}

	/**
	 * 학생 수정
	 * @return
	 */
	public void updateStudent(DataMap param) {

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
		 * 학원 반 리스트
		 */
		List<DataMap> hakwonClassList	= hakwonDAO.hakwonUserClassList(param);
		colData.put("hakwonClassList",	hakwonClassList);

		return colData;
	}


	/**
	 * 반 소속 학생 리스트
	 * @return
	 */
	public DataMap classStudentList(DataMap param) {

		DataMap colData = new DataMap();

		List<DataMap> dataList = studentDAO.classStudentList(param);
		colData.put("dataList",	dataList);

		int dataCount	= studentDAO.classStudentCount(param);
		colData.put("dataCount",	dataCount);

		return colData;
	}

	/**
	 * 학생의 학원 수납일 업데이트
	 * @param map
	 */
	public void updateReceiptDate(DataMap param) {
		userDAO.updateReceiptDate(param);
	}

}