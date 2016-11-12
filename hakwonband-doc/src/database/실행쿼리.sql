
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
	, start_time		time									comment 'off 시작 시간'
	, end_time			time									comment 'off 종료 시간'
	, primary key (user_no)
)
engine = innodb
character set utf8
comment = '사용자 알림'
;