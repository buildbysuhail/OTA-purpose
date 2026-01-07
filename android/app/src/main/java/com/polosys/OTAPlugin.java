package com.polosys;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@CapacitorPlugin(name = "OTAPlugin")
public class OTAPlugin extends Plugin {

    private static final String TAG = "OTAPlugin";
    private static final String PREFS_NAME = "OTAPluginPrefs";
    private static final String KEY_WEBVIEW_PATH = "webview_path";

    @PluginMethod
    public void extractZip(PluginCall call) {
        String zipPath = call.getString("zipPath");
        String destPath = call.getString("destPath");

        Log.d(TAG, "========================================");
        Log.d(TAG, "extractZip called");
        Log.d(TAG, "  zipPath: " + zipPath);
        Log.d(TAG, "  destPath: " + destPath);

        if (zipPath == null || destPath == null) {
            Log.e(TAG, "ERROR: Missing zipPath or destPath");
            call.reject("Missing zipPath or destPath");
            return;
        }

        try {
            // Convert file:// URI to path
            String zipFilePath = uriToPath(zipPath);
            String destFilePath = uriToPath(destPath);

            Log.d(TAG, "  Converted zipFilePath: " + zipFilePath);
            Log.d(TAG, "  Converted destFilePath: " + destFilePath);

            File zipFile = new File(zipFilePath);
            File destDir = new File(destFilePath);

            if (!zipFile.exists()) {
                Log.e(TAG, "ERROR: ZIP file not found: " + zipFilePath);
                call.reject("ZIP file not found: " + zipFilePath);
                return;
            }

            Log.d(TAG, "  ZIP file size: " + zipFile.length() + " bytes");

            // Create destination directory
            if (!destDir.exists()) {
                boolean created = destDir.mkdirs();
                Log.d(TAG, "  Created destination directory: " + created);
            }

            // Extract ZIP
            Log.d(TAG, "  Starting extraction...");
            int fileCount = extractZipFile(zipFile, destDir);
            Log.d(TAG, "  Extraction complete! Files extracted: " + fileCount);

            // Verify index.html exists
            File indexFile = new File(destDir, "index.html");
            if (indexFile.exists()) {
                Log.d(TAG, "  index.html found, size: " + indexFile.length() + " bytes");
            } else {
                Log.w(TAG, "  WARNING: index.html not found in extracted bundle!");
            }

            Log.d(TAG, "========================================");
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "ERROR: Failed to extract ZIP", e);
            call.reject("Failed to extract ZIP: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void setWebViewPath(PluginCall call) {
        String path = call.getString("path");

        Log.d(TAG, "========================================");
        Log.d(TAG, "setWebViewPath called");
        Log.d(TAG, "  path: " + path);

        if (path == null) {
            Log.e(TAG, "ERROR: Missing path");
            call.reject("Missing path");
            return;
        }

        try {
            // Store the path in SharedPreferences
            SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            prefs.edit().putString(KEY_WEBVIEW_PATH, path).apply();

            Log.d(TAG, "  WebView path saved successfully");
            Log.d(TAG, "========================================");
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "ERROR: Failed to set WebView path", e);
            call.reject("Failed to set WebView path: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void resetWebViewPath(PluginCall call) {
        Log.d(TAG, "========================================");
        Log.d(TAG, "resetWebViewPath called");

        try {
            SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            prefs.edit().remove(KEY_WEBVIEW_PATH).apply();

            Log.d(TAG, "  WebView path reset successfully");
            Log.d(TAG, "========================================");
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "ERROR: Failed to reset WebView path", e);
            call.reject("Failed to reset WebView path: " + e.getMessage(), e);
        }
    }

    @PluginMethod
    public void getWebViewPath(PluginCall call) {
        Log.d(TAG, "getWebViewPath called");

        try {
            SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String path = prefs.getString(KEY_WEBVIEW_PATH, null);

            Log.d(TAG, "  Current path: " + (path != null ? path : "(default)"));

            JSObject result = new JSObject();
            result.put("path", path);
            call.resolve(result);
        } catch (Exception e) {
            Log.e(TAG, "ERROR: Failed to get WebView path", e);
            call.reject("Failed to get WebView path: " + e.getMessage(), e);
        }
    }

    // Static method to get stored WebView path (called from MainActivity)
    public static String getStoredWebViewPath(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String path = prefs.getString(KEY_WEBVIEW_PATH, null);
        Log.d(TAG, "getStoredWebViewPath: " + (path != null ? path : "(default)"));
        return path;
    }

    private String uriToPath(String uriString) {
        if (uriString.startsWith("file://")) {
            return Uri.parse(uriString).getPath();
        }
        return uriString;
    }

    private int extractZipFile(File zipFile, File destDir) throws IOException {
        byte[] buffer = new byte[8192];
        int fileCount = 0;

        try (ZipInputStream zis = new ZipInputStream(new BufferedInputStream(new FileInputStream(zipFile)))) {
            ZipEntry entry;

            while ((entry = zis.getNextEntry()) != null) {
                String name = entry.getName();

                // Security: prevent zip slip attack
                File outFile = new File(destDir, name);
                String canonicalDestPath = destDir.getCanonicalPath();
                String canonicalOutPath = outFile.getCanonicalPath();

                if (!canonicalOutPath.startsWith(canonicalDestPath + File.separator)) {
                    throw new IOException("ZIP entry outside target directory: " + name);
                }

                if (entry.isDirectory()) {
                    outFile.mkdirs();
                } else {
                    // Ensure parent directories exist
                    File parent = outFile.getParentFile();
                    if (parent != null && !parent.exists()) {
                        parent.mkdirs();
                    }

                    // Extract file
                    try (FileOutputStream fos = new FileOutputStream(outFile)) {
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                    fileCount++;
                }

                zis.closeEntry();
            }
        }

        return fileCount;
    }

    @PluginMethod
    public void restartApp(PluginCall call) {
        Log.d(TAG, "========================================");
        Log.d(TAG, "restartApp called - closing and relaunching app");

        try {
            Activity activity = getActivity();
            Context context = getContext();

            if (activity == null || context == null) {
                Log.e(TAG, "ERROR: Activity or context is null");
                call.reject("Activity or context is null");
                return;
            }

            // Get the launch intent for this app
            Intent launchIntent = context.getPackageManager()
                    .getLaunchIntentForPackage(context.getPackageName());

            if (launchIntent == null) {
                Log.e(TAG, "ERROR: Could not get launch intent");
                call.reject("Could not get launch intent");
                return;
            }

            // Clear the task and start fresh
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK);
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

            // Schedule app restart after a short delay
            PendingIntent pendingIntent = PendingIntent.getActivity(
                    context,
                    0,
                    launchIntent,
                    PendingIntent.FLAG_CANCEL_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (alarmManager != null) {
                // Restart after 500ms
                alarmManager.set(
                        AlarmManager.RTC,
                        System.currentTimeMillis() + 500,
                        pendingIntent
                );
            }

            Log.d(TAG, "App restart scheduled, finishing current activity");
            Log.d(TAG, "========================================");

            // Resolve the call before finishing
            call.resolve();

            // Finish the activity and kill the process
            activity.finishAffinity();

            // Force kill the process to ensure clean restart
            android.os.Process.killProcess(android.os.Process.myPid());
            System.exit(0);

        } catch (Exception e) {
            Log.e(TAG, "ERROR: Failed to restart app", e);
            call.reject("Failed to restart app: " + e.getMessage(), e);
        }
    }
}
