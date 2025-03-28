from django.contrib import admin
from .models import Course, Topic, Task


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


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("topic", "type", "question", "sentence_without_a_word", "variants", "missed_word",
                    "sentence_for_ordering", "mp3", "text_to_speech", "order")
    list_filter = ("topic", "type")

