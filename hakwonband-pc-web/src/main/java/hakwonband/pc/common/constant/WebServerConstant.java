package hakwonband.pc.common.constant;

import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;

import java.util.List;

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

		public static final List<String> UPLOAD_PORT_LIST = CommonConfig.getList("fileServer/uploadPort");
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
	 * 기타 공통 변수
	 * @author nowdream1
	 *
	 */
	public static class Etc {
		public static final int IMG_PAGE_SCALE		= 3;	// MYB 이미지 뷰어, LIMIT 갯수
		public static final int FILE_PAGE_SCALE		= 3;	// MYB 파일 뷰어, LIMIT 갯수
		public static final int CONTENT_PAGE_SCALE	= 5;	// 컨텐츠 페이지 스케일
	}

	/*	푸시 서버 호스트	*/
	public static final String pushServerHost = CommonConfig.getString("push/serverHost");

	/**
	 * 푸시 관련 변수
	 * @author kyeol
	 *
	 */
	public static class PushType{
		public static final String REPLY_MENTION			= "002";	// 리플에서 호출
		public static final String CONTENT_SHARE			= "003";	// 컨텐츠 공유

		public static final String CONFIRM_RECIVE			= "020";	// 의사결정 받음
		public static final String CONFIRM_CHANGE			= "021";	// 의사결정 변경
		public static final String CONFIRM_ALLOW			= "022";	// 의사결정 승인
		public static final String CONFIRM_DENY				= "023";	// 의사결정 반려

		public static final String PROJECT_INVITE_RECIVE	= "030";	// 프로젝트 초대 요청
		public static final String PROJECT_INVITE_ALLOW		= "031";	// 프로젝트 초대 수락
		public static final String PROJECT_INVITE_DENY		= "032";	// 프로젝트 초대 거절
		public static final String PROJECT_MEMBER_WITH_DRAW	= "033";	// 프로젝트 멤버 탈퇴

		public static final String TODO_RECIVE				= "040";	// 할일 받음
		public static final String TODO_CHANGE				= "041";	// 할일 변경
		public static final String TODO_COMPLETE			= "042";	// 할일 완료

		public static final String PARTNER_RECIVE			= "050";	// 파트너 요청 알림
		public static final String PARTNER_ALLOW			= "051";	// 파트너 수락 알림
		public static final String PARTNER_DENY				= "052";	// 파트너 거절 알림

		public static final String MAIL_CRAWLING_SUCCESS_F	= "060";	// 메일 Crawling 성공 (최초)
		public static final String MAIL_CRAWLING_SUCCESS_E	= "061";	// 메일 Crawling 성공 (기존 사용자)

		public static final String RELOAD_PROJECT_MEMBER	= "071";	// 프로젝트 멤버 갱신
		public static final String RELOAD_MYB_PARTNER		= "072";	// 파트너 갱신
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
	 * 검색엔진 상수 정의
	 * @author bumworld
	 *
	 */
	public static class ElasticSearch {

		public static final String DOCUMENT_DELIMITER = "@";			// 콜라비 구분자
		public static final String CONTENT_PROJECT_TYPE = "001";		// 001 프로젝트
		public static final String CONTENT_MYB_TYPE = "002";			// 002 마이비

		public static final String IDX_TYPE_WRITE = "write";			// 인덱싱 타입 쓰기
		public static final String IDX_TYPE_UPDATE = "update";			// 인덱싱 타입 수정
	}

	/**
	 * 상수 json 문자열
	 * @return
	 */
	public static String getConstantJson() {
		try {
			DataMap dataMap = new DataMap();

			/*	푸시 서버	*/
			dataMap.put("pushServerHost",	pushServerHost);

			/*	업로드	*/
			DataMap fileServer = new DataMap();
			fileServer.put("UPLOAD_URL",		FileServer.UPLOAD_URL);
			fileServer.put("DOWN_URL",			FileServer.DOWN_URL);
			fileServer.put("UPLOAD_PORT_LIST",	FileServer.UPLOAD_PORT_LIST);


			dataMap.put("FileServer", fileServer);

			/*	검색엔진 상수	*/
			DataMap elasticSearch = new DataMap();
			elasticSearch.put("DOCUMENT_DELIMITER",		ElasticSearch.DOCUMENT_DELIMITER);
			elasticSearch.put("CONTENT_PROJECT_TYPE",	ElasticSearch.CONTENT_PROJECT_TYPE);
			elasticSearch.put("CONTENT_MYB_TYPE",		ElasticSearch.CONTENT_MYB_TYPE);
			elasticSearch.put("IDX_TYPE_WRITE",			ElasticSearch.IDX_TYPE_WRITE);
			elasticSearch.put("IDX_TYPE_UPDATE",		ElasticSearch.IDX_TYPE_UPDATE);

			dataMap.put("ElasticSearch", elasticSearch);

			/*	푸시타입 상수	*/
			DataMap pushType = new DataMap();
			pushType.put("REPLY_MENTION",			PushType.REPLY_MENTION);
			pushType.put("CONTENT_SHARE",			PushType.CONTENT_SHARE);
			pushType.put("CONFIRM_RECIVE",			PushType.CONFIRM_RECIVE);
			pushType.put("CONFIRM_CHANGE",			PushType.CONFIRM_CHANGE);
			pushType.put("CONFIRM_ALLOW",			PushType.CONFIRM_ALLOW);
			pushType.put("CONFIRM_DENY",			PushType.CONFIRM_DENY);
			pushType.put("PROJECT_INVITE_RECIVE",	PushType.PROJECT_INVITE_RECIVE);
			pushType.put("PROJECT_INVITE_ALLOW",	PushType.PROJECT_INVITE_ALLOW);
			pushType.put("PROJECT_INVITE_DENY",		PushType.PROJECT_INVITE_DENY);
			pushType.put("PROJECT_MEMBER_WITH_DRAW",PushType.PROJECT_MEMBER_WITH_DRAW);
			pushType.put("TODO_RECIVE",				PushType.TODO_RECIVE);
			pushType.put("TODO_CHANGE",				PushType.TODO_CHANGE);
			pushType.put("TODO_COMPLETE",			PushType.TODO_COMPLETE);
			pushType.put("PARTNER_RECIVE",			PushType.PARTNER_RECIVE);
			pushType.put("PARTNER_ALLOW",			PushType.PARTNER_ALLOW);
			pushType.put("PARTNER_DENY",			PushType.PARTNER_DENY);
			pushType.put("MAIL_CRAWLING_SUCCESS_F",	PushType.MAIL_CRAWLING_SUCCESS_F);
			pushType.put("MAIL_CRAWLING_SUCCESS_E",	PushType.MAIL_CRAWLING_SUCCESS_E);
			pushType.put("RELOAD_PROJECT_MEMBER",	PushType.RELOAD_PROJECT_MEMBER);
			pushType.put("RELOAD_MYB_PARTNER",		PushType.RELOAD_MYB_PARTNER);

			dataMap.put("PushType", pushType);

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