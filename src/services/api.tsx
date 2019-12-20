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
};
