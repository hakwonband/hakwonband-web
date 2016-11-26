package hakwonband.admin.controller;

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

import hakwonband.admin.common.constant.HakwonConstant;
import hakwonband.admin.service.ExcelUploadService;
import hakwonband.admin.service.FileService;
import hakwonband.common.BaseAction;
import hakwonband.common.constant.CommonConstant;
import hakwonband.common.exception.HKBandException;
import hakwonband.util.CommonConfig;
import hakwonband.util.DataMap;
import hakwonband.util.multi.ImageResizeUtil;
import hakwonband.util.multi.ThumbnailCreate;


@Controller
public class FileUploadController extends BaseAction {

	private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

	private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");

	@Autowired
	private FileService fileService;

	@Autowired
	private ExcelUploadService excelService;

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
	@RequestMapping(value = "/admin/upload", method = RequestMethod.POST)
	public void upload(HttpServletRequest request, HttpServletResponse response) throws Exception {

		DataMap colData = new DataMap();
		try {
			/*	인증 정보	*/
			DataMap authUserInfo = (DataMap)request.getAttribute(HakwonConstant.RequestKey.AUTH_USER_INFO);

			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
			MultiValueMap<String, MultipartFile> map = multipartRequest.getMultiFileMap();

			String uploadType = multipartRequest.getParameter("uploadType");

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

			DataMap fileInfo = new DataMap();
			fileInfo.put("file_parent_type",	uploadType);
			fileInfo.put("file_path_prefix",	uploadDirPath);
			fileInfo.put("ip_address",			request.getRemoteAddr());
			fileInfo.put("user_no",				authUserInfo.getString("user_no"));

			if(map != null) {
				@SuppressWarnings("rawtypes")
				Iterator iter = map.keySet().iterator();
				while(iter.hasNext()) {
					List<MultipartFile> fileList =  map.get(iter.next());
					for(MultipartFile mpf : fileList) {

						/*	파일 타입	*/
						String mimeType = (new Tika()).detect(mpf.getInputStream());
						fileInfo.put("file_ext_type",	mimeType);

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

						String newFileName = "";
						if( mimeType.indexOf("audio") == 0 || mimeType.indexOf("video") == 0 ) {
							newFileName = UUID.randomUUID().toString() + authUserInfo.getString("user_no")+"."+fileExt;
						} else {
							newFileName = UUID.randomUUID().toString() + authUserInfo.getString("user_no");
						}
						String uploadFilePath = newUploadDirPath + newFileName;

						fileInfo.put("save_file_name",		newFileName);
						fileInfo.put("file_path",			"/"+toDay+"/"+newFileName);


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

	/**
	 * 학원정보 엑셀 파일 업로드/insert
	 * @param request
	 * @param response
	 * @throws Exception
	 */
	@RequestMapping(value = "/admin/upload/excel", method = RequestMethod.POST)
	public void uploadExcel(HttpServletRequest request, HttpServletResponse response) throws Exception {
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		MultiValueMap<String, MultipartFile> map = multipartRequest.getMultiFileMap();
		String flag = "success";

		if( CommonConstant.ServerType.local.equals(CommonConfig.getServerType()) ) {
			String localPath = request.getServletContext().getRealPath("");
			uploadDirPath = localPath+"/attached";
		}

		String newUploadDirPath = uploadDirPath+"/excel/";
		File dirFilePath = new File(newUploadDirPath);
		if( !dirFilePath.exists() ) {
			dirFilePath.mkdirs();
		}

		DataMap fileInfo = new DataMap();

		if(map != null) {
			/*	엑셀 업로드 폴더의 파일 리스트 조회	*/

			@SuppressWarnings("rawtypes")
			Iterator iter = map.keySet().iterator();
			while(iter.hasNext()) {
				List<MultipartFile> fileList =  map.get(iter.next());
				for(MultipartFile mpf : fileList) {


					String originFileName = mpf.getOriginalFilename();
					fileInfo.put("originFile",	originFileName);

					/*	중복 이름의 파일 검사	*/
					File findFile = new File(newUploadDirPath + originFileName);
					if(findFile.exists()) {
						flag = "SAME_FILE";
						break;
					}

					/*	파일 확장자 분리	*/
					String fileTmpArr[] = originFileName.split("\\.");
					if(fileTmpArr == null || fileTmpArr.length != 2) {
						originFileName = String.valueOf(System.currentTimeMillis());
					}else {
						fileInfo.put("fileExt",	fileTmpArr[1]);
						// 같은 이름의 파일이 업로드 될때를 대비해서, 원본 파일 이름뒤에 타임마일을 붙여준다.
						//originFileName = fileTmpArr[0] + "_" + System.currentTimeMillis() + "." + fileTmpArr[1];
					}
					fileInfo.put("fileName",	originFileName);
					fileInfo.put("filePath", newUploadDirPath);

					/*	파일 이동	*/
					File newFile = new File(newUploadDirPath + originFileName);
					mpf.transferTo(newFile);

				}
			}
		} else {
			throw new HKBandException();
		}


		List<String> invalidList = null;		// invalid data list
		DataMap result = null;
		DataMap colData = new DataMap();
		try {
			if("SAME_FILE".equals(flag)) {
				flag = "error";
				colData.put("errMsg", "파일 업로드 실패. 같은 이름의 파일이 존재합니다.");
			} else {
				/*	excel insert	*/
				result = excelService.insertHakwon(fileInfo);

				colData.put("dataCount", result.get("dataCount"));

				/*	유효하지 않은 엑셀 데이터 일때	*/
				if(result.get("invalidList") != null) {
					invalidList = (List<String>)result.get("invalidList");
					flag = "invalid";
					colData.put("invalid", invalidList);
				}
			}
		} catch(Exception e) {
			logger.error("", e);
			flag = "error";
			colData.put("errMsg", e.getMessage());
		} finally {
			if(!"success".equals(flag)) {
				File deleteFile = new File(fileInfo.getString("filePath") + fileInfo.getString("fileName"));
				deleteFile.delete();
			}
		}
		colData.put("flag", flag);
		colData.put("fileName",	fileInfo.getString("fileName"));
		sendColData(colData, multipartRequest, response);
	}
}