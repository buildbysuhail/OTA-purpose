package com.polosys.app;

import android.os.Bundle;
import android.graphics.drawable.ColorDrawable;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.util.Log;
import android.view.WindowManager;

import com.getcapacitor.BridgeActivity;
import com.polosys.BarcodeScannerPlugin;
import com.polosys.OTAPlugin;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "========================================");
        Log.d(TAG, "onCreate started");

        // IMPORTANT: Register custom plugins BEFORE super.onCreate()
        // This is required for Capacitor to properly initialize the plugins
        Log.d(TAG, "Registering plugins BEFORE super.onCreate()...");
        registerPlugin(BarcodeScannerPlugin.class);
        registerPlugin(OTAPlugin.class);
        Log.d(TAG, "Plugins registered");

        super.onCreate(savedInstanceState);

        // Make window background transparent to allow native camera preview to show above the WebView
        try {
            getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
            getWindow().setFormat(PixelFormat.TRANSLUCENT);
            getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        } catch (Exception e) {
            Log.w(TAG, "Failed to set transparent background", e);
        }

        // Load custom OTA bundle if available
        loadOTABundle();

        Log.d(TAG, "onCreate complete");
        Log.d(TAG, "========================================");
    }

    private void loadOTABundle() {
        Log.d(TAG, "loadOTABundle: Checking for custom bundle...");

        String customPath = OTAPlugin.getStoredWebViewPath(this);

        if (customPath == null || customPath.isEmpty()) {
            Log.d(TAG, "loadOTABundle: No custom path stored, using default bundle");
            return;
        }

        Log.d(TAG, "loadOTABundle: Found stored path: " + customPath);

        // Convert file:// URI to path
        if (customPath.startsWith("file://")) {
            customPath = customPath.substring(7);
            Log.d(TAG, "loadOTABundle: Converted to path: " + customPath);
        }

        java.io.File bundleDir = new java.io.File(customPath);
        java.io.File indexFile = new java.io.File(bundleDir, "index.html");

        Log.d(TAG, "loadOTABundle: Bundle dir exists: " + bundleDir.exists());
        Log.d(TAG, "loadOTABundle: index.html exists: " + indexFile.exists());

        if (bundleDir.exists() && indexFile.exists()) {
            Log.d(TAG, "loadOTABundle: Setting server base path to: " + customPath);

            try {
                getBridge().setServerBasePath(customPath);
                Log.d(TAG, "loadOTABundle: SUCCESS - Custom bundle loaded!");
            } catch (Exception e) {
                Log.e(TAG, "loadOTABundle: FAILED to set server base path", e);
            }
        } else {
            Log.w(TAG, "loadOTABundle: Bundle directory or index.html not found");
            Log.w(TAG, "loadOTABundle: Using default bundle instead");
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        Log.d(TAG, "onResume - App resumed");
    }

    @Override
    public void onPause() {
        super.onPause();
        Log.d(TAG, "onPause - App paused");
    }
}
