package com.cmreader;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * @Author JiaLi
 * Created on 2019-11-15
 */
public class CMRRNPackage implements ReactPackage {
    public CMRRNModule nativeModule;
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        nativeModule = new CMRRNModule(reactContext);
        List<NativeModule> modules = new ArrayList<>();
        //将我们创建NativeModule添加进原生模块列表中
        modules.add(nativeModule);
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        //该处后期RN调用原生控件或自定义组件时可用到
        return Collections.emptyList();
    }
}
