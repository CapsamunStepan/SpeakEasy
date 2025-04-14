from django.contrib import admin
from .models import ProgressTask


# Register your models here.
@admin.register(ProgressTask)
class ProgressTaskAdmin(admin.ModelAdmin):
    list_display = ('user', 'task', 'completed', 'score', 'attempts', 'last_attempt')
    list_filter = ('user', 'task', 'completed')
