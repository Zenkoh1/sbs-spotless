from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import CleanlinessSurvey, CleanlinessSurveyImage
from .serializer import CleanlinessSurveySerializer

# Create your views here.
class CleanlinessSurveyViewSet(viewsets.ModelViewSet):
    queryset = CleanlinessSurvey.objects.all()
    serializer_class = CleanlinessSurveySerializer
    permission_classes = []
    authentication_classes = []
    http_method_names = ['get', 'post']
    
    def perform_create(self, serializer):
        cleanliness_survey = serializer.save()
        for image in self.request.FILES.getlist('images'):
            CleanlinessSurveyImage.objects.create(
                survey=cleanliness_survey,
                image=image
            )
