package com.cmreader;

import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import androidx.annotation.NonNull;

/**
 * @Author JiaLi
 * Created on 2019-11-15
 */
public class CMRRNModule extends ReactContextBaseJavaModule {
    public final static String DEFAULT_SERVERID     = "fm";

    public final static String KEY_SERVERID     = "serverid";
    public final static String KEY_CONTENTID    = "contentid";
    public final static String KEY_CLEURL       = "cleurl";
    public final static String KEY_LESURL       = "lesurl";
    public final static String KEY_EXIST        = "exist";

    @NonNull
    @Override
    public String getName() {
        return "CMRRNModule";
    }

    // 创建一个上下文，放到构造函数中，得到reactContext
    private ReactApplicationContext mContext;

    public CMRRNModule(ReactApplicationContext reactContext){
        super(reactContext);
        mContext = reactContext;
    }

    @ReactMethod
    public void IsExistCLEFile(ReadableArray object, Callback callback){
        WritableArray array = new WritableNativeArray();
        // has file 0
        int index1 = 0;
        // has file 3
        int index2 = 3;
        for (int i = 0; i < object.size(); i++) {
            ReadableMap map = object.getMap(i);
            String serverid = DEFAULT_SERVERID;
            if (map.hasKey(KEY_SERVERID))
                serverid = map.getString(KEY_SERVERID);

            String contentid = "";
            if (map.hasKey(KEY_CONTENTID))
                contentid =map.getString(KEY_CONTENTID);

            String cleurl = "";
            if (map.hasKey(KEY_CLEURL))
                cleurl =map.getString(KEY_CLEURL);

            String lesurl = "";
            if (map.hasKey(KEY_LESURL))
                lesurl = map.getString(KEY_LESURL);

            WritableMap returnMap = new WritableNativeMap();
            returnMap.putBoolean(KEY_EXIST, (i == index1) || (i == index2));
            returnMap.merge(map);
            array.pushMap(returnMap);
        }
        callback.invoke(null, array);
    }

    @ReactMethod
    public void GetDeviceID(Callback callback){
        callback.invoke(null, "12312321312");
    }

    @ReactMethod
    public void DownloadAndOpenCLEFile(ReadableMap json, Callback callback){
        callback.invoke(null, Integer.valueOf(1));
    }

    @ReactMethod
    public void OpenCLEFile(ReadableMap json, Callback callback){
        callback.invoke(null, Integer.valueOf(0));
    }

    @ReactMethod
    public void OpenQRCode(Callback callback) {
        callback.invoke(null, Integer.valueOf(1));
    }

}
