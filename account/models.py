from django.db import models
from django.contrib.auth.models import User
from courses.models import Course, Topic, Task


# Create your models here.
class ProgressCourse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='course_progress')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='progresses')
    completed = models.BooleanField(default=False)
    score = models.FloatField(default=0.0)

    class Meta:
        unique_together = ["user", "course"]

    def __str__(self):
        return f'{self.user} - {self.course} - {self.score}'


class ProgressTopic(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='topic_progress')
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='progresses')
    completed = models.BooleanField(default=False)
    score = models.FloatField(default=0.0)

    class Meta:
        unique_together = ["user", "topic"]

    def __str__(self):
        return f'{self.user} - {self.topic} - {self.score}'


class ProgressTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task_progress')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="progresses")
    completed = models.BooleanField(default=False)  # Закончил задание или нет
    score = models.FloatField(default=0.0)  # Оценка выполнения (0–100%)
    attempts = models.PositiveIntegerField(default=0)  # Количество попыток
    last_attempt = models.DateTimeField(auto_now=True)  # Время последней попытки

    class Meta:
        unique_together = ["user", "task"]  # Каждое задание для пользователя — одна запись

    def __str__(self):
        return f"{self.user} - {self.task} - {self.score}%"
