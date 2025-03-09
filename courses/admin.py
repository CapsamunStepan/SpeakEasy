from django.contrib import admin
from .models import Course, Topic


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "difficulty", "created_at")
    list_filter = ("difficulty", "created_at")
    search_fields = ("title", "description")
    ordering = ("difficulty", "created_at")


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order")
    list_filter = ("course",)
    search_fields = ("title", "explanation")
    ordering = ("course", "order")
