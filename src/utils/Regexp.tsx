// 邮箱验证规则：[大小写字母数字_-.]@[大小写字母数字_-.].[2-8位的大小写字母]
export const email_reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

//2-32位字母或数字或特殊字符_-.
export const pwd_reg = /^([A-Za-z0-9_\-\.]{2,32})$/;

// 用户名验证， 两个以上字符，32及以下个字符。非法字符 返回true 为不通过
export const user_name = /\s+|^c:\\con\\con|[#%,\*\"\s\<\>\&\$]|\xA1\xA1|\xAC\xA3|^Guest|^\xD3\xCE\xBF\xCD|\xB9\x43\xAB\xC8/is;

// 手机号验证规则
export const phone_number = /^1\d{10}$/;
