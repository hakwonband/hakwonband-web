package hakwonband.runtime.youtube.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.runtime.youtube.dao.YoutubeDAO;

/**
 * youtube 서비스
 * @author bumworld
 */
@Service
public class YoutubeService {

	public static final Logger logger = LoggerFactory.getLogger(YoutubeService.class);

	@Autowired
	private YoutubeDAO youtubeDAO;


	/**
	 * 업로드
	 */
	public void executeUpload() {

	}
}