package com.example.retreattime

import android.Manifest
import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.core.app.NotificationCompat

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val alarmId = intent.getIntExtra("ALARM_ID", 0);
        val soundType = intent.getStringExtra("SOUND_TYPE");
        Log.d("MyActivityTag", "alarm triggered now for id: ${alarmId} with sound: ${soundType}");

        // Need to move to a service to do more useful things
        val intentForAlarmService = Intent(context, AlarmService::class.java)
            .putExtra("ALARM_ID", alarmId)
            .putExtra("SOUND_TYPE", soundType)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intentForAlarmService)
        } else {
            context.startService(intentForAlarmService)
        }
    }
}

class AlarmService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId);
        // Play alarm sound in a notification
        Log.d("MyActivityTag", "starting forground service");
        val alarmId = intent!!.getIntExtra("ALARM_ID", 0);
        Log.d("MyActivityTag", "alarm ID: ${alarmId}");
        val soundType: String? = intent!!.getStringExtra("SOUND_TYPE");
        Log.d("MyActivityTag", "soundType: ${soundType}");

        // Notification ID can't be zero so just add 1 to the alarm ID
        val notificationId = alarmId + 1;
        startForeground(
            notificationId,
            this.createNotification(soundType!!)
        )
        return START_NOT_STICKY;
    }

    private fun createNotification(soundType: String): Notification {
        val channelId = "${soundType}_alarm_channel"

        val soundUri = Uri.parse(
            "android.resource://${this.packageName}/raw/${soundType}"
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Log.d("MyActivityTag", "registering a notification channel");
            // Register a notification channel
            val channel = NotificationChannel(
                channelId,
                "${soundType} alarms",
                NotificationManager.IMPORTANCE_HIGH
            )

            val audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM) // or USAGE_NOTIFICATION
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()
            channel.setSound(soundUri, audioAttributes);

            this.getSystemService(NotificationManager::class.java)
                .createNotificationChannel(channel)
        }

        Log.d("MyActivityTag", "creating a notification for ${channelId}");

        return NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("alarms")
            .setContentText("Alarm is ringing")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setOngoing(false)
            .build()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}

class AndroidAlertService(private val context: ComponentActivity) {
    private val alarmManager: AlarmManager =
        this.context.getSystemService(Context.ALARM_SERVICE) as AlarmManager;

    fun hasNotificationPermission(): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (this.context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    fun hasExactTimePermission(): Boolean {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (!this.alarmManager.canScheduleExactAlarms()) {
                return false;
            }
        }
        return true;
    }

    fun setAlarm(alarmId: Int, triggerAtUtcTimeMillis: Long, soundType: String) {
        val intent = Intent(this.context, AlarmReceiver::class.java)
            .putExtra("ALARM_ID", alarmId)
            .putExtra("SOUND_TYPE", soundType)

        val pendingIntent = PendingIntent.getBroadcast(
            this.context,
            alarmId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        this.alarmManager.setExactAndAllowWhileIdle(
            AlarmManager.RTC_WAKEUP,
            triggerAtUtcTimeMillis,
            pendingIntent
        )
    }

    fun cancelAlarm(alarmId: Int, triggerAtUtcTimeMillis: Long, soundType: String) {
        val intent = Intent(this.context, AlarmReceiver::class.java)
            .putExtra("ALARM_ID", alarmId)
            .putExtra("SOUND_TYPE", soundType)

        val pendingIntent = PendingIntent.getBroadcast(
            this.context,
            alarmId,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        this.alarmManager.cancel(pendingIntent);
        pendingIntent.cancel();
    }
}