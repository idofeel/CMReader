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

// 1.获取File是否存在，供RN刷新列表使用
RCT_EXPORT_METHOD(IsExistCLEFile:(NSString *)msg:(RCTResponseSenderBlock)callback){
  [self showAlert:@"IsExistCLEFile" withMessage:msg cancleBlock:^{
    
  } confirmBlock:^{
    callback(@[[NSNull null], @(YES)]);
  }];
}

// 2.获取DeviceID
RCT_EXPORT_METHOD(GetDeviceID:(RCTResponseSenderBlock)callback){
  [self showAlert:@"GetDeviceID" withMessage:@"" cancleBlock:^{
    
  } confirmBlock:^{
    callback(@[[NSNull null], @(YES)]);
  }];
}

// 3.下载并打开CLE文件和证书文件
RCT_EXPORT_METHOD(DownloadAndOpenCLEFile:(NSString *)msg:(RCTResponseSenderBlock)callback){
  [self showAlert:@"DownloadAndOpenCLEFile" withMessage:msg cancleBlock:^{
    
  } confirmBlock:^{
     callback(@[[NSNull null], @(YES)]);
  }];
}

// 4.RN调用打开CMReader消息名称
RCT_EXPORT_METHOD(OpenCLEFile:(NSString *)msg:(RCTResponseSenderBlock)callback){
    [self showAlert:@"已经调用到原生OpenCLEFile" withMessage:msg cancleBlock:^{
        
    } confirmBlock:^{
        callback(@[[NSNull null], @(YES)]);
    }];
}


RCT_EXPORT_METHOD(RemoveCMRFile:(NSString *)msg:(RCTResponseSenderBlock)callback){
    /*
     {"content":[{"name":"雪地摩托"},{"name":"自行车"}]}
     */
    [self showAlert:@"已经调用到原生RemoveCMRFile" withMessage:msg cancleBlock:^{
        
    } confirmBlock:^{
        callback(@[[NSNull null], @(YES)]);
    }];
    /*([[NSNotificationCenter defaultCenter] postNotificationName:REMOVE_CMRFile
                                                        object:msg
                                                      userInfo:nil];*/
}

RCT_EXPORT_METHOD(GetCMRFileExist:(NSString *)msg:(RCTResponseSenderBlock)callback){
    /*
     {"content":[{"name":"雪地摩托"},{"name":"自行车"}]}
     */
    [self showAlert:@"已经调用到原生GetCMRFileExist" withMessage:msg cancleBlock:^{
        
    } confirmBlock:^{
        // 模拟RN调用GetCMRFileExist，原生再回调给RN test 消息
        NSString* test = @"{\"content\":[{\"name\":\"雪地摩托\",\"exist\":true},{\"name\":\"自行车\",\"exist\":true}]}";
        callback(@[test, @(YES)]);
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
