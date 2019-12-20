import NativeAPI from "../API/NativeAPI"
import api from "../services/api"
import { get } from "./request"
import { Toast } from "@ant-design/react-native"


interface serverInfoProps {
    serverid: string;
    servername?: string;
}
class Config {
    async getdeviceID() {
        try {
            this.deviceID = await NativeAPI.Get_Device_ID()
            return this.deviceID
        } catch (error) {
            Toast.fail('获取设备id失败')
        }
        return this.deviceID
    }
    async getServerID() {
        try {
            const res = await get('/?r=common&d=serverinfo');
            if (res.success) {
                this.serverInfo = res.data
            }
        } catch (error) {
            Toast.fail('获取服务器id失败')
        }
        return this.serverInfo
    }
    get() {
        if (!this.deviceID || !this.serverInfo.serverid) return this.init()
        return {
            deviceID: this.deviceID,
            serverInfo: this.serverInfo
        }
    }

    async init() {
        await Promise.all([this.getdeviceID(), this.getServerID()])
        return {
            deviceID: this.deviceID,
            serverInfo: this.serverInfo
        }
    }
    deviceID: string = ''
    serverInfo: serverInfoProps = { serverid: '' }
}

export default new Config()