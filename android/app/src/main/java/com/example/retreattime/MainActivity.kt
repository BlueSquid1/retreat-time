package com.example.retreattime

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val webView = WebView(this)
        webView.layoutParams = FrameLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT)
        webView.webViewClient = WebViewClient()

        webView.settings.javaScriptEnabled = true
        webView.settings.allowFileAccess = true
        webView.settings.allowFileAccessFromFileURLs = true
        webView.settings.allowUniversalAccessFromFileURLs = true


        // Load local HTML file
        webView.loadUrl("file:///android_asset/index.html")
        setContentView(webView)
    }
}
