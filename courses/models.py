from django.db import models


class Course(models.Model):
    LEVEL_CHOICES = [
        ('A1', 'A1 - Beginner'),
        ('A2', 'A2 - Elementary'),
        ('B1', 'B1 - Intermediate'),
        ('B2', 'B2 - Upper-Intermediate'),
        ('C1', 'C1 - Advanced'),
        ('C2', 'C2 - Proficient'),
    ]
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    difficulty = models.CharField(max_length=2, choices=LEVEL_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["difficulty"]

    def __str__(self):
        return f"{self.get_difficulty_display()} - {self.title}"


class Topic(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="topics")
    title = models.CharField(max_length=255)
    explanation = models.TextField()
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Task(models.Model):
    type_choices = [
        ("1", "Missed Word"),
        ("2", "Ordering"),
        ("3", "Pronunciation"),
        ("4", "Audition")
    ]
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="tasks")
    type = models.CharField(max_length=1, choices=type_choices)
    question = models.TextField()
    sentence_without_a_word = models.TextField(blank=True)
    variants = models.JSONField(default=list, blank=True)
    missed_word = models.TextField(blank=True)
    sentence_for_ordering = models.TextField(blank=True)
    mp3 = models.FileField(upload_to="mp3/", blank=True)
    text_to_speech = models.TextField(blank=True)
    order = models.PositiveIntegerField(blank=True, default=1)

    class Meta:
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if len(self.variants) != 4:  # Проверяем, что 4 элемента
            raise ValueError("Variants must have exactly 4 elements")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.topic} - {self.order}"
