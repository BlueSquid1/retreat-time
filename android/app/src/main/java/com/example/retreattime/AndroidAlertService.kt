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
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.IBinder
import androidx.activity.ComponentActivity
import androidx.core.app.NotificationCompat

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        // Called when the alarm time has occurred
        // Toast.makeText(context, "alarm triggered now", Toast.LENGTH_LONG).show()

        // Need to move to a service to do more useful things
        val intent = Intent(context, AlarmService::class.java);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }
}

class AlarmService : Service() {
    // Code that runs in the foreground
    private lateinit var mediaPlayer: MediaPlayer

    override fun onCreate() {
        super.onCreate()
        // Play alarm sound in a notification
        val notificationId = 1
        startForeground(
            notificationId,
            createNotification()
        )
    }

    private fun createNotification(): Notification {
        val channelId = "alarm_channel"

        val soundUri = Uri.parse(
            "android.resource://${this.packageName}/raw/bell"
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Tell Android a high importance notification is about to come
            val channel = NotificationChannel(
                channelId,
                "alarms",
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

        return NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("alarms")
            .setContentText("Alarm is ringing")
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setOngoing(false)
            .build()
    }

    override fun onDestroy() {
        mediaPlayer.stop()
        mediaPlayer.release()
        super.onDestroy()
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

    fun setAlarm(alarmId: Int, triggerAtUtcTimeMillis: Long) {
        val intent = Intent(this.context, AlarmReceiver::class.java)
            .putExtra("ALARM_ID", alarmId)

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
}