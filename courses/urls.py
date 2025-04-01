from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    path('', views.all_courses, name='all_courses'),
    path('<int:course_id>/', views.selected_course, name='selected_course'),
    path('<int:course_id>/<int:topic_id>', views.selected_topic, name='selected_topic'),
]
