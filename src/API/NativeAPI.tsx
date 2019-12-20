import { NativeModules } from 'react-native';

interface CLEFile {
    serverid: number | string;
    contentid: number | string;
}

interface DownCLEFile extends CLEFile {
    cleurl: string;
    lesurl: string | null;
}

class NativeAPI {
    APP_CMR = NativeModules.CMRRNModule
    init() {
        if (!this.APP_CMR) this.APP_CMR = NativeModules.CMRRNModule
        return this;
    }

    async Get_Device_ID() {
        return await this.NativeMethod2('GetDeviceID')
    }
    async IS_EXIST_CLE_File(params: CLEFile) {
        return await this.NativeMethod('IsExistCLEFile', params)
    }

    async OPEN_CLE_FILE(params: CLEFile) {
        return await this.NativeMethod('OpenCLEFile', params)
    }

    async DOWN_CLE_FILE(params: DownCLEFile) {
        return await this.NativeMethod('DownloadAndOpenCLEFile', params)
    }

    async DELETE_CLE_FILE(params: CLEFile) {
        // 1表示存在，0表示不存在。
        return await this.NativeMethod('DeleteCLEFile', params)
    }

    async NativeMethod(name: string, params: any) {
        if (!this.APP_CMR) return this.init();
        const method = this.APP_CMR[name];
        return await new Promise((resolve, reject) => {
            try {
                method ? method(params, (err: any, res: unknown) => {
                    err ? reject(err) : resolve(res);
                }) : reject(`${name} is not defined`);
            } catch (error) {
                reject(error);
            }
        });
    }

    async NativeMethod2(name: string): Promise<any> {
        if (!this.APP_CMR) return this.init();

        const method = this.APP_CMR[name];
        return await new Promise((resolve, reject) => {
            try {
                method ? method((err: any, res: any) => {
                    err ? reject(err) : resolve(res);
                }) : reject(`${name} is not defined`);
            } catch (error) {
                reject(error);
            }
        });
    }



}

export default new NativeAPI().init();