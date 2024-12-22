from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import CleanlinessSurvey, CleanlinessSurveyImage
from .serializer import CleanlinessSurveySerializer
from rest_framework.decorators import action

# Create your views here.
class CleanlinessSurveyViewSet(viewsets.ModelViewSet):
    queryset = CleanlinessSurvey.objects.all()
    serializer_class = CleanlinessSurveySerializer
    permission_classes = []
    authentication_classes = []
    http_method_names = ['get', 'post', 'patch']
    
    def perform_create(self, serializer):
        cleanliness_survey = serializer.save()
        for image in self.request.FILES.getlist('images'):
            CleanlinessSurveyImage.objects.create(
                survey=cleanliness_survey,
                image=image
            )

    # only non resolved surveys
    @action(detail=False, methods=['get'])
    def get_survey_by_bus(self, request, *args, **kwargs):
        bus_id = self.kwargs.get('bus_id')
        if bus_id is None:
            return Response("Bus ID is required", status=status.HTTP_400_BAD_REQUEST)
        surveys = CleanlinessSurvey.objects.filter(bus_id=bus_id, is_resolved=False)

        serializer = CleanlinessSurveySerializer(surveys, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'])
    def resolve_all_survey_by_bus(self, request, *args, **kwargs):
        bus_id = self.kwargs.get('bus_id')
        if bus_id is None:
            return Response("Bus ID is required", status=status.HTTP_400_BAD_REQUEST)
        surveys = CleanlinessSurvey.objects.filter(bus_id=bus_id)
        for survey in surveys:
            survey.is_resolved = True
            survey.save()
        return Response("All surveys resolved", status=status.HTTP_200_OK)

