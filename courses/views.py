from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseBadRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from account.models import ProgressTask
from .models import Course, Topic, Task
import json


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
    topic = task.topic
    topic_tasks = Task.objects.filter(topic=topic).order_by('order')
    task_orders = list(topic_tasks)
    current_index = task_orders.index(task)

    # следующее задание в этой теме, если задания закончились, тогда следующая тема
    next_task = None
    next_topic = None
    if current_index + 1 < len(task_orders):
        next_task = task_orders[current_index + 1]
    else:
        next_topic = Topic.objects.filter(course=topic.course, order__gt=topic.order).order_by('order').first()

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
        "task_json": json.dumps(task_data, ensure_ascii=False),
        "next_task_id": next_task.id if next_task else None,
        "next_topic_id": next_topic.id if next_topic else None,
    })


@require_POST
@login_required
def save_task_progress(request):
    task_id = request.POST.get("task_id")
    score = request.POST.get("score", 100.0)

    if not task_id:
        return JsonResponse({"error": "task_id is required"}, status=400)

    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return JsonResponse({"error": "Task not found"}, status=404)

    progress, _ = ProgressTask.objects.get_or_create(user=request.user, task=task)
    progress.attempts += 1
    progress.score = float(score)
    progress.completed = True
    progress.save()

    return JsonResponse({"message": "Progress saved"})
