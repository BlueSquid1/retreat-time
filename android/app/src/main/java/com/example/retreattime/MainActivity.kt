package com.example.retreattime

import android.Manifest
import android.app.AlarmManager
import android.app.AlertDialog
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.media.MediaPlayer
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.provider.Settings
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.webkit.WebViewAssetLoader
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import android.util.Log
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout

class WebAppInterface(private val context: Context, private val androidAlarmService: AndroidAlertService) {
    @JavascriptInterface
    fun scheduleAlarm() {
        val alarmId: Int = 0;
        val triggerTimeMillis: Long = System.currentTimeMillis() + 5000;
        Log.d("MyActivityTag", "scheduled alarm");
        //Toast.makeText(this.context, "Scheduled alarm", Toast.LENGTH_SHORT).show();
        this.androidAlarmService.setAlarm(alarmId, triggerTimeMillis);
    }
}

class MainActivity : ComponentActivity() {
    private var androidAlarmService: AndroidAlertService? = null;

    override fun onResume() {
        super.onResume()
        if (!this.androidAlarmService!!.hasNotificationPermission()) {
            AlertDialog.Builder(this)
                .setTitle("Alarm Permission Needed")
                .setMessage("In order to have accurate timing please enable exact alarm.")
                .setPositiveButton("OK") { _, _ ->
                    val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                    startActivity(intent)
                }
                .setNegativeButton("Cancel", null)
                .create()
                .show()
        }

        if (!this.androidAlarmService!!.hasExactTimePermission()) {
            AlertDialog.Builder(this)
                .setTitle("Notification Permission Needed")
                .setMessage("Without notifications alarms will be silenced")
                .setPositiveButton("OK") { _, _ ->
                    requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 100)
                }
                .setNegativeButton("Cancel", null)
                .create()
                .show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState);

        this.androidAlarmService = AndroidAlertService(this);
        enableEdgeToEdge();

        // Web client
        val webView = WebView(this);
        webView.layoutParams = FrameLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT);

        // Host the web file on a local server so the web client can pick it up.
        // Web files go inside the assets/ folder
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build();

        // always accept request to the local web server
        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }
        };

        // Enable the Javascript interpreter in the web browser
        webView.settings.javaScriptEnabled = true;

        val jsWebInterface = WebAppInterface(this, this.androidAlarmService!!);
        webView.addJavascriptInterface(jsWebInterface, "Android");

        // Load local HTML file using asset loader
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html");

        // Display the web client on the screen
        setContentView(webView);
    }
}

