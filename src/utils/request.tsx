
// const domain = 'http://fm.aijk.xyz/'
// const domain = 'http://www.featuremaker.xyz/'
const domain = 'http://cle.aijk.xyz'


let headers = {}
class Request {

    /**
     * 重试次数
     */
    retryCount = 5;
    constructor() { }
    /**
     * 内部实现网络请求
     * @param {*} url
     * @param {*} options
     */
    async _request(url: string, options?: any, type?: string, retry?: number) {
        options.time = new Date().getTime();
        // url = url.indexOf('http') == 0 ? url : url.indexOf('/api') == 0 || url.indexOf('/xczin') == 0 || url.indexOf('/xc_uc') == 0 ? domain + url : baseUrl + url;
        url = joinUrl(url);
        let res = await this._fetch(url, options, retry);
        if (type === 'json') return await this._jsonFactory(res, url, options);
        if (type === 'text') return await this._textFactory(res, url, options);
        return await this._jsonFactory(res, url, options);
    }
    /**
     * 简易请求,返回结果简单处理
     */
    async _simple(url: string, options?: any, type?: string, retry?: number) {
        options.time = new Date().getTime();
        // url = url.indexOf('http') == 0 ? url : url.indexOf('/api') == 0 || url.indexOf('/xczin') == 0 || url.indexOf('/xc_uc') == 0 ? domain + url : baseUrl + url;
        url = joinUrl(url);
        let res: any = await this._fetch(url, options, retry);
        let json = await res.json();
        if (json.data) return json.data;
        return {};
    }
    /**
     * 推送http消息
     * @param {*} url
     * @param {*} options
     * @param {*} type
     */
    _push(url: string, options?: any, type?: string) {
        // url = url.indexOf('http') == 0 ? url : url.indexOf('/api') == 0 || url.indexOf('/xczin') == 0 || url.indexOf('/xc_uc') == 0 ? domain + url : baseUrl + url;
        url = joinUrl(url);
        fetch(url, options);
    }

    /**
     * 包装fetch方法
     * @param {*} url
     * @param {*} options
     */
    async _fetch(url: string, options?: any, retry?: number) {
        // log("发起请求", options, url);
        let res: any;
        let count: number = 1;
        url = url.replace(/undefined/g, '');
        try {
            res = await Promise.race([
                fetch(url, options),
                new Promise(function (resolve, reject) {
                    setTimeout(() => reject(new Error('request timeout')), 10000);
                })]);
        } catch (e) {

            throw new Error('网络连接失败，请检查网络权限');
        }
        while (retry && res.status === 420 && count < this.retryCount) {
            await sleep(2000);
            try {
                res = await fetch(url, options);
            } catch (e) {
                throw new Error('网络连接失败，请检查网络');
            }
            count++;
        }
        if (res.status === 420) throw new Error('排队人多,再来一次');
        return res;
    }
    /**
     * 处理json数据
     * @param {*} res
     * @param {*} url
     */
    async _jsonFactory(res: any, url?: string, options?: any) {
        let json;
        let txt = '';
        try {
            // json = await res.json();
            txt = await res.text();
        } catch (e) {
            const now = new Date().getTime();
            throw new Error('网络错误，请稍后再试');
        }
        try {
            json = JSON.parse(txt);
        } catch (e) {
            const now = new Date().getTime();

            throw new Error('网络错误，请稍后再试');
        }
        console.log(`%c ${options.method}: ${url}`, 'color:#0f0;', options, json);

        return json;
    }

    //处理text数据
    async _textFactory(res: any, url?: string, options?: any) {
        let txt = '';
        try {
            txt = await res.text();
        } catch (e) {
            throw new Error('网络错误，请稍后再试');
        }
        return txt;
    }
    /**
     * get请求
     * @param {*} url
     */
    async get(url: string, data: any = {}, retry?: number) {
        // this._pre_validity(url, data)

        if (data) data = urlEncoded(data);
        if (url.indexOf('?') < 0 && data) {
            url += '?' + data;
        } else {
            url += '&' + data;
        }
        return this._request(
            url,
            {
                method: 'GET',
                headers: headers,
                timeout: 10000
            },
            'json',
            retry
        );
    }
    /**
     * post请求
     * @param {*} url
     * @param {*} data
     */
    async post(url: string, data?: any, retry?: number) {
        // this._pre_validity(url, data)

        // if (url.indexOf('?') < 0) {
        //     url += '?' + params;
        // } else {
        //     url += '&' + params;
        // }

        return this._request(
            url,
            {
                method: 'POST',
                headers: Object.assign(headers),
                timeout: 10000,
                body: JSON.stringify(data)
            },
            'json',
            retry
        );
    }

    /**
     * post 传输 json 格式
     * @param url
     * @param data
     * @param retry
     * @returns {Promise<*>}
     */
    async postJson(url: string, data?: any, retry?: number) {

        // if (url.indexOf('?') < 0) {
        //     url += '?' + params;
        // } else {
        //     url += '&' + params;
        // }

        return this._request(
            url,
            {
                method: 'POST',
                headers: Object.assign(headers, {
                    'Content-Type': 'application/json'
                }),
                timeout: 10000,
                body: JSON.stringify(data)
            },
            'json',
            retry
        );
    }


    /**
     * 简单的发送请求
     */
    trackData(url: string, data: any) {
        if (data) data = urlEncoded(data);
        if (url.indexOf('?') < 0 && data) url += '?' + data;
        this._push(
            url,
            {
                method: 'GET',
                headers: headers,
                timeout: 10000
            },
            'json'
        );
    }

    async trackGet(url: string, data: any, retry: number) {
        // this._pre_validity(url, data)
        if (data) data = urlEncoded(data);
        if (url.indexOf('?') < 0 && data) url += '?' + data;
        return this._request(
            url,
            {
                method: 'GET',
                headers: headers,
                timeout: 10000
            },
            'json',
            retry
        );
    }
    /**
     * 上传图片
     * @param {*} url
     * @param {*} data
     */
    async uploadImage(url: string, data: any) {

        return this._request(url, {
            method: 'POST',
            headers: Object.assign({}, headers, {
                'Content-Type': 'multipart/form-data;charset=utf-8'
            }),
            body: data
        });
    }
}
const request = new Request();
export default request;

//旧方法兼容
const get = async (url: string, data?: object) => {
    if (url.indexOf(domain) < 0) url = domain + url;

    return request.get(url, data);
};
const post = async (url: string, data?: object) => {
    return request.post(url, data);
};



let sleep = (time: number) => new Promise(a => setTimeout(a, time));

function joinUrl(url: string) {
    if (url.indexOf('http') === 0) return url;
    let host = domain;
    if (url.indexOf(url) === 0) host = domain;
    return host + url;
}

/**
 * 混合参数
 * @param {*} data
 */
let urlEncoded = (data: any) => {
    if (typeof data == 'string') return encodeURIComponent(data);
    let params = [];
    for (let k in data) {
        if (!data.hasOwnProperty(k)) return;
        let v = data[k];
        if (typeof v == 'string') v = encodeURIComponent(v);
        if (v == undefined) v = '';
        params.push(`${encodeURIComponent(k)}=${v}`);
    }
    return params.join('&');
};

const joinUrlEncoded = (url: string, data: object) => {
    const params = urlEncoded(data)
    if (url.indexOf("?") < 0 && params) {
        url += "?" + params
    } else {
        url += "&" + params
    }
    return url
}
export { post, get, joinUrl, joinUrlEncoded }

interface props {
    url?: string,
    data?: any,
    retry?: number
}