
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