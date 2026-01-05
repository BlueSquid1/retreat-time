package com.example.retreattime

import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.webkit.WebViewAssetLoader
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.widget.FrameLayout

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState);
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

        // Load local HTML file using asset loader
        webView.loadUrl("https://appassets.androidplatform.net/assets/index.html");

        // Display the web client on the screen
        setContentView(webView);
    }
}

