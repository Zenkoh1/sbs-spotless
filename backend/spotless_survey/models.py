from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class CleanlinessSurvey(models.Model):
    bus = models.ForeignKey('spotless.Bus', on_delete=models.CASCADE)
    rating = models.IntegerField(        
        validators=[
            MinValueValidator(1),  # Minimum value is 1
            MaxValueValidator(10),  # Maximum value is 10
        ]
    )
    comment = models.TextField(blank=True)
    email = models.EmailField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class CleanlinessSurveyImage(models.Model):
    survey = models.ForeignKey(CleanlinessSurvey, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to="cleanliness_survey_images/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)