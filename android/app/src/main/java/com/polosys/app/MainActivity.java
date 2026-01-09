package com.polosys.app;

import android.os.Build;
import android.os.Bundle;
import android.graphics.drawable.ColorDrawable;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

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

        // Enable edge-to-edge display
        // This allows content to draw behind system bars while still
        // reporting proper safe-area insets to CSS via env()
        setupEdgeToEdge();

        // Load custom OTA bundle if available
        loadOTABundle();

        Log.d(TAG, "onCreate complete");
        Log.d(TAG, "========================================");
    }

    /**
     * Setup status bar display mode.
     *
     * APPROACH: overlaysWebView: false
     * - Status bar has its OWN space with solid background color
     * - WebView content starts BELOW the status bar
     * - Icons are ALWAYS visible (solid background prevents invisible icons)
     * - The actual status bar color/style is controlled by Capacitor StatusBar plugin
     *   in src/Android/lib/statusBar.ts
     *
     * NOTE: We let Capacitor's StatusBar plugin handle most of the configuration.
     * This method just sets initial defaults before the plugin takes over.
     */
    private void setupEdgeToEdge() {
        try {
            Window window = getWindow();

            // Let system handle content fitting (status bar has its own space)
            // The Capacitor StatusBar plugin will call setOverlaysWebView(false)
            // which tells the WebView not to extend behind the status bar
            WindowCompat.setDecorFitsSystemWindows(window, true);

            // Set initial status bar color (white background with dark icons)
            // This will be overridden by Capacitor StatusBar plugin dynamically
            window.setStatusBarColor(Color.WHITE);

            // Navigation bar can remain transparent for gesture navigation
            window.setNavigationBarColor(Color.TRANSPARENT);

            // Set up window insets controller for light/dark status bar icons
            View decorView = window.getDecorView();
            WindowInsetsControllerCompat insetsController =
                WindowCompat.getInsetsController(window, decorView);

            if (insetsController != null) {
                // Dark icons for light backgrounds (default)
                insetsController.setAppearanceLightStatusBars(true);
                insetsController.setAppearanceLightNavigationBars(true);
            }

            // For camera preview transparency (used by barcode scanner)
            window.setBackgroundDrawable(new ColorDrawable(Color.WHITE));
            window.setFormat(PixelFormat.TRANSLUCENT);

            Log.d(TAG, "Status bar setup complete (overlaysWebView: false mode)");
        } catch (Exception e) {
            Log.w(TAG, "Failed to setup status bar", e);
        }
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
