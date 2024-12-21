from spotless.models import Bus, BusModel, CleaningChecklistStepImages, CleaningChecklistItem, CleaningSchedule, CleaningChecklistStep
from spotless.serializer import CleaningChecklistItemSerializer, CleaningScheduleSerializer, CleaningChecklistStepSerializer, BusSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework import viewsets
from rest_framework.decorators import action
import google.generativeai as genai
import os
import PIL.Image

genai.configure(api_key=os.environ.get('GOOGLE_API_KEY'))

model = genai.GenerativeModel('gemini-1.5-flash-latest')

'''
You should be able to operate on schedules that are assigned to you
In the mobile app, you should only be able to get and update the cleaning schedule
'''
class CleaningScheduleViewSet(viewsets.ModelViewSet):
    queryset = CleaningSchedule.objects.all()
    serializer_class = CleaningScheduleSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']

    def list(self, request, *args, **kwargs):
        queryset = CleaningSchedule.objects.filter(cleaners=request.user)
        
        serializer = CleaningScheduleSerializer(queryset, many=True)
        # change bus in serializer from key to bus object
        for schedule in serializer.data:
            bus = Bus.objects.get(id=schedule['bus'])
            bus_serializer = BusSerializer(bus)
            schedule['bus'] = bus_serializer.data
        return Response(serializer.data)
    

'''
Can only get or update (ie. change the status) the cleaning checklist steps
You should not be able to create or delete a cleaning checklist step
As it is directly tied to the cleaning schedule and the cleaning checklist item
'''
class CleaningChecklistStepViewSet(viewsets.ModelViewSet):
    queryset = CleaningChecklistStep.objects.all()
    serializer_class = CleaningChecklistStepSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']

    def list(self, request, *args, **kwargs):
        cleaning_schedule_id = self.kwargs.get('cleaning_schedule_id')
        if CleaningSchedule.objects.filter(id=cleaning_schedule_id).count() == 0:
            raise NotFound(detail="Cleaning Schedule not found.")
        queryset = CleaningChecklistStep.objects.filter(cleaning_schedule_id=cleaning_schedule_id)
        queryset = queryset.order_by('cleaning_checklist_item__order')
        serializer = CleaningChecklistStepSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def upload_images(self, request, pk=None):
        # Retrieve the instance
        step = self.get_object()
        # Extract images from the request
        images = request.FILES.getlist('images')
        # Remove existing images
        step.images.all().delete()
        # Add new images
        for image in images:
            pil_image = PIL.Image.open(image)
            response = model.generate_content([
                """This is an image of a part of a public transport bus, can you give me a cleanliness percentage (1 - 100),
                based on how clean this image is, based on things like, but not limited to,
                dust, seat cushion tearing, dirty floor, litter etc.. You can only, and must provide the number and nothing else (1-100).""", pil_image])
            try:
                cleanliness_level = int(response.candidates[0].content.parts[0].text)
            except ValueError:
                cleanliness_level = 50

            CleaningChecklistStepImages.objects.create(
                cleaning_checklist_step=step, 
                cleanliness_level=cleanliness_level,
                image=image
            )
        cleanliness_levels = [image.cleanliness_level for image in step.images.all()]
        return Response({"cleanliness_levels": cleanliness_levels}, status=200)