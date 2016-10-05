	package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
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
	 * 학생 이메일 주소 체크
	 * @return
	 */
	public int checkStudentEmail(DataMap param) {
		return userDAO.checkStudentEmail(param);
	}

	/**
	 * 학생 수정
	 * @return
	 */
	public void updateStudent(DataMap param) {
		DataMap authUserInfo = (DataMap)param.get("authUserInfo");

		DataMap checkParam = new DataMap();
		checkParam.put("user_no",	authUserInfo.getString("user_no"));
		checkParam.put("user_type",	authUserInfo.getString("user_type"));
		checkParam.put("hakwon_no",	param.getString("hakwon_no"));
		checkParam.put("student_user_no",	param.getString("student_user_no"));

		/*	학생 권한 체크	*/
		DataMap checkMap = studentDAO.studentRoleCheck(checkParam);
		if( checkMap.getInt("cnt") == 1 && checkMap.getInt("role_cnt") == 1 ) {
		} else {
			System.out.println("checkMap : " + checkMap);
			throw new HKBandException("권한 실패~");
		}


		/*	사용자 정보 업데이트	*/
		DataMap userInfoParam = new DataMap();
		userInfoParam.put("user_no",		param.getString("student_user_no"));
		userInfoParam.put("user_name",		param.getString("user_name"));
		userInfoParam.put("user_gender",	param.getString("user_gender"));
		userInfoParam.put("user_birthday",	param.getString("user_birthday"));
		userInfoParam.put("tel1_no",		param.getString("tel1_no"));
		userDAO.updateUserInfo(userInfoParam);

		/*	이메일 및 패스워드 업데이트	*/
		DataMap userParam = new DataMap();
		userParam.put("user_password",	param.getString("user_pwd"));
		userParam.put("user_email",		param.getString("user_email"));
		userParam.put("user_no",		param.getString("student_user_no"));

		if( param.isNull("user_pwd") && param.isNull("user_email") ) {
		} else {
			userDAO.updateUser(userParam);
		}

		/**
		 * 학교 정보 수정
		 */
		DataMap schoolParam = new DataMap();
		schoolParam.put("school_name",	param.getString("school_name"));
		schoolParam.put("school_level",	param.getString("school_level"));
		schoolParam.put("level",		param.getString("school_level_level"));
		schoolParam.put("user_no",		param.getString("student_user_no"));
		int cnt = studentDAO.updateSchool(schoolParam);
		if( cnt == 0 ) {
			studentDAO.insertStudentSchool(schoolParam);
		}
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

	/**
	 * 학부모 맵핑
	 * @param param
	 */
	public String executeParentMapping(DataMap param) {
		String flag = "";

		int checkCnt = studentDAO.parentMappingMemberCheck(param);
		if( checkCnt != 2 ) {
			flag = "not_member";
		} else {
			studentDAO.parentMapping(param);
			flag = CommonConstant.Flag.success;
		}

		return flag;
	}

	/**
	 * 학부모 맵핑 삭제
	 * @param param
	 */
	public void executeParentMappingDel(DataMap param) {
		int checkCnt = studentDAO.parentMappingDel(param);
		if( checkCnt != 1 ) {
			throw new HKBandException();
		}
	}
}