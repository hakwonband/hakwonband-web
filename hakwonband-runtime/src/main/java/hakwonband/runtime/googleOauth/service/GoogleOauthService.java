package hakwonband.runtime.googleOauth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.runtime.googleOauth.dao.GoogleOauthDAO;

/**
 * 학원 엑셀
 * @author bumworld
 */
@Service
public class GoogleOauthService {

	public static final Logger logger = LoggerFactory.getLogger(GoogleOauthService.class);

	@Autowired
	GoogleOauthDAO googleOauthDAO;


}