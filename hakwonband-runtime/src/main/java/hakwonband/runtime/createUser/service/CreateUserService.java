package hakwonband.runtime.createUser.service;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.exception.HKBandException;
import hakwonband.runtime.createUser.dao.CreateUserDAO;
import hakwonband.util.DataMap;
import hakwonband.util.SecuUtil;

/**
 * 사용자 생성
 * @author bumworld
 */
@Service
public class CreateUserService {

	public static final Logger logger = LoggerFactory.getLogger(CreateUserService.class);

	@Autowired
	private CreateUserDAO createUserDAO;

	/**
	 * 학생 생성
	 */
	public void createStudent() {

		String user_name = "자동생성_학생_";
		String user_email = "auto_gen_st_";
		String hakwon_codes = "1, 2, 9, 10, 11, 12, 13, 14, 15, 16, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 484, 485, 486";
		for(int i=0; i<100; i++) {
			DataMap param = new DataMap();
			param.put("user_type",		"006");
			param.put("user_email",		user_email+i);
			param.put("user_id",		user_email+i);
			param.put("user_password",	SecuUtil.sha256("1111"));

			/* 사용자 기본정보 등록 */
			int resultUser = createUserDAO.insertUser(param);
			if (resultUser != 1) {
				throw new HKBandException("UserDAO.insertUser error");
			}

			long lastId = param.getLong("idx");
			param.put("user_no",		lastId);
			param.put("user_name",		user_name+i);
			param.put("user_gender",	i/2==0?"M":"F");
			param.put("user_birthday",	"1985-07-15");
			param.put("tel1_no",		"010-7845-7412");
			param.put("agree01",		"Y");
			param.put("agree02",		"Y");

			/* 사용자 부가정보 등록 */
			int resultUserInfo = createUserDAO.insertUserInfo(param);
			if (resultUserInfo != 1) {
				throw new HKBandException("UserDAO.insertUserInfo error");
			}

			param.put("school_name",	"백운 초등학교");
			param.put("school_level",	"001");
			param.put("level",			"4");

			/* 학생 가입시 학교 및 학년 정보 등록 */
			int resultSchool = createUserDAO.insertUserSchool(param);
			if (resultSchool != 1) {
				throw new HKBandException("UserDAO.insertUserSchool error");
			}

			/* 회원 가입시 학원 등록을 같이 한 경우*/
			if ( StringUtils.isNotBlank(hakwon_codes) ) {
				String[] hakwon_code = hakwon_codes.split(",");
				for (String putCode:hakwon_code) {
					param.put("hakwon_no", putCode);
					createUserDAO.insertHakwonMember(param);
				}
			}

			System.out.println(param.getString("user_name") + " 생성~");
		}
	}
}