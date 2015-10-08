package hakwonband.manager.controller;

import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.manager.common.constant.HakwonConstant;
import hakwonband.manager.service.FileService;
import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;
import hakwonband.util.multi.ImageResizeUtil;
import hakwonband.util.multi.ThumbnailCreate;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;


@Controller
public class FileUploadController extends BaseAction {

	private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

	private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");

	@Autowired
	private FileService fileService;

	/**
	 * 업로드 디렉토리 경로
	 */
	private static String uploadDirPath = CommonConfig.getString("fileServer/storage/dir");
	private static final Integer uploadMaxSize = CommonConfig.getInteger("fileServer/upload/maxSize", 10485760);

	/**
	 * 파일 업로드
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/manager/upload", method = RequestMethod.POST)
	public void upload(HttpServletRequest request, HttpServletResponse response) throws Exception {

		DataMap colData = new DataMap();
		try {
			/*	인증 정보	*/
			DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
			MultiValueMap<String, MultipartFile> map = multipartRequest.getMultiFileMap();

			String uploadType	= multipartRequest.getParameter("uploadType");
			String hakwonNo		= multipartRequest.getParameter("hakwonNo");
			String classNo		= multipartRequest.getParameter("classNo");

			String toDay = sdf.format(new Date());
			if( CommonConstant.ServerType.local.equals(CommonConfig.getServerType()) ) {
				String localPath = request.getServletContext().getRealPath("");
				uploadDirPath = localPath+"/attached";
			}

			String newUploadDirPath = uploadDirPath+"/"+toDay+"/";

			File dirFilePath = new File(newUploadDirPath);
			if( !dirFilePath.exists() ) {
				dirFilePath.mkdirs();
			}

			String newFileName = UUID.randomUUID().toString() + authUserInfo.getString("user_no");
			String uploadFilePath = newUploadDirPath + newFileName;

			DataMap fileInfo = new DataMap();
			fileInfo.put("file_parent_type",	uploadType);
			fileInfo.put("save_file_name",		newFileName);
			fileInfo.put("file_path_prefix",	uploadDirPath);
			fileInfo.put("file_path",			"/"+toDay+"/"+newFileName);
			fileInfo.put("ip_address",			request.getRemoteAddr());
			fileInfo.put("user_no",				authUserInfo.getString("user_no"));

			fileInfo.put("hakwon_no",			hakwonNo);
			fileInfo.put("class_no",			classNo);

			if(map != null) {
				@SuppressWarnings("rawtypes")
				Iterator iter = map.keySet().iterator();
				while(iter.hasNext()) {
					List<MultipartFile> fileList =  map.get(iter.next());
					for(MultipartFile mpf : fileList) {

						/**
						 * 파일 확장자 분리
						 */
						String originFileName = mpf.getOriginalFilename();
						fileInfo.put("file_name",	originFileName);
						String fileExt	= "";
						if( originFileName.indexOf(".") > 0 ) {
							fileExt	= originFileName.substring(originFileName.lastIndexOf(".")+1, originFileName.length());
						}
						fileInfo.put("file_ext",	fileExt);

						/*	파일 이동	*/
						File newFile = new File(uploadFilePath);
						mpf.transferTo(newFile);

						/**
						 * 용량 체크
						 */
						if( "001".equals(uploadType) || "002".equals(uploadType) || "003".equals(uploadType) || "005".equals(uploadType) ) {
							/*	공지, 메세지, 이벤트, 학원소개는 파일 용량 체크 하지 않는다.	*/
						} else {
							if( uploadMaxSize < newFile.length() ) {
								throw new HKBandException("용량을 초과 했습니다.", "overSize");
							}
						}

						/*	파일 크기	*/
						fileInfo.put("file_size",	newFile.length());

						/*	파일 타입	*/
						String mimeType = (new Tika()).detect(newFile);
						fileInfo.put("file_ext_type",	mimeType);

						String imageYn		= "N";
						String fileUseYn	= "N";
						if( "image".equals(mimeType.split("/")[0]) && !"image/vnd.adobe.photoshop".equals(mimeType) ) {
							imageYn = "Y";

							if( CommonConstant.File.TYPE_PROFILE.equals(uploadType) ) {
								if( "image/vnd.adobe.photoshop".equals(mimeType) ) {
									/*	프로필 사진이면서 포토샵 파일이면 에러	*/
									throw new HKBandException("잘못된 요청 입니다.");
								}
								/**
								 * 프로필 사진은 용량이 커도 리싸이징하기 때문에 용량에 크게 상관  없다.
								 */
								if( 5500000 < newFile.length() ) {
									/*	프로필 사진이면서 용량이 5M 넘으면 에러	*/
									throw new HKBandException("잘못된 요청 입니다.");
								}
								/*	프로필 사진은 부모번호가 사용자 번호	*/
								fileInfo.put("file_parent_no",	authUserInfo.getString("user_no"));

								/*	프로필은 바로 사용한다.	*/
								fileUseYn = "Y";
							}

							/*	썸네일 생성	*/
							String thumbFilePath = newUploadDirPath+CommonConstant.FILE_SEPARATOR+newFileName+"_thumb";
							fileInfo.put("thumb_file_path", "/"+toDay+"/"+newFileName+"_thumb");
							if( CommonConfig.getServerType().equals("local") ) {
								ThumbnailCreate.createThumbJava(uploadFilePath, thumbFilePath, 200, 6);
							} else {
								if( CommonConstant.File.TYPE_PROFILE.equals(uploadType) ) {
									/**
									 * 사용자 프로필은 200x200으로 만든다.
									 */
									ThumbnailCreate.createThumb(ImageResizeUtil.createProfileShell(uploadFilePath, thumbFilePath));
								} else {
									ThumbnailCreate.createThumb(ImageResizeUtil.createAttatchThumbShell(uploadFilePath, thumbFilePath, mimeType));
								}
							}
						}
						fileInfo.put("file_use_yn",	fileUseYn);
						fileInfo.put("image_yn",	imageYn);
						fileInfo.put("mime_type",	mimeType);
					}
				}
			} else {
				throw new HKBandException();
			}
			long fileNo = fileService.insertFile(fileInfo);

			colData.put("fileNo",	fileNo);
			colData.put("filePath",	fileInfo.getString("file_path"));
			colData.put("thumbFilePath",	fileInfo.getString("thumb_file_path"));
			colData.put("fileName",	fileInfo.getString("file_name"));
			colData.put("imageYn",	fileInfo.getString("image_yn"));
			colData.put("mimeType",	fileInfo.getString("mime_type"));
		} catch(Exception e) {
			logger.error("", e);
			colData.put("error",	"fail");
		} finally {
			sendColData(colData, request, response);
		}
	}
}