DELIMITER $$
drop function if exists calc_age;
create function calc_age(in_dob datetime) returns int(11) CHARACTER SET UTF8
begin
	declare l_age integer;
	set l_age=date_format(now(),'%Y')-date_format(in_dob,'%Y')+1;
	if l_age>100 then set l_age = 0; end if;
	return(l_age);
end;
$$


--	코드 이름
--	get_code_name(코드그룹, 코드)
DELIMITER $$
drop function if exists get_code_name;
create function get_code_name(v_code_group char(3), v_code varchar(3)) returns varchar(100) CHARACTER SET UTF8
begin
	declare v_code_name varchar(100) CHARACTER SET UTF8 default '';
	select code_name into v_code_name  from tb_code where code_group = v_code_group and code = v_code;
	return v_code_name;
end;
$$

-- 카테고리 이름
-- get_cate_name(카테고리 코드)
DELIMITER $$
drop function if exists get_cate_name;
create function get_cate_name(v_cate_code varchar(3)) returns varchar(100) CHARACTER SET UTF8
begin
	declare v_cate_name varchar(100) CHARACTER SET UTF8 default '';
	select cate_name into v_cate_name  from tb_hakwon_cate where cate_code = v_cate_code;
	return v_cate_name;
end;
$$



--	사용자 이름
--	get_user_name(사용자 번호)
DELIMITER $$
drop function if exists get_user_name;
create function get_user_name(v_user_no integer) returns varchar(100) CHARACTER SET UTF8
begin
	declare v_user_name varchar(100) CHARACTER SET UTF8 default '';
	select user_name into v_user_name  from tb_user_info where user_no = v_user_no;
	return v_user_name;
end;
$$

--	사용자 정보
--	get_user_info(사용자 번호)
-- 0 : user_name
-- 1 : user_id
-- 2 : user_gender
-- 3 : user_no
-- 4 : user_birthday
-- 5 : photo_file_path
-- 6 : user_type
-- 7 : school_name
-- 8 : school_level
DELIMITER $$
drop function if exists get_user_info;
create function get_user_info(v_user_no integer) returns varchar(500) CHARACTER SET UTF8
begin
	declare v_user_info varchar(500) CHARACTER SET UTF8 default '';
	select
		CONCAT(
			b.user_name, 0x0B, b.user_id, 0x0B, ifnull(b.user_gender, '')
			, 0x0B, a.user_no, 0x0B, ifnull(calc_age(b.user_birthday), '')
			, 0x0B, get_file_path(b.photo_file_no), 0x0B, a.user_type
			, 0x0B, ifnull(c.school_name, ''), 0x0B, ifnull(c.level, '')
			, 0x0B, get_code_name('001', a.user_type)
		) into v_user_info
		from
			tb_user a
			inner join tb_user_info b on a.user_no = v_user_no and a.user_no = b.user_no
			left outer join tb_student_school c on b.user_no = c.user_no
		;
	return v_user_info;
end;
$$

-- 파일 경로
-- get_file_path(파일 번호)
DELIMITER $$
drop function if exists get_file_path;
create function get_file_path(v_file_no integer) returns varchar(100) CHARACTER SET UTF8
begin
	declare v_file_path varchar(100) CHARACTER SET UTF8 default '';
	select file_path into v_file_path  from tb_file where file_no = v_file_no;
	return v_file_path;
end;
$$

--	학생 이름 가져오기
DELIMITER $$
drop function if exists get_child_name;
create function get_child_name(v_parent_no integer) returns varchar(100) CHARACTER SET UTF8
begin
	declare v_child_names varchar(100) CHARACTER SET UTF8 default '';
	select group_concat(student_user_no SEPARATOR ',') into v_child_names from tb_student_parent where parent_user_no = v_parent_no and approved_yn = 'Y';
	return v_child_names;
end;
$$


--	수납 리스트
DELIMITER $$
drop function if exists get_receipt_month;
create function get_receipt_month(v_year char(4), v_hakwon_no integer, v_user_no integer) returns varchar(500) CHARACTER SET UTF8
begin
	declare v_receipt_month varchar(500) CHARACTER SET UTF8 default '';
	select
		group_concat( concat( a.year_month_val, ',', ifnull(y.receipt_date, '')) separator '|' ) into v_receipt_month
	from
		(select year_month_val from tb_year_month
			where year_month_val >= concat(v_year, '01') and year_month_val <= concat(v_year, '12')
		) a
		left outer join tb_receipt_month x on
			a.year_month_val = x.receipt_month
			and x.hakwon_no = v_hakwon_no
			and x.student_no = v_user_no
		left outer join tb_receipt y on
			x.hakwon_no = y.hakwon_no
			and x.receipt_no = y.receipt_no
			and y.use_yn = 'Y'
		order by a.year_month_val asc;
	return v_receipt_month;
end ;
$$


-- 사용자별 출력 데이타
DELIMITER $$
drop function if exists get_user_attendance;
create function get_user_attendance(v_hakwon_no integer, v_user_no integer, v_year_month char(7)) returns varchar(500) CHARACTER SET UTF8
begin
	declare v_days varchar(500) CHARACTER SET UTF8 default '';
	select
		group_concat(distinct date_format(x.start_date, '%d') separator ',') into v_days
	from
		tb_attendance x
	where
		x.hakwon_no = v_hakwon_no
		and x.student_no = v_user_no
		and x.data_type = '001'
		and x.start_date >= concat(v_year_month, '-01 00:00:00')
		and x.start_date < concat(v_year_month, '-31 00:00:00')
	;
	return v_days;
end ;
$$


-- 알림 off 시간 체크
-- dbeaver로 넣을때는 CHARACTER SET UTF8 빼고 넣으면 된다.
DELIMITER $$
drop function if exists check_alarm_off;
create function check_alarm_off(v_start_time varchar(5), v_end_time varchar(5)) returns integer
begin
	declare v_val integer default 1;
	select
		case
			when v_start_time is null or v_end_time is null or v_start_time = '' or v_end_time = '' then
				0
			when v_start_time > v_end_time and CURRENT_TIME() > v_end_time then
				now() BETWEEN concat(curdate(), ' ', v_start_time) and concat(DATE_ADD(CURDATE(), INTERVAL+1 DAY), ' ', v_end_time)
			when v_start_time > v_end_time and CURRENT_TIME() < v_end_time then
				now() BETWEEN concat(DATE_ADD(CURDATE(), INTERVAL -1 DAY), ' ', v_start_time) and concat(CURDATE(), ' ', v_end_time)
			else
				now() BETWEEN concat(CURDATE(), ' ', v_start_time) and concat(CURDATE(), ' ', v_end_time)
		end into v_val
		;
	return v_val;
end ;
$$