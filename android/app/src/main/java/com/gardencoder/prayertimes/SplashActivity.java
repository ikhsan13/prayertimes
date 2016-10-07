package com.gardencoder.prayertimes;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.gardencoder.prayertimes.R;

public class SplashActivity extends AppCompatActivity {
    private boolean isPressBack = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(2000);
                } catch (Exception e) {

                } finally {
                    if (!isPressBack) {
                        startActivity(new Intent(SplashActivity.this, MainActivity.class));
                    }
                }
            }
        }).start();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        isPressBack = true;
    }

    @Override
    protected void onPause() {
        super.onPause();
        finish();
    }
}
