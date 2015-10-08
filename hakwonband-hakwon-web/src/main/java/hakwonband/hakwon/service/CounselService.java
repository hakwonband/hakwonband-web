package hakwonband.hakwon.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import hakwonband.common.exception.HKBandException;
import hakwonband.hakwon.dao.CounselDAO;
import hakwonband.util.DataMap;

@Service
public class CounselService {

	private static final Logger logger = LoggerFactory.getLogger(CounselService.class);

	@Autowired
	private CounselDAO counselDAO;

	/**
	 * 상담 내용 입력
	 * 상담 입력과 파일 정보 업데이트는 트랜잭션으로 묶여야 한다.
	 * @param param
	 */
	public void insertCounsel(DataMap param) {
		/*	상담 내용 입력	*/
		counselDAO.insertCounsel(param);

		/*	파일 정보 업데이트	*/
		if( param.isNotNull("fileList") ) {
			counselDAO.updateFileInfo(param);
		}
	}

	/**
	 * 상담 업데이트
	 * @param param
	 * @return
	 */
	public void updateCounsel(DataMap param) {
		int updateCnt = counselDAO.updateCounsel(param);

		if( updateCnt != 1 ) {
			throw new HKBandException("param["+param+"]");
		}
	}

	public List<DataMap> selectCounselList(DataMap param) {
		return counselDAO.selectCounselList(param);
	}

	public DataMap selectCounselDetail(DataMap param) {
		/*	상담 상세 조회	*/
		DataMap counselDetail = counselDAO.selectCounselDetail(param);

		/*	상담 파일 리스트 조회	*/
		if(counselDetail != null) {
			List<DataMap> fileList = counselDAO.selectCounselFiles(param);
			if(fileList != null && !fileList.isEmpty()) {
				counselDetail.put("fileList", fileList);
			}

			param.put("counseleeType", counselDetail.getString("counselee_type"));
			param.put("counseleeNo", counselDetail.getString("counselee_no"));
			List<DataMap> familyMembers = null;

			/*	학생일 경우, 부모 리스트 조회	*/
			if("006".equals(counselDetail.getString("counselee_type"))) {
				familyMembers = counselDAO.selectParents(param);
			} else {
				familyMembers = counselDAO.selectChildren(param);
			}
			counselDetail.put("familyMembers", familyMembers);
		}



		return counselDetail;

	}

	public void deleteCounsel(DataMap param) {
		counselDAO.deleteCounsel(param);
	}

	public int selectCounselCount(DataMap param) {
		return counselDAO.selectCounselCount(param);
	}

	public List<DataMap> selcetCounselee(DataMap param) {
		return counselDAO.selectCounselee(param);
	}
}
