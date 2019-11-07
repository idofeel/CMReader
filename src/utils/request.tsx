
const domain = 'http://yy.aijk.xyz/'
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
    async _request(url: string, options, type?, retry?) {
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
    async _simple(url, options, type, retry) {
        options.time = new Date().getTime();
        // url = url.indexOf('http') == 0 ? url : url.indexOf('/api') == 0 || url.indexOf('/xczin') == 0 || url.indexOf('/xc_uc') == 0 ? domain + url : baseUrl + url;
        url = joinUrl(url);
        let res = await this._fetch(url, options, retry);
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
    _push(url, options, type) {
        // url = url.indexOf('http') == 0 ? url : url.indexOf('/api') == 0 || url.indexOf('/xczin') == 0 || url.indexOf('/xc_uc') == 0 ? domain + url : baseUrl + url;
        url = joinUrl(url);
        fetch(url, options);
    }

    /**
     * 包装fetch方法
     * @param {*} url
     * @param {*} options
     */
    async _fetch(url, options, retry) {
        // log("发起请求", options, url);
        let res;
        let count = 1;
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
    async _jsonFactory(res, url, options) {
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
        return json;
    }

    //处理text数据
    async _textFactory(res, url, options) {
        let txt = '';
        try {
            txt = await res.text();
        } catch (e) {
            throw new Error('网络错误，请稍后再试');
        }
        return txt;
    }

    _checkPage(page) {
        if (!page) return 'Unknown';
        let allPage =
            'ShopPage,Subject,ChannelPage,' +
            'InvitePage,GGModal,SearchPage,DetailPage,' +
            'ShoppingCartPage,ShoppingCartContentPage,' +
            'SubmitPage,PayFailResult,OrderDetailPage,' +
            'OrderListPage,GroupOn,GoldPage,CouponPage,ProfilePage';

        if (allPage.indexOf(page) > -1) {
            return page;
        }

        return 'Unknown';
    }
    /**
     * get请求
     * @param {*} url
     */
    async get(url: string, data?, retry?) {
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
    async post(url: string, data?: object, retry?: number) {
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
                headers: Object.assign(headers, {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }),
                timeout: 10000,
                body: urlEncoded(data)
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
    async postJson(url, data, retry) {

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
    trackData(url, data) {
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

    async trackGet(url, data, retry) {
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
    async track(methods, trackObj, { url, data, retry }) {
        let method =
            typeof methods === 'string' &&
                (methods === 'get' || methods === 'post')
                ? methods.toLowerCase()
                : methods;
        let params = Object.assign(trackObj, data);
        let res = await this[method](url, params, retry);
        return res;
    }
    /**
     * 上传图片
     * @param {*} url
     * @param {*} data
     */
    async uploadImage(url, data) {

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
    return request.get(url, data);
};
const post = async (url: string, data?: object) => {
    return request.post(url, data);
};
export { post, get }

let sleep = (time: number) => new Promise(a => setTimeout(a, time));
function joinUrl(url) {
    if (url.indexOf('http') === 0) return url;
    let host = domain;
    if (url.indexOf(url) === 0) host = domain;
    return host + url;
}

/**
 * 混合参数
 * @param {*} data
 */
let urlEncoded = (data: object) => {
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