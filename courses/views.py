from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Course


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
