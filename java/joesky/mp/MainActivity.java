package joesky.mp;

import android.app.*;
import android.webkit.*;
import android.os.*;
import android.view.*;
import java.io.*;
import android.util.*;
import android.widget.*;
import android.content.*;
import android.media.*;
import android.database.*;
import android.provider.*;

public class MainActivity extends Activity
{
		public WebView webView;
        public String music_url="";
		public static MainActivity instance;
		@Override
		public void onCreate(Bundle savedInstanceState) {
				super.onCreate(savedInstanceState);
				requestWindowFeature(Window.FEATURE_NO_TITLE); //不显示标题
				setContentView(R.layout.main);
				instance = this;
				music_url = getIntent().getStringExtra("url");
				
                webView=(WebView) findViewById(R.id.WebView);
				WebSettings webSettings=webView.getSettings();
				//设置支持javascript,
				webSettings.setJavaScriptEnabled(true);
				webSettings.setDomStorageEnabled(true);
				//设置可以访问文件
				webSettings.setAllowFileAccessFromFileURLs(true);
				webSettings.setAllowFileAccess(true); 
				webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE); 
				//自适应屏幕
				webSettings.setUseWideViewPort(true);
				webSettings.setLoadWithOverviewMode(true);
				//js可以直接打开窗口
				webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
				//启用autoplay
				webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
				
				webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
				webView.setBackgroundColor(0);
				webView.addJavascriptInterface(this,"android");//添加js监听'android'
				webView.setWebViewClient(new WebViewClient());
				webView.setWebChromeClient(webChromeClient);
				webView.loadUrl("file:///android_asset/mp.html");
		}
	    
		private WebChromeClient webChromeClient=new WebChromeClient(){
				//js的alert弹窗处理, 改toast
				@Override
				public boolean onJsAlert(WebView webView, String url, String message, JsResult result) {
						Toast.makeText(getApplicationContext(), message, Toast.LENGTH_LONG).show();
						result.confirm();
						return true;
				}
		};

		@JavascriptInterface
		public String returnMUSIC_URL() {
				return music_url;
		}
		//同目录文件
	    @JavascriptInterface
		public String getFiles(String path) {
				File file=new File(path);
				File[] files=file.listFiles();
				if (files == null){Log.e("error","空目录");return null;}
				String s="";
				for(int i =0;i<files.length;i++){
				      s += files[i].getAbsolutePath() + "\n";
				}
				return s;
		}
		@JavascriptInterface
		public int isFolder(String path) {
	    		File file = new File(path);
				if(file.isDirectory()) {	
						return 1; 
				}
				else {
						return 0;
				}
		}
	    @JavascriptInterface
		public String getSDPath(){ 
				File sdDir = null; 
				boolean sdCardExist = Environment.getExternalStorageState()   
					.equals(android.os.Environment.MEDIA_MOUNTED);//判断sd卡是否存在
				if(sdCardExist)   
				{                               
					sdDir = Environment.getExternalStorageDirectory();//获取SD卡目录
				}   
				return sdDir.toString(); 
		}	
		@JavascriptInterface
		public void setMUSIC_URL(String path) {
		        music_url = path;
		}
		@JavascriptInterface
		public void jswrite(String filename, String contents)
		{
				try 
				{
				    FileOutputStream out = new FileOutputStream(filename);
					byte[] bytes = contents.getBytes("UTF-8");
					out.write(bytes);
					out.close();
				}
				catch(Exception e) 
				{
					e.printStackTrace();
				}
		}
		/*
		 * 打开任意Activity"
		 */
		@JavascriptInterface
		public void gotoActivity(String path) {
				Intent intent = new Intent();
				intent.setClassName(this, path);
				startActivity(intent);
		}
		
        /*防止webView内存泄露*/
		@Override
		public void onDestroy() {
				if (webView != null) {
						webView.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
						webView.clearHistory();
						((ViewGroup) webView.getParent()).removeView(webView);
						webView.destroy();
						webView = null;
				}
				super.onDestroy();
		}
}
