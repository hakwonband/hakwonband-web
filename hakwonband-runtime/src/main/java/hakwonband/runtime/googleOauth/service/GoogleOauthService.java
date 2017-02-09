package hakwonband.runtime.googleOauth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.social.google.connect.GoogleConnectionFactory;
import org.springframework.social.oauth2.AccessGrant;
import org.springframework.social.oauth2.OAuth2Operations;
import org.springframework.stereotype.Service;

import hakwonband.runtime.googleOauth.dao.GoogleOauthDAO;
import hakwonband.runtime.googleOauth.model.GoogleAuthModel;

/**
 * 구글 인증 서비스
 * @author bumworld
 */
@Service
public class GoogleOauthService {

	public static final Logger logger = LoggerFactory.getLogger(GoogleOauthService.class);

	@Autowired
	GoogleOauthDAO googleOauthDAO;

	@Autowired
	private GoogleConnectionFactory googleConnectionFactory;


	/**
	 * 구글 인증 정보 업데이트
	 */
	public void updateGoogleOauth() {
		GoogleAuthModel googleAuthModel = googleOauthDAO.getGoogleAuth();

		if( googleAuthModel == null ) {
			logger.error("googleAuthModel is null");
			return ;
		}

		OAuth2Operations oauthOperations = googleConnectionFactory.getOAuthOperations();
		AccessGrant accessGrant = oauthOperations.refreshAccess(googleAuthModel.getRefresh_token(), null);

		String access_token = accessGrant.getAccessToken();
		long expireTime = accessGrant.getExpireTime() / 1000;

		googleAuthModel.setAccess_token(access_token);
		googleAuthModel.setToken_expire_time(String.valueOf(expireTime));

		/**
		 * 인증 정보 업데이트
		 */
		googleOauthDAO.googleAuthUpdate(googleAuthModel);
	}
}