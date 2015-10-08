package hakwonband.test.common.constant;

import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;

import com.fasterxml.jackson.databind.ObjectMapper;


/**
 * 공통으로 사용하는 변수이름
 * @author bumworld
 *
 */
public class WebServerConstant {

	/**
	 * 메시지
	 */
	public static final String MESSAGE = CommonConfig.getString("message");

	/**
	 * 업로드
	 * @author bumworld
	 *
	 */
	public static class FileServer {
		public static final String UPLOAD_URL	= CommonConfig.getString("fileServer/uploadUrl");
		public static final String DOWN_URL		= CommonConfig.getString("fileServer/downUrl");
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
		public static final int CLASS_REQ			= 6;	// 학원내 반 요청
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

			/*	업로드	*/
			DataMap fileServer = new DataMap();
			fileServer.put("UPLOAD_URL",		FileServer.UPLOAD_URL);
			fileServer.put("DOWN_URL",			FileServer.DOWN_URL);


			dataMap.put("FileServer", fileServer);

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

			String jsonObjStr = (new ObjectMapper()).writeValueAsString(dataMap);
			return jsonObjStr;
		} catch(Exception e) {
			e.printStackTrace();
			return "{'flag':'fail'}";
		}
	}
}