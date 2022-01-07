package joesky.mp;

import android.app.*;
import android.os.*;
import android.view.*;

public class wel extends Activity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
	{
        super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE); //不显示标题
        setContentView(R.layout.wel);
	}
	
	@Override
	public void onDestroy() {
		super.onDestroy();
	}
}
