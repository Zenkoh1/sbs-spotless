from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.urls import reverse

# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)
    
class User(AbstractUser):
    name = models.CharField(max_length=70)
    email = models.CharField(max_length=250, unique=True)
    password = models.CharField(max_length=100)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = UserManager()

class BusModel(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="bus_model_images/")
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
class Bus(models.Model):
    bus_model = models.ForeignKey(BusModel, on_delete=models.CASCADE)
    number_plate = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.number_plate
    
class CleaningChecklist(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
"""
This is the model for the template for the cleaning checklist
"""
class CleaningChecklistItem(models.Model):
    cleaning_checklist = models.ForeignKey(CleaningChecklist, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    order = models.IntegerField()
    image = models.ImageField(upload_to="checklist_item_images/")
    is_image_required = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
class CleaningSchedule(models.Model):
    StatusType = models.TextChoices("StatusType", "UNASSIGNED ASSIGNED IN_PROGRESS COMPLETED")

    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    cleaning_checklist = models.ForeignKey(CleaningChecklist, on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    cleaners = models.ManyToManyField(User)
    status = models.CharField(choices=StatusType.choices, default=StatusType.UNASSIGNED, max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.bus.number_plate} - {self.datetime}"
    
"""
This is the model for the actual cleaning checklist step based on the template
"""
class CleaningChecklistStep(models.Model):
    StatusType = models.TextChoices("StatusType", "INCOMPLETE IN_PROGRESS COMPLETE")

    cleaning_checklist_item = models.ForeignKey(CleaningChecklistItem, on_delete=models.CASCADE)
    cleaning_schedule = models.ForeignKey(CleaningSchedule, on_delete=models.CASCADE)
    status = models.CharField(choices=StatusType.choices, default=StatusType.INCOMPLETE, max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class CleaningChecklistStepImages(models.Model):
    cleaning_checklist_step = models.ForeignKey(CleaningChecklistStep, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to="checklist_step_images/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    