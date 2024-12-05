from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta

# Goal Model for tracking study goals
class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    deadline = models.DateTimeField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

# Task Model for managing study tasks
class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    goal = models.ForeignKey(Goal, related_name='tasks', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    is_completed = models.BooleanField(default=False)
    
    # Adding status to represent task progress
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('doing', 'Doing'),
        ('finished', 'Finished'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='todo')

    def __str__(self):
        return self.description

# Study Session Model for tracking the study time
class StudySession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, related_name='study_sessions', on_delete=models.CASCADE)
    end_time = models.DateTimeField()
    duration = models.DurationField()

    def save(self, *args, **kwargs):
        # Automatically calculate the duration when saving
        if self.end_time:
            self.duration = self.end_time - self.start_time
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Session for {self.task.title} from {self.start_time} to {self.end_time}"

# Profile Model (optional for additional user info)
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birthday = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.username
