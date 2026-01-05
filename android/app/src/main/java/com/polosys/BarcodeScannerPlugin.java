package com.polosys;

import android.content.Intent;

import androidx.activity.result.ActivityResultLauncher;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.journeyapps.barcodescanner.ScanContract;
import com.journeyapps.barcodescanner.ScanOptions;

@CapacitorPlugin(name = "BarcodeScanner")
public class BarcodeScannerPlugin extends Plugin {

    private PluginCall savedCall;

    private ActivityResultLauncher<ScanOptions> barcodeLauncher;

    @Override
    public void load() {
        barcodeLauncher =
                getBridge().registerForActivityResult(
                        new ScanContract(),
                        result -> {
                            if (savedCall == null) return;

                            if (result.getContents() != null) {
                                JSObject ret = new JSObject();
                                ret.put("text", result.getContents());
                                savedCall.resolve(ret);
                            } else {
                                savedCall.reject("Scan cancelled");
                            }

                            savedCall = null;
                        }
                );
    }

    @PluginMethod
    public void scan(PluginCall call) {

        savedCall = call;

        ScanOptions options = new ScanOptions();
        options.setPrompt("Scan a barcode");
        options.setBeepEnabled(true);
        options.setOrientationLocked(true);
        options.setDesiredBarcodeFormats(ScanOptions.ALL_CODE_TYPES);

        barcodeLauncher.launch(options);
    }
}
