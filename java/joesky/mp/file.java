package joesky.mp;

import java.io.File;

import android.app.ListActivity;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.ListView;
import android.widget.SimpleCursorAdapter;
import android.view.*;

/**
 * 该Demo运行后，会显示所有你sd卡上的音乐文件列表， 并可以点击列表选择某一首歌曲进行播放。
 * 
 */
public class file extends ListActivity {
		private Cursor cursor;
		public static int STATE_SELECT_ALBUM = 0;
		public static int STATE_SELECT_SONG = 1;
		private int currentState = STATE_SELECT_ALBUM;

		@SuppressWarnings("deprecation")
		@Override
		protected void onCreate(Bundle savedInstanceState) {
				super.onCreate(savedInstanceState);
				requestWindowFeature(Window.FEATURE_NO_TITLE); //不显示标题
				setContentView(R.layout.file);

				/**
				 * 创建一个字符串数组，表示当运行查询时将从MediaStore返回的列。
				 */
				String[] columns = { android.provider.MediaStore.Audio.Albums._ID,
						android.provider.MediaStore.Audio.Albums.ALBUM };
				/**
				 * 返回一个所有可用唱片集的列表
				 */
				cursor = managedQuery(MediaStore.Audio.Albums.EXTERNAL_CONTENT_URI,
									  columns, null, null, null);
				String[] displayFields = new String[] { MediaStore.Audio.Albums.ALBUM };
				int[] displayViews = new int[] { android.R.id.text1 };
				/**
				 * 可以使用setListAdapter方法将Cursor对象绑定到ListView对象
				 */
				setListAdapter(new SimpleCursorAdapter(this, R.layout.list_item_custom, cursor, displayFields, displayViews));
			}

		@SuppressWarnings("deprecation")
		@Override
		protected void onListItemClick(ListView l, View v, int position, long id) {
				super.onListItemClick(l, v, position, id);
				/**
				 * 判断点击的是歌曲文件夹还是单个歌曲
				 */
				String audioFilePath="";
				if (currentState == STATE_SELECT_ALBUM) {
						if (cursor.moveToPosition(position)) {
								String[] columns = { MediaStore.Audio.Media.DATA,
										MediaStore.Audio.Media._ID,
										MediaStore.Audio.Media.TITLE,
										MediaStore.Audio.Media.DISPLAY_NAME,
										MediaStore.Audio.Media.MIME_TYPE };
								String where = android.provider.MediaStore.Audio.Media.ALBUM
									+ "=?";
								String whereVal[] = { cursor.getString(cursor
																	   .getColumnIndex(MediaStore.Audio.Albums.ALBUM)) };
								String orderBy = android.provider.MediaStore.Audio.Media.TITLE;
								cursor = managedQuery(
									MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, columns,
									where, whereVal, orderBy);
								String[] displayFields = new String[] { MediaStore.Audio.Media.DISPLAY_NAME };
								int[] displayViews = new int[] { android.R.id.text1 };
								setListAdapter(new SimpleCursorAdapter(this, R.layout.list_item_custom, cursor, displayFields, displayViews));
								currentState = STATE_SELECT_SONG;
							}
					} else if (currentState == STATE_SELECT_SONG) {
						if (cursor.moveToPosition(position)) {
								int fileColumn = cursor
									.getColumnIndex(MediaStore.Audio.Media.DATA);
								//int mimeTypeColumn = cursor
									//.getColumnIndex(MediaStore.Audio.Media.MIME_TYPE);
								audioFilePath = cursor.getString(fileColumn);
								//String mimeType = cursor.getString(mimeTypeColumn);
								
					            Intent intent = new Intent(this,MainActivity.class);
								intent.putExtra("url", audioFilePath);
								startActivity(intent);
								MainActivity.instance.finish();
							}
					}
		}
			
		@Override
		public void onDestroy() {
				super.onDestroy();
		}
	}
