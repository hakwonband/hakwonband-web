package hakwonband.runtime.youtube.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import hakwonband.runtime.youtube.model.TargetFileInfo;

/**
 * youtube 업로드
 * @author bumworld
 *
 */
public interface YoutubeDAO {

	/**
	 * 대상 리스트 조회
	 * @return
	 */
	public List<TargetFileInfo> targetList();

	/**
	 * 대상 삭제
	 * @param file_no
	 * @return
	 */
	public int targetRemove(@Param("file_no")long file_no);

	/**
	 * 인증 토큰 조회
	 * @return
	 */
	public String accessToken();

	/**
	 * 대상 등록
	 * @param runtime_id
	 * @param file_no
	 */
	public void targetInsert(@Param("runtime_id")String runtime_id, @Param("file_no")long file_no);

	/**
	 * youtube id 업데이트
	 * @param youtube_id
	 * @param file_no
	 */
	public void youtubeIDUpdate(@Param("youtube_id")String youtube_id, @Param("file_no")long file_no);
}