drop table if exists tb_advertise_bank_deposit;
create table tb_advertise_bank_deposit (
	deposit_no			integer	auto_increment		not null	comment '입금 번호'
	, amount			integer						not null	comment '금액'
	, bank_code			char(3)						not null	comment '은행 코드(code:010)'
	, deposit_date		datetime					not null	comment '입금 일자'
	, deposit_name		varchar(10)					not null	comment '입금자명'
	, advertise_req_no	integer									comment '광고 요청 번호'
	, comment			varchar(500)							comment '코멘트'
	, reg_user_no		integer						not null	comment '등록자 번호'
	, reg_date			datetime					not null	comment '등록일'
	, udp_user_no		integer									comment '수정자 번호'
	, udp_date			datetime								comment '수정일'
	, mapping_user_no	integer									comment '광고 맵핑 사용자'
	, mapping_date		datetime								comment '광고 맵핑 일'
	, primary key (deposit_no)
)
engine = innodb
character set utf8
comment = '입금 리스트'
;

drop table if exists tb_advertise_bank_deposit_hist;
create table tb_advertise_bank_deposit_hist (
	hist_no				integer	auto_increment		not null	comment '이력 번호'
	, deposit_no		integer						not null	comment '입금 번호'
	, amount			integer						not null	comment '금액'
	, bank_code			char(3)						not null	comment '은행 코드(code:010)'
	, deposit_date		datetime					not null	comment '입금 일자'
	, deposit_name		varchar(10)					not null	comment '입금자명'
	, advertise_req_no	integer									comment '광고 요청 번호'
	, comment			varchar(500)							comment '코멘트'
	, reg_user_no		integer						not null	comment '등록자 번호'
	, reg_date			datetime					not null	comment '등록일'
	, udp_user_no		integer									comment '수정자 번호'
	, udp_date			datetime								comment '수정일'
	, mapping_user_no	integer									comment '광고 맵핑 사용자'
	, mapping_date		datetime								comment '광고 맵핑 일'
	, delete_yn			char(1)									comment '삭제 여부'
	, primary key (hist_no)
)
engine = innodb
character set utf8
comment = '입금 리스트 이력'
;

drop table if exists tb_advertise_req;
create table tb_advertise_req (
	advertise_req_no	integer	auto_increment		not null	comment '광고 요청 번호'
	, hakwon_no			integer						not null	comment '학원 번호'
	, title				varchar(50)					not null	comment '광고 제목'
	, price				integer									comment '금액'
	, banner_file_no	integer						not null	comment '베너 파일 번호'
	, banner_size		integer						not null	comment '베너 크기(1칸/4칸)'
	, deposit_yn		char(1)									comment '결제 여부'
	, bank_info			varchar(100)				not null	comment '입금 계좌 정보'
	, cancel_yn			char(1)									comment '취소 여부'
	, cancel_date		datetime								comment '취소 일자'
	, stop_admin_yn		char(1)						not null	comment '관리자 중지'
	, stop_master_yn	char(1)						not null	comment '원장 중지'
	, reg_user_no		integer						not null	comment '생성자 번호'
	, reg_date			datetime					not null	comment '생성 일자'
	, primary key (advertise_req_no)
)
engine = innodb
character set utf8
comment = '광고 요청'
;

drop table if exists tb_advertise_req_pay_info;
create table tb_advertise_req_pay_info (
	advertise_req_no	integer						not null	comment '광고 요청 번호'
	, view_month		char(6)						not null	comment '노출 년월'
	, banner_size		integer						not null	comment '베너 크기(1칸/4칸)'
	, price				integer						not null	comment '금액'
	, dong_count		integer						not null	comment '동 카운트(몇개 동에 노출하는지)'
	, total_price		integer						not null	comment '월별 전체 금액'
	, primary key (advertise_req_no, view_month)
)
engine = innodb
character set utf8
comment = '광고 요청 지불 정보'
;


drop table if exists tb_advertise_local_date;
create table tb_advertise_local_date (
	advertise_no		integer	auto_increment	not null	comment '광고 번호'
	, advertise_req_no	integer					not null	comment '광고 요청 번호'
	, view_month		char(6)					not null	comment '노출 년월'
	, sido				varchar(10)				not null	comment '시도'
	, gugun				varchar(17)				not null	comment '구군'
	, dong				varchar(40)				not null	comment '동'
	, banner_size		integer					not null	comment '베너 크기(1칸/4칸)'
	, primary key (advertise_no)
)
engine = innodb
character set utf8
comment = '지역 광고'
;

drop table if exists tb_advertise_req_hist;
create table tb_advertise_req_hist (
	req_hist_no			integer	auto_increment		not null	comment '요청 이력 번호'
	, advertise_req_no	integer						not null	comment '광고 요청 번호'
	, hakwon_no			integer						not null	comment '학원 번호'
	, title				varchar(50)					not null	comment '광고 제목'
	, banner_file_no	integer						not null	comment '베너 파일 번호'
	, banner_size		integer						not null	comment '베너 크기(1칸/4칸)'
	, deposit_yn		char(1)									comment '결제 여부'
	, stop_admin_yn		char(1)						not null	comment '관리자 중지'
	, stop_master_yn	char(1)						not null	comment '원장 중지'
	, reg_user_no		integer						not null	comment '생성자 번호'
	, reg_date			datetime					not null	comment '생성 일자'
	, update_type		char(3)						not null	comment '수정 타입(수정,취소...)'
	, primary key (req_hist_no)
)
engine = innodb
character set utf8
comment = '광고 요청 이력'
;

drop table if exists tb_advertise_price;
create table tb_advertise_price (
	price_no			integer	auto_increment	not null	comment '금액 번호'
	, price_year_month	char(6)					not null	comment '년월'
	, banner_size		integer					not null	comment '베너 크기'
	, price				integer					not null	comment '금액'
	, reg_user_no		integer					not null	comment '등록자 번호'
	, reg_date			datetime				not null	comment '등록자 일자'
	, primary key (price_no)
	, unique key(price_year_month, banner_size)
)
engine = innodb
character set utf8
comment = '기간별 날짜별 광고 금액'
;

drop table if exists tb_advertise_price_hist;
create table tb_advertise_price_hist (
	price_hist_no		integer	auto_increment	not null	comment '이력 번호'
	, price_no			integer					not null	comment '금액 번호'
	, price_year_month	char(6)					not null	comment '년월'
	, banner_size		integer					not null	comment '베너 크기'
	, price				integer					not null	comment '금액'
	, reg_user_no		integer					not null	comment '등록자 번호'
	, reg_date			datetime				not null	comment '등록자 일자'
	, primary key (price_hist_no)
)
engine = innodb
character set utf8
comment = '지역별 날짜별 광고 금액 이력'
;


drop table if exists tb_hakwon_cate;
create table tb_hakwon_cate (
	cate_code			char(3)			not null	comment '카테고리 코드'
	, cate_name			varchar(100)	not null	comment '카테고리 이름'
	, cate_order		integer			not null	comment '카테고리 순서'
	, primary key (cate_code)
)
engine = innodb
character set utf8
comment = '학원 업종'
;


drop table if exists tb_hakwon;
create table tb_hakwon (
	hakwon_no			integer	auto_increment		not null	comment '학원 번호'
	, master_user_no	integer						not null	comment '원장님 번호'
	, manager_no		integer									comment '매니저 번호'
	, hakwon_code		varchar(10)					not null	comment '학원 코드 10자리 난수 발생 시킨다.'
	, hakwon_cate		char(3)						not null	comment '학원 카테고리(tb_hakwon_cate의 cate_code)'
	, hakwon_name		varchar(100)				not null	comment '학원 이름'
	, admin_reg_yn		char(1)									comment '관리자 등록 여부'
	, excel_reg_yn		char(1)									comment '엑셀 등록 여부'
	, reg_date			datetime					not null	comment '등록일'
	, hakwon_status		char(3)						not null	comment	'학원 상태(012 001 정상)'
	, manager_no		integer									comment '매니저 번호'
	, primary key (hakwon_no)
	, unique key(hakwon_code)
)
engine = innodb
character set utf8
comment = '학원'
;

drop table if exists tb_hakwon_info;
create table tb_hakwon_info (
	hakwon_no			integer						not null	comment '학원 번호'
	, hakwon_name		varchar(100)				not null	comment '학원 이름'
	, tel_no_1			varchar(20)								comment '연락처 1'
	, tel_no_2			varchar(20)								comment '연락처 2'
	, logo_file_no		integer									comment '학원 로고 파일 번호'
	, introduction		longtext								comment '소개 자료'
	, udp_date			datetime					not null	comment '수정일'
	, primary key (hakwon_no)
)
engine = innodb
character set utf8
comment = '학원 정보'
;


/**
 * 참고
 * http://www.mins01.com/home/board/board.php?type=read&b_id=tech&sh=titleOrText&sw=%EB%8F%84%EB%A1%9C%EB%AA%85&cat=&page=1&b_idx=731
 */
drop table if exists tb_hakwon_address;
create table tb_hakwon_address (
	hakwon_no			integer			not null			comment '학원 번호'
	, addr_no			integer			not null			comment '주소 번호'
	, zip_code			char(7)			not null			comment '우편 번호'
	, old_sido			varchar(10)		not null			comment '시도'
	, old_gugun			varchar(17)		not null			comment '구군'
	, old_dong			varchar(40)							comment '읍면동'
	, old_ri			varchar(15)							comment '리'
	, old_bldg_name		varchar(42)							comment '빌딩명'
	, old_bunji			varchar(17)							comment '번지,아파트동,호수'
	, old_addr1			varchar(100)						comment '구 주소 1'
	, old_addr2			varchar(100)						comment '구 주소 2'
	, street_addr1		varchar(100)						comment '도로명 주소 1'
	, street_addr2		varchar(100)						comment '도로명 주소 2'
	, all_addr_text		varchar(400)						comment '전체 주소 텍스트(조회 컬럼으로 사용)'
	, primary key (hakwon_no)
)
engine = innodb
character set utf8
comment = '학원 주소(기존 주소와 도로명 주소가 같이 존재-기존 주소가 필수)'
;


drop table if exists tb_hakwon_class;
create table tb_hakwon_class (
	class_no			integer	auto_increment		not null	comment '반 번호'
	, hakwon_no			integer						not null	comment '학원 번호'
	, class_order		integer						not null	comment '반 순서'
	, class_title		varchar(100)				not null	comment '클래스 이름'
	, class_intro		longtext					not null	comment '클래스 설명'
	, logo_file_no		integer									comment '클래스 로고'
	, reg_date			datetime					not null	comment '등록일'
	, udp_date			datetime					not null	comment '수정일'
	, use_att_push		CHAR(1)						not null	default 'Y' COMMENT '출결알림 발송 서비스 사용여부'
	, primary key (class_no)
	, unique key(hakwon_no, class_title)
)
engine = innodb
character set utf8
comment = '학원 클래스(반)'
;

-- tb_hakwon_class 테이블에 use_att_push 칼럼 추가
ALTER TABLE tb_hakwon_class
ADD use_att_push char(1) not null default 'Y' comment '출결알림 발송 서비스 사용여부';


drop table if exists tb_hakwon_class_teacher;
create table tb_hakwon_class_teacher (
	hakwon_no			integer						not null	comment '학원 번호'
	, class_no			integer						not null	comment '반 번호'
	, teacher_user_no	integer						not null	comment '선생님 번호'
	, reg_date			datetime					not null	comment '등록일'
	, primary key (hakwon_no, class_no, teacher_user_no)
)
engine = innodb
character set utf8
comment = '학원 클래스 선생님'
;

drop table if exists tb_hakwon_class_student;
create table tb_hakwon_class_student (
	hakwon_no			integer						not null	comment '학원 번호'
	, class_no			integer						not null	comment '반 번호'
	, student_user_no	integer						not null	comment '학생 번호'
	, reg_date			datetime					not null	comment '등록일'
	, primary key (hakwon_no, class_no, student_user_no)
)
engine = innodb
character set utf8
comment = '학원 클래스 학생'
;



drop table if exists tb_hakwon_teacher;
create table tb_hakwon_teacher (
	hakwon_no			integer						not null	comment '학원 번호'
	, user_no			integer						not null	comment '선생님 번호'
	, subject			varchar(15)								comment '선생님 교과목'
	, approved_yn		char(1)						not null	comment '승인 YN'
	, reg_date			datetime					not null	comment '등록일'
	, primary key(hakwon_no, user_no)
)
engine = innodb
character set utf8
comment = '학원 선생님'
;

drop table if exists tb_hakwon_member;
create table tb_hakwon_member (
	hakwon_no			integer						not null	comment '학원 번호'
	, user_no			integer						not null	comment '학생/학부모 번호'
	, user_type			char(3)						not null	comment '사용자 타입(code:001)'
	, member_yn			char(1)									comment '멤버 YN'
	, reg_date			datetime					not null	comment '등록일'
	, receipt_date		VARCHAR(2)						NULL	DEFAULT NULL	COMMENT '학원비 수납일자'
	, primary key(hakwon_no, user_no)
)
engine = innodb
character set utf8
comment = '학원 멤버'
;

-- 학원비 수납일자 칼럼 추가
ALTER TABLE tb_hakwon_member ADD COLUMN receipt_date VARCHAR(2) NULL COMMENT '학원비 수납일자' AFTER reg_date;



drop table if exists tb_code;
create table tb_code (
	code_group			char(3)			not null	comment '공통 코드 그룹'
	, code				varchar(3)		not null	comment '공통 코드 상세'
	, code_group_name	varchar(100)	not null	comment '코드 그룹 이름'
	, code_name			varchar(100)	not null	comment '코드 이름'
	, primary key (code_group, code)
)
engine = innodb
character set utf8
comment = '공통 코드'
;



drop table if exists tb_user;
create table tb_user (
	user_no					integer	auto_increment		not null	comment '사용자 번호'
	, user_type				char(3)						not null	comment '사용자 타입(code:001)'
	, user_id				varchar(15)					not null	comment '사용자 아이디(영문,숫자)'
	, user_email			varchar(50)								comment '사용자 이메일'
	, user_password			varchar(100)							comment '사용자 비밀번호(server side에서 암호화)'
	, approved_yn			char(1)									comment '승인 YN'
	, use_yn				char(1)						not null	comment '사용 유무'
	, reg_date	    		datetime					not null	comment '등록일'
	, out_date				datetime								comment '탈퇴일'
	, primary key (user_no)
	, unique key(user_id)
	, unique key(user_email)
)
engine = innodb
character set utf8
comment = '사용자 정보'
;

drop table if exists tb_user_info;
create table tb_user_info (
	user_no						integer			not null	comment '사용자 번호'
	, user_id					varchar(15)		not null	comment '사용자 아이디(영문,숫자)'
	, user_name					varchar(50)					comment '사용자 이름'
	, user_gender				char(1)						comment '성별(M/W)'
	, user_birthday				date						comment '생년월일(1990-09-05)'
	, approved_date				datetime					comment '승인 날짜'
	, approved_user_no			integer						comment '승인자 번호'
	, photo_file_no				integer						comment '사용자 프로필 사진 파일 번호'
	, tel1_no					varchar(20)					comment '사용자 연락처1'
	, tel2_no					varchar(20)					comment '사용자 연락처2'
	, user_url					varchar(100)				comment '사용자 URL'
	, last_login_date			datetime					comment '마지막 로그인 시간'
	, last_login_ip				varchar(20)					comment '마지막 로그인 IP'
	, agree01					char(1)						comment '이용약관 동의'
	, agree02					char(1)						comment '개인정보 동의'
	, primary key (user_no)
)
engine = innodb
character set utf8
comment = '사용자 추가 정보'
;




drop table if exists tb_student_parent;
create table tb_student_parent (
	student_user_no				integer			not null	comment '학생 번호'
	, parent_user_no			integer			not null	comment '부모 번호'
	, approved_yn				char(1)						comment '승인 여부'
	, req_date	    			datetime		not null	comment '요청일'
	, approved_date    			datetime					comment '승인일'
	, primary key (student_user_no, parent_user_no)
)
engine = innodb
character set utf8
comment = '학생 학부모 테이블'
;

drop table if exists tb_student_school;
create table tb_student_school (
	user_no						integer			not null	comment '학생 번호'
	, school_name				varchar(100)				comment '학교 이름'
	, school_level				char(3)						comment '학교 레벨(008)'
	, level						int							comment '학년'
	, primary key (user_no)
)
engine = innodb
character set utf8
comment = '학생 학교 초중고 정보'
;

drop table if exists tb_login_hist;
create table tb_login_hist (
	login_no				integer			not null	auto_increment	comment '로그인 번호'
	, user_no				integer			not null					comment '사용자 번호'
	, user_type				char(3)			not null					comment '사용자 타입(code:001)'
	, auth_key				varchar(150)	not null					comment '인증 키'
	, device_token			varchar(200)								comment '디바이스 토큰'
	, device_type			varchar(10)									comment '디바이스 타입'
	, is_production			char(1)										comment '디바이스 운영 여부'
	, login_ip				varchar(20)		not null					comment '로그인 IP'
	, login_date			datetime		not null					comment '로그인 일자'
	, last_access_date		datetime		not null					comment '마지막 access 일자'
	, logout_yn				char(1)										comment '로그아웃 여부'
	, logout_date			datetime									comment '로그아웃 일자'
	, primary key (login_no)
	, unique key(auth_key)
	, unique key(device_token)
)
engine = innodb
character set utf8
comment = '사용자 로그인 정보'
;


drop table if exists tb_notice;
create table tb_notice (
	notice_no				integer		auto_increment					comment '공지 번호'
	, notice_type			char(3)							not null	comment '공지 타입(003)'
	, notice_parent_no		integer							not null	comment '부모 번호(시스템 번호-1, 학원 번호, 클래스 번호, 관리자 문의(학원 번호))'
	, title					varchar(150)					not null	comment '제목'
	, preview_content		varchar(300)					not null	comment '내용 미리보기'
	, content				longtext						not null	comment '내용'
	, content_status		char(3)							not null	comment '공지 상태(005)'
	, reply_yn				char(1)							not null	comment '리플 가능 여부'
	, reg_user_no			integer							not null	comment '생성자 번호'
	, reg_date				datetime						not null	comment '생성 일자'
	, udp_user_no			integer										comment '수정자 번호'
	, udp_date				datetime									comment '수정자 일자'
	, rel_notice_no			integer										comment '연결 공지 번호'
	, share_no				integer										comment '공유 번호'
	, primary key (notice_no)
)
engine = innodb
character set utf8
comment = '공지(학원/반)'
;

drop table if exists tb_notice_cate;
create table tb_notice_cate (
	cate_no			integer			not null	auto_increment	comment '카테고리 번호'
	, hakwon_no		integer							not null	comment '학원 번호'
	, cate_name		varchar(150)					not null	comment '카테고리 이름'
	, cate_order	integer							not null	comment '카테고리 순서'
	, primary key (cate_no)
	, unique key (hakwon_no, cate_name)
)
engine = innodb
character set utf8
comment = '학원별 공지 카테고리'
;


drop table if exists tb_message;
create table tb_message (
	message_no				integer		auto_increment					comment '메시지 번호'
	, title					varchar(150)					not null	comment '제목'
	, preview_content		varchar(300)					not null	comment '내용 미리보기'
	, content				longtext						not null	comment '내용'
	, group_yn				char(1)							not null	comment '그룹 메세지 여부'
	, hakwon_no				integer							not null	comment '학원 번호'
	, send_user_no			integer							not null	comment '발신자 번호'
	, send_date				datetime									comment '발신 일자'
	, write_user_no			integer							not null	comment '작성자 번호'
	, write_date			datetime						not null	comment '작성 일자'
	, message_type			varchar(15)									comment '메세지 타입'
	, message_target		varchar(1000)								comment '메세지 대상'
	, receiver_count		integer										comment '받은 사용자 카운트'
	, reservation_yn		char(1)							not null	comment '예약 여부 YN'
	, reservation_date		datetime									comment '예약 시간'
	, reservation_send_date	datetime									comment '예약 발송 시간'
	, primary key (message_no)
)
engine = innodb
character set utf8
comment = '메시지'
;

drop table if exists tb_message_receiver;
create table tb_message_receiver (
	receive_no				integer		auto_increment					comment '받은 번호'
	, message_no			integer							not null	comment '메시지 번호'
	, hakwon_no				integer							not null	comment '학원 번호'
	, receive_user_no		integer							not null	comment '수신자 번호'
	, receive_date			datetime									comment '수신 일자'
	, primary key (receive_no)
	, unique key (message_no, hakwon_no, receive_user_no)
	, index(send_user_no)
)
engine = innodb
character set utf8
comment = '메시지 수신자'
;


drop table if exists tb_content_reply;
create table tb_content_reply (
	reply_no				integer		auto_increment					comment '리플 번호'
	, title					varchar(55)						not null	comment '제목(내용 요약해서 50자로 넣음)'
	, reply_content			longtext						not null	comment '내용'
	, content_type			char(3)							not null	comment '컨텐츠 타입(007)'
	, content_parent_no		integer							not null	comment '부모 번호(공지/메시지 받은 번호/이벤트 번호)'
	, reg_user_no			integer							not null	comment '생성자 번호'
	, reg_date				datetime						not null	comment '생성 일자'
	, primary key (reply_no)
)
engine = innodb
character set utf8
comment = '공지/메시지 리플'
;
create index tb_content_reply_reply_type_idx on tb_content_reply (content_type, content_parent_no);


drop table if exists tb_content_read;
create table tb_content_read (
	content_type		char(3)						not null	comment '컨텐츠 타입(007)'
	, content_parent_no	integer						not null	comment '부모 번호(공지/메시지 번호)'
	, user_no			integer						not null	comment '사용자 번호'
	, read_date			datetime					not null	comment '읽은 일자'
	, primary key (content_type, content_parent_no, user_no)
)
engine = innodb
character set utf8
comment = '공지/메시지 read 이력'
;


drop table if exists tb_event;
create table tb_event (
	event_no				integer		auto_increment				comment 'event 번호'
	, hakwon_no				integer						not null	comment '학원 번호'
	, event_title			varchar(150)				not null	comment '이벤트 제목'
	, event_content			longtext					not null	comment '이벤트 내용'
	, event_status			char(3)						not null	comment	'이벤트 상태(011 001 정상)'
	, reg_user_no			integer						not null	comment '등록자 번호'
	, reg_date				datetime					not null	comment '생성 일자'
	, udp_user_no			integer									comment '수정자 번호'
	, udp_date				datetime								comment '수정 일자'
	, begin_date			date									comment '시작일'
	, end_date				date									comment '종료일'
	, push_send_yn			char(1)									comment '푸시 전송 YN'
	, primary key (event_no)
)
engine = innodb
character set utf8
comment = '이벤트'
;

drop table if exists tb_event_user;
create table tb_event_user (
	event_no			integer				not null			comment 'event 번호'
	, user_no			integer				not null			comment '신청자 번호'
	, reg_date			datetime			not null			comment '등록 일자'
	, primary key (event_no, user_no)
)
engine = innodb
character set utf8
comment = '이벤트 참여자'
;

drop table if exists tb_file;
create table tb_file (
	file_no				integer					not null auto_increment comment '파일 번호'
	, file_parent_type	char(3)					not null				comment '부모 타입(009)'
	, file_parent_no	integer											comment '파일 부모 번호'
	, file_name			varchar(300)			not null				comment '파일 이름'
	, save_file_name	varchar(300)			not null				comment '저장 파일 이름'
	, file_size			integer					not null				comment '파일 싸이즈'
	, file_ext_type		varchar(50)				not null				comment '확장자 타입'
	, file_ext			varchar(20)			default null				comment '확장자명'
	, file_path_prefix	varchar(100)			not null				comment '파일 절대 경로 베이스 디렉토리'
	, file_path			varchar(400)			not null				comment '파일 경로(베이스 디렉토리 이후 경로)'
	, image_yn			char(1)					not null				comment '이미지 여부'
	, thumb_file_path	varchar(400)									comment '썸네일 파일 절대 경로(베이스 디렉토리 + 썸네일 파일 경로)'
	, ip_address		varchar(50)				not null				comment '아이피 주소'
	, reg_date			datetime				not null				comment '등록일'
	, reg_user_no		integer			default null					comment '등록자'
	, file_use_yn		char(1)					not null				comment '파일 사용 YNW(W:wait 대기 등록)'
	, file_del_yn		char(1)					not null				comment '파일 삭제 YN'
	, primary key (file_no)
)
engine = innodb
character set utf8
comment = '공통 파일'
;


drop table if exists tb_noti;
create table tb_noti (
	noti_no				integer			not null auto_increment comment '노티 번호'
	, message			varchar(200)	not null 				comment '노티 메시지'
	, redirect_url		varchar(200)	not null 				comment '리다이렉트 url'
	, device_token		varchar(200)	not null 				comment '단말기 아이디'
	, service_type		char(3)			not null 				comment '서비스 타입(006)'
	, req_date			datetime		not null				comment '요청 시간'
	, req_user_no		integer			not null				comment '요청자'
	, send_date			datetime								comment '전송 시간'
	, send_yn			char(1)			not null				comment '전송 YN'
	, fail_count		integer			not null				comment '실패 카운트'
	, primary key (noti_no)
)
engine = innodb
character set utf8
comment = '노티'
;

/*
drop table if exists tb_user_device_token;
create table tb_user_device_token (
	user_no					integer						not null	comment '사용자 번호'
	, device_type			char(3)						not null	comment '사용자 타입(code:006)'
	, token_key				varchar(100)				not null	comment '디바이스 토큰 키'
	, reg_date	    		datetime					not null	comment '등록일'
	, primary key (user_no)
)
engine = innodb
character set utf8
comment = '사용자 디바이스 인증 정보'
;
*/

drop table if exists tb_test_api;
create table tb_test_api (
	api_no				integer	auto_increment		not null	comment 'api 번호'
	, service_type		varchar(10)					not null	comment '서비스 타입(학원:hakwon, 관리자:admin, 모바일:mobile, 매니저:manager)'
	, api_name			varchar(100)				not null	comment 'api 이름'
	, api_desc			varchar(1000)				not null	comment 'api 설명'
	, api_url			varchar(150)				not null	comment 'api url'
	, method			varchar(10)					not null	comment '메소드(get, post, put..)'
	, headers			varchar(500)							comment 'headers'
	, form				varchar(500)							comment 'form data'
	, reg_user_name		varchar(100)				not null	comment 'api 등록자 이름'
	, primary key (api_no)
)
engine = innodb
character set utf8
comment = 'test api'
;

drop table if exists tb_test_api_hist;
create table tb_test_api_hist (
	api_hist_no			integer	auto_increment		not null	comment 'api 이력 번호'
	, api_no			integer						not null	comment 'api 번호'
	, service_type		varchar(10)					not null	comment '서비스 타입(학원:hakwon, 관리자:admin, 모바일:mobile, 매니저:manager)'
	, api_name			varchar(100)				not null	comment 'api 이름'
	, api_desc			varchar(1000)				not null	comment 'api 설명'
	, api_url			varchar(150)				not null	comment 'api url'
	, method			varchar(10)					not null	comment '메소드(get, post, put..)'
	, headers			varchar(500)							comment 'headers'
	, form				varchar(500)							comment 'form data'
	, reg_user_name		varchar(100)				not null	comment 'api 등록자 이름'
	, primary key (api_hist_no)
)
engine = innodb
character set utf8
comment = 'test api 이력'
;


drop table if exists tb_config;
create table tb_config (
	config_key			varchar(200)				not null	comment '설정 키'
	, config_val		varchar(100)				not null	comment '설정 값'
	, reg_user_no		integer						not null	comment '등록자 번호'
	, reg_date			datetime					not null	comment '등록일'
	, primary key (config_key)
)
engine = innodb
character set utf8
comment = '설정 테이블'
;

drop table if exists tb_config_hist;
create table tb_config_hist (
	config_hist_no		integer	auto_increment		not null	comment '설정 이력 번호'
	, config_key		varchar(200)				not null	comment '설정 키'
	, config_val		varchar(100)				not null	comment '설정 값'
	, reg_user_no		integer						not null	comment '등록자 번호'
	, reg_date			datetime					not null	comment '등록일'
	, primary key (config_hist_no)
)
engine = innodb
character set utf8
comment = '설정 이력 테이블'
;

drop table if exists tb_questions_mail;
create table tb_questions_mail (
	questions_no		integer			auto_increment		not null	comment '문의 번호'
	, user_email		varchar(50)										comment '사용자 이메일'
	, title				varchar(100)									comment '제목'
	, phone				varchar(50)										comment '사용자 연락처'
	, content			longtext										comment '내용'
	, req_date	    	datetime							not null	comment '등록일'
	, primary key (questions_no)
)
engine = innodb
character set utf8
comment = '문의 메일'
;

drop table if exists tb_app_info;
create table tb_app_info (
	app_version			varchar(10)					not null	comment '앱 버전'
	, device_type    	varchar(10)					not null	comment '디바이스 타입'
	, req_date	    	datetime					not null	comment '등록일'
	, primary key (app_version)
)
engine = innodb
character set utf8
comment = '앱 정보 관리'
;


drop table if exists tb_preview_intro;
create table tb_preview_intro (
	preview_no			integer			auto_increment		not null	comment '미리보기 번호'
	, hakwon_no			integer								not null	comment '학원 번호'
	, introduction		longtext										comment '내용'
	, primary key (preview_no)
)
engine = innodb
character set utf8
comment = '학원 소개 미리보기'
;


drop table if exists tb_user_out;
create table tb_user_out (
	user_no				integer						not null	comment '회원 번호'
	, user_type			char(3)						not null	comment '사용자 타입(code:001)'
	, user_id			varchar(15)					not null	comment '사용자 아이디(영문,숫자)'
	, user_email		varchar(50)								comment '사용자 이메일'
	, req_date	    	datetime					not null	comment '탈퇴일'
	, comment			longtext								comment '사유'
	, primary key (user_no)
)
engine = innodb
character set utf8
comment = '회원 탈퇴 이력'
;


drop table if exists tb_manager;
create table tb_manager (
	manager_no			integer			auto_increment		not null	comment '매니저 번호'
	, user_no			integer								not null	comment '회원 번호'
	, primary key (manager_no)
)
engine = innodb
character set utf8
comment = '매니저'
;

--tb_user_info 테이블에 attendance_code 추가.
ALTER TABLE tb_user_info
ADD attendance_code int
, ADD CONSTRAINT uni_att UNIQUE (attendance_code);

-- tb_attendance 테이블에 data_type 필드 추가
ALTER TABLE tb_attendance
ADD data_type char(3) not null	comment '데이터 타입 (001 : 등/하원, 002 : 승/하차)';

-- tb_user_info attendance_code 초기화
update tb_user_info a
set
	a.attendance_code = null
where
	a.attendance_code is not null;


drop table if exists tb_attendance;
create table tb_attendance (
	attendance_no	int(10)		unsigned not null auto_increment	comment '출석 번호',
	hakwon_no		int(10)		unsigned not null					comment '학원 번호',
	data_type		char(3)		not null							comment '데이터 타입 (001 : 등/하원, 002 : 승/하차)',
	student_no		int(10)		unsigned not null					comment '학생 번호',
	start_date		datetime	not null							comment '학원 출석 시간',
	end_date		datetime	null default null					comment '귀가 시간',
	primary key (attendance_no)
)
comment='출석 테이블'
collate='utf8_general_ci'
engine=innodb;

drop table if exists tb_receipt;
create table tb_receipt (
	receipt_no		int(10)	unsigned	not null auto_increment	comment '수납 번호',
	hakwon_no		int(10)	unsigned	not null				comment '학원 번호',
	student_no		int(10)	unsigned	not null				comment '학생 번호',
	receipt_amount	int(10)	unsigned	not null				comment '수납액',
	receipt_type	char(3)				not null				comment '수납 타입( 001 : 입금, ..)',
	receipt_method	char(3)				not null				comment '수납 방법( 001 : 현금, 002 : 계좌이체, 003 : 카드, 004 : 기타)',
	receipt_desc	varchar(200)		null default null		comment '수납 내용',
	receipt_date	date				not null				comment '수납 날짜',
	reg_date		datetime			not null				comment '등록 날짜',
	reg_user_no		int(10)	unsigned	not null				comment '등록자 번호',
	use_yn			char(1)				not null default 'y'	comment '사용 여부',
	primary key (receipt_no)
)
comment='수납 테이블'
collate='utf8_general_ci'
engine=innodb
;


drop table if exists tb_receipt_month;
create table tb_receipt_month (
	idx_no			int(10) unsigned	not null auto_increment comment '인덱스 번호',
	receipt_no		int(10) unsigned	not null comment '수납 번호',
	hakwon_no		int(10) unsigned	not null comment '학원 번호',
	student_no		int(10) unsigned	not null comment '학생 번호',
	receipt_month	varchar(20)			not null comment '수납 월',
	primary key (idx_no)
)
comment='몇월에 대한 수납인지'
collate='utf8_general_ci'
engine=innodb;


drop table if exists tb_counsel;
create table tb_counsel (
	counsel_no		int(10) unsigned not null auto_increment comment '상담 번호',
	hakwon_no		int(10) unsigned null default null	comment '학원 번호',
	counsellor_no	int(10) unsigned null default null	comment '선생님 번호',
	counselee_no	int(10) unsigned null default null	comment '상담자 user 번호',
	counsel_title	varchar(50) null default null		comment '상담 제목',
	counsel_content	text null							comment '상담 내용',
	counsel_date	date null default null				comment '상담 날짜',
	reg_date		datetime null default null			comment '등록 날짜',
	use_yn			char(1) not null default 'y'		comment '사용 여부',
	primary key (counsel_no)
)
comment='상담 테이블'
collate='utf8_general_ci'
engine=innodb;


drop table if exists tb_year_month;
create table tb_year_month (
	year_month_val		char(6) 	comment '년월'
	, primary key (year_month_val)
)
comment='년월 테이블'
collate='utf8_general_ci'
engine=innodb
;


drop table if exists tb_notice_share;
create table tb_notice_share (
	share_no			integer	auto_increment		not null	comment '공유 번호'
	, send_hakwon_no	integer						not null	comment '학원 번호'
	, reg_user_no		integer						not null	comment '공유 등록자 번호'
	, notice_type		char(3)						not null	comment '공지 타입'
	, parent_no			integer						not null	comment '학원번호 or 반 번호'
	, receive_hakwon_no	integer						not null	comment '받은 학원 번호'
	, start_date		date						not null	comment '시작일'
	, end_date			date						not null	comment '종료일'
	, reg_date			datetime					not null	comment '등록일'
	, udp_date			datetime								comment '수정일'
	, primary key (share_no)
	, unique key(send_hakwon_no, notice_type, parent_no, receive_hakwon_no)
)
engine = innodb
character set utf8
comment = '입금 리스트'
;
create index tb_notice_share_send_hakwon_idx on tb_notice_share (send_hakwon_no);
create index tb_notice_share_receive_hakwon_idx on tb_notice_share (receive_hakwon_no);


alter table tb_notice add rel_notice_no			integer				comment '연결 공지번호' after udp_date;
alter table tb_notice add share_no				integer				comment '공유번호' after rel_notice_no;

create index tb_notice_rel_notice_no_idx on tb_notice (rel_notice_no);
create index tb_notice_share_no_idx on tb_notice (share_no);