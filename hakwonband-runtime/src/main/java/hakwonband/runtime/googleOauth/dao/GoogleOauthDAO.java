package hakwonband.runtime.googleOauth.dao;

import hakwonband.runtime.googleOauth.model.GoogleAuthModel;

public interface GoogleOauthDAO {

	/**
	 * 구글 인증 정보 업데이트
	 * @param googleAuthModel
	 */
	public int googleAuthUpdate(GoogleAuthModel googleAuthModel);

	/**
	 * 구글 인증 정보
	 * @return
	 */
	public GoogleAuthModel getGoogleAuth();
}