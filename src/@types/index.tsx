/** @format */
interface MenusData {
	id: string;
	name: string;
	sub: MenusData[]
}

interface serverCate {
	pid: string;
	gid: string;
	name: string;
	memo: string;
	uid: string;
	createtime: string;
	state: string;
	filesize: string;
	img: string;
}
interface serverRes {
	success: boolean;
	data?: any;
	faildesc?: string;
}

interface serverResCateData extends serverRes {
	data: serverCate[];
	next: number;
}

interface category {
	cateid: string; // 分类id
	catename: string; // 分类名称
	item: cateData[]; // 分类下的数据

}

interface cateData {
	imageurl: string; // 封面
	contentid: string; // 文件id
	cleurl: string; // 文件地址
	title: string; // 文件名称
	size: string; // 文件大小
	exist: boolean; // 文件是否下载
	serverid: string;
	lesurl: string | null;
}

interface categorys {
	title: string;
	cateid: number | string;
	category: cateData[];
}

interface NewCategorys extends MenusData, categorys {
	loadCategory: boolean,
	start?: number
}

