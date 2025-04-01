from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Course, Topic, Task


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
def selected_topic(request, course_id, topic_id):
    topic = Topic.objects.get(id=topic_id)
    if not topic:
        return render(request, "404.html", status=404)

    tasks = Task.objects.filter(topic=topic_id).all()

    return render(request, "courses/selected_topic.html", {"topic": topic, "tasks": tasks})
