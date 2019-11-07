//
//  CMRRNModule.h
//  CMReader
//
//  Created by JiaLi on 2019/11/5.
//  Copyright © 2019年 featuremaker. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>


// 1.获取File是否存在，供RN刷新列表使用
// {"content":[{"serverid":"7984321","contentid":"1_3","cleurl":"http://47.104.188.191/rs_cle/自行车.cle","lesurl":"http://47.104.188.191/rs_les/zxc.les"}]}
// {"serverid":"7984321","contentid":"1_3"}
#define IS_EXIST_CLEFILE                @"IsExistCLEFile"

// 2.获取DeviceID
#define GET_DEVICEID                    @"GetDeviceID"

// 3.下载并打开CLE文件和证书文件
// {"serverid":"7984321","contentid":"1_3","cleurl":"http://47.104.188.191/rs_cle/自行车.cle","lesurl":"http://47.104.188.191/rs_les/zxc.les"}
#define DOWNLOAD_AND_OPEN_CLEFILE       @"DownloadAndOpenCLEFile"

// 4.RN调用打开CMReader消息名称
// {"serverid":"7984321","contentid":"1_3"}
#define OPEN_CLEFILE                    @"OpenCLEFile"


// 5.RN调用CMReader删除本地文件
#define REMOVE_CLEFile                  @"RemoveCLEFile"
// 删除参数样例,传递数组
// {"content":[{"contentid":"1_2"},{"contentid":"1_3"}]}

// CMReader回传到RN的消息名称，供RN刷新列表使用
#define CMREADER_EVENTNAME              @"CMReaderEvent"
// 返回文件是否存在样例，传递数组
// {"content":[{"contentid":"1_2","exist":false},{"contentid":"1_3","exist":true}]}


// 消息为json字符串，如果有数组，则根节点为：Content
#define KEY_EVENT_CONTENT    @"content"
// 参数名：
#define KEY_SERVERID         @"serverid"
#define KEY_CONTENTID        @"contentid"
#define KEY_CLEURL           @"cleurl"
#define KEY_LESURL           @"lesurl"
#define KEY_EXIST            @"exist"

NS_ASSUME_NONNULL_BEGIN

@interface CMRRNModule : RCTEventEmitter<RCTBridgeModule>
+ (void)emitEventWithName:(NSString *)name withMsg:(NSString *)msg;
+ (void)sendFileExistEvent:(NSString *)msg;

@end

NS_ASSUME_NONNULL_END
