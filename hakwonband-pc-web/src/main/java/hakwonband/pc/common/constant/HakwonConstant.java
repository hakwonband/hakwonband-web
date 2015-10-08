package hakwonband.pc.common.constant;

import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;

import com.fasterxml.jackson.databind.ObjectMapper;


public class HakwonConstant {

	public class RequestKey {
		public static final String AUTH_USER_INFO = "request_auth_user_info_";
	}

	public class Common {
		/**
		 * 한 페이지당 보여줄 리스트의 갯수.
		 */
		public static final int SELECT_SCALE = 20;
	}

	/**
	 * 메시지
	 */
	public static final String MESSAGE = CommonConfig.getString("message");

	/**
	 * 파일서버
	 * @author bumworld
	 *
	 */
	public static class FileServer {
		public static final String ATTATCH_DOMAIN	= CommonConfig.getString("fileServer/attatchDomain");
		public static final String DOWN_DOMAIN	= CommonConfig.getString("fileServer/downDomain");
	}

	/**
	 * 외부 api 정보
	 * @author bumworld
	 *
	 */
	public static class Api {
		public static final String JUSO_CONFIRM_KEY = CommonConfig.getString("api/juso/confirmmKey");
	}

	/**
	 * 싸이트 url
	 * @author bumworld.kim
	 *
	 */
	public static class Site {
		public static final String ADMIN = CommonConfig.getString("site/admin");
		public static final String HAKWON = CommonConfig.getString("site/hakwon");
		public static final String MANAGER = CommonConfig.getString("site/manager");
		public static final String MOBILE = CommonConfig.getString("site/mobile");
		public static final String PC = CommonConfig.getString("site/pc");

	}

	/**
	 * 캐시 키
	 * @author bumworld
	 *
	 */
	public static class Memcached {
		public static final String PARTNER_LIST		= "_MEMCACHED_PARTNER_LIST_";
		public static final String MEMBER_LIST		= "_MEMCACHED_MEMBER_LIST_";
		public static final String USER_AUTH_KEY	= "_MEMCACHED_USER_AUTH_KEY_";
		public static final String USER_MAIN_INFO	= "_MEMCACHED_USER_MAIN_INFO_";
		public static final String USER_SIMPLE_KEY	= "_MEMCACHED_USER_SIMPLE_KEY_";
	}

	/**
	 * 페이지 스케일
	 * @author
	 */
	public static class PageScale {
		public static final int ADVERTISE_REQ		= 10;	// 광고 요청
		public static final int USER_REQ			= 10;	// 회원 요청
		public static final int CLASS_REQ			= 6;	// 학원내 반 목록 요청
		public static final int MESSAGE_REQ			= 20;	// 메세지 요청
		public static final int NOTICE_REQ			= 20;	// 공지사항 요청
		public static final int EVENT_REQ			= 20;	// 이벤트 요청
		public static final int PARENT_LIST			= 10;	// 학부모 리스트
		public static final int STUDENT_LIST		= 10;	// 학생 리스트
	}

	/**
	 * 사용자 타입
	 * @author bumworld
	 *
	 */
	public static class UserType {
		public static final String ADMIN		= "001";
		public static final String MANAGER		= "002";
		public static final String WONJANG		= "003";
		public static final String TEACHER		= "004";
		public static final String PARENT		= "005";
		public static final String STUDENT		= "006";
	}

	/**
	 * 체크 값
	 * @author bumworld
	 *
	 */
	public static class Valid {
		/**
		 * 최대 길이 상수 정의
		 * @author bumworld
		 *
		 */
		public static class MaxLen {
			/*	연락처 최대 길이	*/
			public static final int PHONE = 20;

			/*	사용자 이름 최대 길이	*/
			public static final int USER_NAME = 20;

			/*	사용자 직책 최대 길이	*/
			public static final int USER_DUTY = 20;

			/*	사용자 팀이름 최대 길이	*/
			public static final int TEAM_NAME = 20;

			/*	사용자 주요 업무 최대 길이 	*/
			public static final int MAIN_JOB = 60;

			/*	사용자 이메일 최대 길이	*/
			public static final int USER_EMAIL = 20;

			/*	사용자 url 최대 길이	*/
			public static final int USER_URL = 100;

			/*	패스워드 최대 길이	*/
			public static final int PASSWORD = 15;

			/*	태그 최대 길이	*/
			public static final int TAG = 30;

			/*	의사결정 최대 길이	*/
			public static final int DECISION_DESC = 300;
		}

		/**
		 * 최소 길이
		 * @author bumworld
		 *
		 */
		public static class MinLen {
			/*	패스워드 최소 길이	*/
			public static final int PASSWORD = 6;
		}
	}

	/**
	 * 상수 json 문자열
	 * @return
	 */
	public static String getConstantJson() {
		try {
			DataMap dataMap = new DataMap();

			/*	서버 타입	*/
			dataMap.put("ServerType", CommonConfig.getServerType());

			/*	파일 서버	*/
			DataMap fileServer = new DataMap();
			fileServer.put("ATTATCH_DOMAIN",	FileServer.ATTATCH_DOMAIN);
			fileServer.put("DOWN_DOMAIN",		FileServer.DOWN_DOMAIN);

			dataMap.put("FileServer", fileServer);

			/**
			 * api
			 */
			DataMap apiMap = new DataMap();
			apiMap.put("JUSO_CONFIRM_KEY", Api.JUSO_CONFIRM_KEY);

			dataMap.put("Api", apiMap);

			/**
			 * site
			 */
			DataMap siteMap = new DataMap();
			siteMap.put("ADMIN", Site.ADMIN);
			siteMap.put("HAKWON", Site.HAKWON);
			siteMap.put("MANAGER", Site.MANAGER);
			siteMap.put("MOBILE", Site.MOBILE);
			siteMap.put("PC", Site.PC);

			dataMap.put("Site", siteMap);

			/**
			 * 사용자 타입
			 */
			DataMap userType = new DataMap();
			userType.put("ADMIN", UserType.ADMIN);
			userType.put("MANAGER", UserType.MANAGER);
			userType.put("WONJANG", UserType.WONJANG);
			userType.put("TEACHER", UserType.TEACHER);
			userType.put("STUDENT", UserType.STUDENT);
			userType.put("PARENT", UserType.PARENT);

			dataMap.put("UserType", userType);

			/*	체크값	*/
			DataMap valid = new DataMap();
			DataMap maxLen = new DataMap();
			maxLen.put("PHONE",			Valid.MaxLen.PHONE);
			maxLen.put("USER_NAME",		Valid.MaxLen.USER_NAME);
			maxLen.put("USER_DUTY",		Valid.MaxLen.USER_DUTY);
			maxLen.put("TEAM_NAME",		Valid.MaxLen.TEAM_NAME);
			maxLen.put("MAIN_JOB",		Valid.MaxLen.MAIN_JOB);
			maxLen.put("USER_EMAIL",	Valid.MaxLen.USER_EMAIL);
			maxLen.put("USER_URL",		Valid.MaxLen.USER_URL);
			maxLen.put("PASSWORD",		Valid.MaxLen.PASSWORD);
			maxLen.put("TAG",			Valid.MaxLen.TAG);

			DataMap minLen = new DataMap();
			minLen.put("PASSWORD", Valid.MinLen.PASSWORD);

			valid.put("MaxLen", maxLen);
			valid.put("MinLen", minLen);

			dataMap.put("Valid", valid);

			DataMap common = new DataMap();
			common.put("SELECT_SCALE", Common.SELECT_SCALE);

			dataMap.put("Common", common);

			String jsonObjStr = (new ObjectMapper()).writeValueAsString(dataMap);
			return jsonObjStr;
		} catch(Exception e) {
			e.printStackTrace();
			return "{'flag':'fail'}";
		}
	}
}