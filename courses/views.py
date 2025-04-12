from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from .models import Course, Topic, Task
import json
from django.forms.models import model_to_dict


# Create your views here.
@login_required
def all_courses(request):
    courses = Course.objects.all()
    return render(request, 'courses/all_courses.html', {"courses": courses})


@login_required
def selected_course(request, course_id):
    course = Course.objects.prefetch_related("topics").filter(id=course_id).first()
    if not course:
        return render(request, "404.html", status=404)

    return render(request, "courses/selected_course.html", {"course": course})


@login_required
def selected_topic(request, topic_id):
    topic = Topic.objects.get(id=topic_id)
    if not topic:
        return render(request, "404.html", status=404)

    tasks = Task.objects.filter(topic=topic_id).all()

    return render(request, "courses/selected_topic.html", {"topic": topic, "tasks": tasks})


@login_required
def task_detail(request, task_id):
    task = get_object_or_404(Task, id=task_id)

    task_data = {
        "id": task.id,
        "type": task.type,
        "question": task.question,
        "sentence_without_a_word": task.sentence_without_a_word,
        "variants": task.variants,
        "missed_word": task.missed_word,
        "sentence_for_ordering": task.sentence_for_ordering,
        "text_to_speech": task.text_to_speech,
        "audition_text": getattr(task, "audition_text", ""),
        "order": task.order,
        "mp3": task.mp3.url if task.mp3 else None
    }

    return render(request, 'courses/task_passing.html', {
        "task_json": json.dumps(task_data, ensure_ascii=False)
    })


