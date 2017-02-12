package hakwonband.hakwon.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 대상 파일 정보
 * @author bumworld
 *
 */
@Data
@EqualsAndHashCode
public class YoutubeTargetFileInfo {

	/**
	 * 파일 디렉토리 정보
	 */
	private String file_path_prefix;

	/**
	 * 파일 경로
	 */
	private String file_path;

	/**
	 * 파일 이름
	 */
	private String file_name;
}