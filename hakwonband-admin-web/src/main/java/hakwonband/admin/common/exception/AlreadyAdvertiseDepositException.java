package hakwonband.admin.common.exception;

import hakwonband.common.exception.HKBandException;

/**
 * 광고 입금 처리시 이미 맵핑되어 있는 광고인 경우 발생하는 예외
 * @author bumworld
 *
 */
public class AlreadyAdvertiseDepositException extends HKBandException {

	private static final long serialVersionUID = 1L;

	public AlreadyAdvertiseDepositException() {
		super("이미 맵핑되어 있는 광고 요청입니다.");
	}

	public AlreadyAdvertiseDepositException(String message) {
		super(message);
	}
}
