export default {
	main: {
		menu: '/?r=common&d=menu',
	},
	source: {
		// 公开资源列表
		public: '/?r=cle&d=list&o=public', // {ids[],st}
		// 私有资源列表
		private: '/?r=cle&d=list&o=private', // {ids[],st}
		// 搜索
		search: '/?r=cle&d=name', // {name}
	},
	fileInfo: {
		// les 文件信息
		les: '/?r=cle&d=les', // {pid,devid}
		// cle 文件信息
		cle: '/?r=cle&d=file', // {pid}
	},
	auth: {
		// 注册
		register: '/?r=user&d=register&o=submit', // {username,password,password2,email,register_mode,seccode,authority_code,orgid}
		login: '/?r=user&d=login&m=name', // {username, password, period}
		isUname: '/?r=user&d=register&o=isusername', // {username}
		imgcode: '/?r=user&d=register&o=getseccode',
		isseccode: '/?r=user&d=register&o=isseccode',
		islogin: '/?r=user&d=islogin',
		qqLogin: '/?r=qcloginstep1',
		qqLogin2: '/?r=user&d=login&m=qq',
		logout: '/?r=user&d=logout',
		cookie: '/?r=user&d=cookiename'
	},
	user: {
		base: '/?r=center&d=profile&o=getbase',	// 基础信息
		export: '/?r=center&d=extprofile&o=getext', // 扩展信息
	},
	modify: {
		UpAvatar: '/?r=center&d=upavatar', // {file}
		nikeName: '/?r=center&d=profile&o=setnick', // {nick}
		realName: '/?r=center&d=profile&o=setrealname', // {realname}
		extprofile: '/?r=center&d=extprofile&o=setone', // {cid,v}
	},
};
