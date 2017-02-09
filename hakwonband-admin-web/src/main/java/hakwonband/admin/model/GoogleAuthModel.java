package hakwonband.admin.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 구글 인증 정보
 * @author bumworld
 *
 */
@Data
@EqualsAndHashCode(callSuper=false)
public class GoogleAuthModel {

	/**
	 * 인증 토큰
	 */
	private String access_token;

	/**
	 * 갱신 토큰
	 */
	private String refresh_token;

	/**
	 * 만료 시간
	 */
	private String token_expire_time;

	/**
	 * 이메일 주소
	 */
	private String email_addr;

}