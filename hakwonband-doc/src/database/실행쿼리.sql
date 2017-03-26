
==========================================================
2015-08-27
==========================================================

alter table tb_receipt add reg_user_no int(10)	unsigned comment '등록자 번호' after reg_date;

update tb_receipt set reg_user_no = admin_no;

alter table tb_receipt drop admin_no;


==========================================================
2015-10-03
==========================================================

alter table tb_message add reservation_yn			char(1)		not null	comment '예약 여부 YN' after receiver_count;
alter table tb_message add reservation_date			datetime				comment '예약 시간' after reservation_yn;
alter table tb_message add reservation_send_date	datetime				comment '예약 발송 시간' after reservation_yn;


==========================================================
2015-10-17
==========================================================

alter table tb_notice add reservation_yn			char(1)		not null	comment '예약 여부 YN' after reg_date;
alter table tb_notice add reservation_date			datetime				comment '예약 시간' after reservation_yn;
alter table tb_notice add reservation_send_date		datetime				comment '예약 발송 시간' after reservation_yn;


update tb_notice set reservation_yn = 'N';


==========================================================
2015-11-06
==========================================================
create index tb_hakwon_master_user_no_idx on tb_hakwon (master_user_no);


==========================================================
2015-12-09
==========================================================
create index tb_file_parent_idx on tb_file (file_parent_type, file_parent_no);

==========================================================
2016-10-23
==========================================================
alter table tb_notice add is_file_view int(1) not null default 1 comment '파일 view 여부';


==========================================================
2016-10-25
==========================================================
alter table tb_notice add target_user varchar(3) default '' comment '대상 사용자';

==========================================================
2016-10-31
==========================================================
alter table tb_advertise_req add redirect_url varchar(1000) comment '이동 url';


==========================================================
2016-11-05
==========================================================
drop table if exists tb_user_alarm;
create table tb_user_alarm (
	user_no				integer						not null	comment '회원 번호'
	, off_date			datetime								comment 'off 만료 시간'
	, primary key (user_no)
)
engine = innodb
character set utf8
comment = '사용자 알림'
;

==========================================================
2016-11-13
==========================================================
drop table if exists tb_user_alarm;
create table tb_user_alarm (
	user_no				integer						not null	comment '회원 번호'
	, start_time		char(5)									comment 'off 시작 시간'
	, end_time			char(5)									comment 'off 종료 시간'
	, primary key (user_no)
)
engine = innodb
character set utf8
comment = '사용자 알림'
;

insert tb_user_alarm(user_no) select user_no from tb_user;


==========================================================
2016-12-05
==========================================================
alter table tb_event add recommend_yn char(1) default 'N' comment '추천 여부';
alter table tb_event add add_info_title varchar(100) comment '정보 입력 타이틀';

alter table tb_event_user add recommend_user_no integer	comment '추천자 번호';

alter table tb_event_user add user_info varchar(1000)	comment '사용자 정보';


==========================================================
2017-02-07
==========================================================
drop table tb_google_auth;
create table tb_google_auth (
	email_addr				varchar(50)				not null				comment '이메일 주소'
	, access_token			varchar(200)			not null				comment '인증 토큰'
	, refresh_token			varchar(200)			not null				comment 'refresh_token'
	, token_expire_time		datetime				not null				comment 'token_expire_time'
	, reg_date				datetime 				not null				comment '등록 일자'
	, upd_date				datetime 				not null				comment '수정 일자'
	, primary key (email_addr)
)
engine = innodb
character set utf8mb4
comment ='구글 인증 정보'
;
insert into tb_google_auth(email_addr, access_token, refresh_token, token_expire_time, reg_date, upd_date)
values('hakwonband@gmail.com', '', '', now(), now(), now());


==========================================================
2017-02-09
==========================================================
alter table tb_file add youtube_id varchar(30)	comment 'youtube 아이디';
alter table tb_file add youtube_reg_date datetime	comment 'youtube 등록시간';

create table tb_youtube_target (
	runtime_id		varchar(50)				not null				comment '실행 id'
	, file_no		integer					not null				comment '파일 번호'
	, reg_date		datetime 				not null				comment '등록 일자'
	, primary key (file_no)
	, unique key(runtime_id, file_no)
)
engine = innodb
character set utf8mb4
comment ='youtube 업로드 타켓 테이블'
;

insert into tb_youtube_target(runtime_id, file_no)
select '', file_no
from tb_file
WHERE
	file_ext_type like 'video%'
	and file_use_yn = 'Y'
	and file_del_yn = 'N'
	and file_no not in (
		select file_no from tb_youtube_target
	)
order by file_no desc
limit 10