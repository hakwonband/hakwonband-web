package hakwonband.hakwon.service;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.media.MediaHttpUploader;
import com.google.api.client.googleapis.media.MediaHttpUploaderProgressListener;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.Video;
import com.google.api.services.youtube.model.VideoSnippet;
import com.google.api.services.youtube.model.VideoStatus;

import hakwonband.hakwon.dao.YoutubeDAO;
import hakwonband.hakwon.model.YoutubeTargetFileInfo;
import lombok.extern.slf4j.Slf4j;

/**
 * youtube 서비스
 * @author bumworld
 */
@Slf4j
@Service
public class YoutubeService {

	@Autowired
	private YoutubeDAO youtubeDAO;

	private static String VIDEO_FILE_FORMAT = "video/*";


	/**
	 * 업로드
	 */
	public String executeUpload(YoutubeTargetFileInfo targetFileInfo) {

		String youtube_id = "";
		File videoFile = null;
		try {
			String accessToken = youtubeDAO.accessToken();
			log.info("accessToken[{}]", accessToken);

			GoogleCredential googleCredential = new GoogleCredential().setAccessToken(accessToken);

			// YouTube object used to make all API requests.
			YouTube youtube = new YouTube.Builder(new NetHttpTransport(), new JacksonFactory(), googleCredential).setApplicationName("youtube-cmdline-uploadvideo-sample").build();

			Video videoObjectDefiningMetadata = new Video();
			VideoStatus status = new VideoStatus();
			status.setPrivacyStatus("unlisted");
			videoObjectDefiningMetadata.setStatus(status);

			String fileName = targetFileInfo.getFile_name();
			if( fileName.lastIndexOf(".") > 0 ) {
				fileName = fileName.substring(0, fileName.lastIndexOf("."));
			}

			VideoSnippet snippet = new VideoSnippet();
			snippet.setTitle("학원밴드 : " + fileName);
			snippet.setDescription("학원밴드\n"+fileName);

			List<String> tags = new ArrayList<String>();
			tags.add("hakwonband");
			tags.add("학원밴드");
			snippet.setTags(tags);

			videoObjectDefiningMetadata.setSnippet(snippet);

			String filePath = targetFileInfo.getFile_path_prefix() + targetFileInfo.getFile_path();

			videoFile = new File(filePath);

			InputStreamContent mediaContent = new InputStreamContent(VIDEO_FILE_FORMAT, new BufferedInputStream(new FileInputStream(videoFile)));
			mediaContent.setLength(videoFile.length());

			YouTube.Videos.Insert videoInsert = youtube.videos().insert("snippet,statistics,status", videoObjectDefiningMetadata, mediaContent);

			// Set the upload type and add event listener.
			MediaHttpUploader uploader = videoInsert.getMediaHttpUploader();
			uploader.setDirectUploadEnabled(false);

			MediaHttpUploaderProgressListener progressListener = new MediaHttpUploaderProgressListener() {
				public void progressChanged(MediaHttpUploader uploader) throws IOException {
					switch (uploader.getUploadState()) {
					case INITIATION_STARTED:
						log.debug("Initiation Started");
						break;
					case INITIATION_COMPLETE:
						log.debug("Initiation Completed");
						break;
					case MEDIA_IN_PROGRESS:
						log.debug("Upload in progress");
						log.debug("Upload percentage: " + uploader.getProgress());
						break;
					case MEDIA_COMPLETE:
						log.debug("Upload Completed!");
						break;
					case NOT_STARTED:
						log.debug("Upload Not Started!");
						break;
					}
				}
			};
			uploader.setProgressListener(progressListener);
			Video returnedVideo = videoInsert.execute();

			youtube_id = returnedVideo.getId();

			log.debug("  - Id: " + returnedVideo.getId());
			log.debug("  - Title: " + returnedVideo.getSnippet().getTitle());
			log.debug("  - Tags: " + returnedVideo.getSnippet().getTags());
			log.debug("  - Privacy Status: " + returnedVideo.getStatus().getPrivacyStatus());
			log.debug("  - Video Count: " + returnedVideo.getStatistics().getViewCount());
		} catch(Exception e) {
			log.error(targetFileInfo.toString(), e);
		} finally {
			if( videoFile != null ) {
				videoFile.delete();
			}
		}

		return youtube_id;
	}
}