package hakwonband.admin.controller;

import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.social.google.connect.GoogleConnectionFactory;
import org.springframework.social.oauth2.AccessGrant;
import org.springframework.social.oauth2.GrantType;
import org.springframework.social.oauth2.OAuth2Operations;
import org.springframework.social.oauth2.OAuth2Parameters;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import hakwonband.admin.model.GoogleAuthModel;
import hakwonband.admin.service.CommonService;
import lombok.extern.slf4j.Slf4j;

/**
 * 구글 콜백 컨트롤러
 *
 * http://local.hakwon.teamoboki.com:8080/oauth/youtube.do
 * https://admin.hakwonband.com/oauth/youtube.do
 *
 * @author bumworld
 *
 */
@Slf4j
@Controller
@RequestMapping("/oauth")
public class OauthGoogleController {

	@Autowired
	private GoogleConnectionFactory googleConnectionFactory;

	@Autowired
	private OAuth2Parameters youtubeOAuth2OldParameters;

	@Autowired
	private CommonService commonService;

	/**
	 * 권한 링크
	 * @param request
	 * @param response
	 */
	@RequestMapping(value = "/youtube")
	public ModelAndView getAuthRequestLink() {

		OAuth2Operations oauthOperations = googleConnectionFactory.getOAuthOperations();
		String redirectUrl = oauthOperations.buildAuthorizeUrl(GrantType.AUTHORIZATION_CODE, youtubeOAuth2OldParameters);

		log.debug("redirectUrl : " + redirectUrl);

		return new ModelAndView(new RedirectView(redirectUrl));
	}

	/**
	 * 권한 결과 콜백
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value = "/callback")
	public ModelAndView authCallback(@RequestParam("code") String code) {
		log.debug("code : " + code);

		OAuth2Parameters oauth2Parameters = youtubeOAuth2OldParameters;

		String url = "";
		/**
		 * 토큰 정보 받고 메일 주소 조회 한다.
		 */
		if( StringUtils.isNotBlank(code) ) {
			try {
				OAuth2Operations oauthOperations = googleConnectionFactory.getOAuthOperations();
				AccessGrant accessGrant = oauthOperations.exchangeForAccess(code, oauth2Parameters.getRedirectUri(), null);
				if(log.isDebugEnabled()) {
					long currentTime = new Date().getTime();
					log.debug("access token [" + accessGrant.getAccessToken() + "]");
					log.debug("refresh token [" + accessGrant.getRefreshToken() + "]");
					log.debug("scope [" + accessGrant.getScope()+ "]");
					log.debug("expire time [" + accessGrant.getExpireTime() + "]");
					log.debug("left time [" + (accessGrant.getExpireTime() - currentTime) + "]");
				}
				String accessToken = accessGrant.getAccessToken();
				Long expireTime =  accessGrant.getExpireTime();
				String refreshToken = accessGrant.getRefreshToken();

				String expireTimeStr = String.valueOf(expireTime);
				if( expireTimeStr.length() > 10 ) {
					expireTimeStr = expireTimeStr.substring(0,  10);
				}


				GoogleAuthModel googleAuthModel = new GoogleAuthModel();
				googleAuthModel.setAccess_token(accessToken);
				googleAuthModel.setEmail_addr("hakwonband@gmail.com");
				googleAuthModel.setRefresh_token(refreshToken);
				googleAuthModel.setToken_expire_time(expireTimeStr);
				commonService.updateGoogleAuth(googleAuthModel);

				url = "/oauth_result.html";

				log.info("url : " + url);
			} catch(Exception e) {
				log.error("", e);
			}
		}

		return new ModelAndView(new RedirectView(url));
	}
}