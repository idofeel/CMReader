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


// 获取File是否存在IsExistCLEFile，参数为json数组(如果是单个文件，也放到数组里）
// [{"serverid":"7984321","contentid":"1_3",cateid:"1"}, {"serverid":"7984321","contentid":"1_4",cateid:"1"},  {"serverid":"7984321","contentid":"1_5",cateid:"1"}]
// 返回： [{"serverid":"7984321","contentid":"1_3",cateid:"1" "exist":true}, {"serverid":"7984321","contentid":"1_4",cateid:"1","exist":true},  {"serverid":"7984321","contentid":"1_5",cateid:"1","exist":false}]

#define IS_EXIST_CLEFILE                @"IsExistCLEFile"

// 2.获取DeviceID
// 返回一个字符串（不是json，就是字符串）
#define GET_DEVICEID                    @"GetDeviceID"

// 3.下载并打开CLE文件和证书文件，参数为一个json字符串，包含url，contentid，以及serverid
// 返回整型
// {"serverid":"7984321","contentid":"1_3","cleurl":"http://47.104.188.191/rs_cle/自行车.cle","lesurl":"http://47.104.188.191/rs_les/zxc.les"}
#define DOWNLOAD_AND_OPEN_CLEFILE       @"DownloadAndOpenCLEFile"

// 4.RN调用打开CMReader消息名称
// {"serverid":"7984321","contentid":"1_3"}
// 返回整型
#define OPEN_CLEFILE                    @"OpenCLEFile"


// 5.备用：RN调用CMReader删除本地文件
//#define REMOVE_CLEFile                  @"RemoveCLEFile"
// 删除参数样例,传递数组
// [{"contentid":"1_2"},{"contentid":"1_3"}]

// 6.备用：CMReader回传到RN的消息名称，供RN刷新列表使用
#define CMREADER_EVENTNAME              @"CMReaderEvent"


// 参数名：
#define KEY_SERVERID         @"serverid"
#define KEY_CONTENTID        @"contentid"
#define KEY_CLEURL           @"cleurl"
#define KEY_LESURL           @"lesurl"
#define KEY_CATAID           @"cateid"
#define KEY_EXIST            @"exist"


NS_ASSUME_NONNULL_BEGIN

@interface CMRRNModule : RCTEventEmitter<RCTBridgeModule>
+ (void)emitEventWithName:(NSString *)name withMsg:(NSString *)msg;
+ (void)sendFileExistEvent:(NSString *)msg;

@end

NS_ASSUME_NONNULL_END
