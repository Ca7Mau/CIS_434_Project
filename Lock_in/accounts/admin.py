# Register your models here.
from django.contrib import admin
from .models import Goal, Task, StudySession

admin.site.register(Goal)
admin.site.register(Task)
admin.site.register(StudySession)
