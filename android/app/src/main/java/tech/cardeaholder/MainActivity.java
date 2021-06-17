package tech.indicio.cardeaholder;

import android.os.Bundle;
import android.system.ErrnoException;
import android.system.Os;
import java.io.File;

import android.view.WindowManager; 

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    this.getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
  
  try {
      Os.setenv("EXTERNAL_STORAGE", getExternalFilesDir(null).getAbsolutePath(), true);
      System.loadLibrary("indy");
    } catch (ErrnoException e) {
      e.printStackTrace();
    }
  }
  protected String getMainComponentName() {
    return "cardeaholder";
  }
}
