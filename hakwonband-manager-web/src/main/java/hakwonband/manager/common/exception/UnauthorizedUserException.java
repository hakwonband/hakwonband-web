package hakwonband.manager.common.exception;

import hakwonband.common.exception.HKBandException;

public class UnauthorizedUserException extends HKBandException {

	private static final long serialVersionUID = 1L;
	
	public UnauthorizedUserException() {
		super("권한 없는 사용자의 요청입니다.");
	}
	
	public UnauthorizedUserException(String message) {
		super(message);
	}
}
