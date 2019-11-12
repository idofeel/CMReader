//
//  CMRRNModule.m
//  CMReader
//
//  Created by JiaLi on 2019/11/5.
//  Copyright © 2019年 featuremaker. All rights reserved.
//

#import "CMRRNModule.h"

// 内部使用
#define EVENT_EMITTED       @"EventEmitted"

/*
 content:
    url:
    name:
 */
@implementation CMRRNModule

@synthesize bridge = _bridge;

//导出模块 不添加参数即默认认为这个oc类的名字
RCT_EXPORT_MODULE(CMRRNModule)
//导出方法，桥接到js的方法返回值类型必须是void

- (NSArray<NSString *> *)supportedEvents {
    return @[CMREADER_EVENTNAME]; //这里返回的将是你要发送的消息名的数组。
}

/******* RN Call iOS *******/

// 1.获取File是否存在,参数为json数组(如果是单个文件，也放到数组里）
RCT_EXPORT_METHOD(IsExistCLEFile:(id)msg:(RCTResponseSenderBlock)callback){
  [self showAlert:@"IsExistCLEFile" withMessage:msg cancleBlock:^{
    
  } confirmBlock:^{
    if ([msg isKindOfClass:[NSArray class]]) {
      NSArray* array = (NSArray*)msg;
      NSMutableArray* returnedArray = [[NSMutableArray alloc] init];
      int i = 0;
      for (NSDictionary* item in array) {
        NSMutableDictionary* dic = [NSMutableDictionary dictionaryWithDictionary:item];
        if (i == 0) {
          [dic setObject:@(true) forKey:KEY_EXIST];
        }
        [returnedArray addObject:dic];
      }
      NSString* backString = @"[{\"serverid\":\"7984321\",\"contentid\":\"1_3\",cateid:\"1\",\"exist\":true}]";
      callback(@[[NSNull null], backString]);

     // callback(@[[NSNull null], returnedArray]);
    } else if ([msg isKindOfClass:[NSString class]]) {
      NSString* backString = @"[{\"serverid\":\"7984321\",\"contentid\":\"1_3\",cateid:\"1\",\"exist\":true}]";
      callback(@[[NSNull null], backString]);
    }
  }];
}

// 2.获取DeviceID
RCT_EXPORT_METHOD(GetDeviceID:(RCTResponseSenderBlock)callback){
  [self showAlert:@"GetDeviceID" withMessage:@"" cancleBlock:^{
    
  } confirmBlock:^{
    callback(@[[NSNull null], @"12312341243"]);
  }];
}

// 3.下载并打开CLE文件和证书文件
// 返回值： 1表示下载成功，0表示下载失败。

RCT_EXPORT_METHOD(DownloadAndOpenCLEFile:(id)msg:(RCTResponseSenderBlock)callback){
  [self showAlert:@"DownloadAndOpenCLEFile" withMessage:msg cancleBlock:^{
    
  } confirmBlock:^{
    //这里返回了一个成功，请RN得到1之后，刷新当前点击的模型是否存在和不存在的图标
     callback(@[[NSNull null], @(1)]);
  }];
}

// 4.RN调用打开CMReader消息名称
// 0 表示打开成功，其它表示失败，具体错误信息以后描述。
RCT_EXPORT_METHOD(OpenCLEFile:(id)msg:(RCTResponseSenderBlock)callback){
    [self showAlert:@"已经调用到原生OpenCLEFile" withMessage:msg cancleBlock:^{
        
    } confirmBlock:^{
      // 这里统一都返回0
        callback(@[[NSNull null], @(0)]);
    }];
}


/******* iOS Call RN *******/
- (void)startObserving {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(emitEventInternal:)
                                                 name:EVENT_EMITTED
                                               object:nil];
}

- (void)stopObserving {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}


- (void)emitEventInternal:(NSNotification *)notification {
   /*{"content":[{"name":"雪地摩托","exist":true},{"name":"自行车","exist":true}]}*/
    NSString* content = notification.object;
    NSString* title = @"原生发给RN";
    [self showAlert:title withMessage:content cancleBlock:^{
        
    } confirmBlock:^{
        [self sendEventWithName:CMREADER_EVENTNAME body:content];
    }];
}

- (void)showAlert:(NSString*)title withMessage:(NSString*)msg cancleBlock:(void (^ __nullable)(void))cancelhandler confirmBlock:(void (^ __nullable)(void))confirmhandler {
    dispatch_async(dispatch_get_main_queue(), ^{
        UIAlertController* alertController = [UIAlertController alertControllerWithTitle:title message:msg preferredStyle:UIAlertControllerStyleAlert];
        
        UIAlertAction *cancelAction = [UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            [alertController dismissViewControllerAnimated:YES completion:nil];
            cancelhandler();
        }];
        [alertController addAction:cancelAction];
        
        UIAlertAction *confirmAction = [UIAlertAction actionWithTitle:@"确认" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
            confirmhandler();
        }];
        [alertController addAction:confirmAction];
        UIViewController* rootVC = [[[UIApplication sharedApplication] keyWindow] rootViewController];
        [rootVC presentViewController:alertController animated:YES completion:nil];
    });
}

+ (void)emitEventWithName:(NSString *)name withMsg:(NSString *)msg {
    [[NSNotificationCenter defaultCenter] postNotificationName:EVENT_EMITTED
                                                        object:msg
                                                      userInfo:nil];
}

+ (void)sendFileExistEvent:(NSString *)msg {
    [CMRRNModule emitEventWithName:CMREADER_EVENTNAME withMsg:msg];
}
@end
