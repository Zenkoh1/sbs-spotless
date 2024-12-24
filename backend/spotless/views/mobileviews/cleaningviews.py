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
from rest_framework import status

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
    
    def retrieve(self, request, pk=None):
        queryset = CleaningSchedule.objects.filter(cleaners=request.user)
        schedule = queryset.get(id=pk)
        serializer = CleaningScheduleSerializer(schedule)
        bus = Bus.objects.get(id=serializer.data['bus'])
        bus_serializer = BusSerializer(bus)
        schedule_data = serializer.data
        schedule_data['bus'] = bus_serializer.data
        return Response(schedule_data)
    

'''
Can only get or update (ie. change the status) the cleaning checklist steps
You should not be able to create or delete a cleaning checklist step
As it is directly tied to the cleaning schedule and the cleaning checklist item
'''
class CleaningChecklistStepViewSet(viewsets.ModelViewSet):
    queryset = CleaningChecklistStep.objects.all()
    serializer_class = CleaningChecklistStepSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch', 'delete']

    def list(self, request, *args, **kwargs):
        cleaning_schedule_id = self.kwargs.get('cleaning_schedule_id')
        if CleaningSchedule.objects.filter(id=cleaning_schedule_id).count() == 0:
            raise NotFound(detail="Cleaning Schedule not found.")
        queryset = CleaningChecklistStep.objects.filter(cleaning_schedule_id=cleaning_schedule_id)
        queryset = queryset.order_by('cleaning_checklist_item__order')
        serializer = CleaningChecklistStepSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def upload_image(self, request, pk=None):
        # Retrieve the instance
        step = self.get_object()
        # Extract single image from the request
        image = request.FILES.get('image')
        # Add new image to the step
        pil_image = PIL.Image.open(image)
        response = model.generate_content([
            """This is an image of a part of a public transport bus, can you give me a cleanliness percentage (1 - 100),
            1 being the dirtiest thing you have ever seen and 100 being the cleanest thing you have ever seen,
            based on how clean this image is, based on things like, but not limited to,
            dust, seat cushion tearing, dirty floor, litter etc.. You can only, and must provide the number and nothing else (1-100).""", pil_image])
        try:
            cleanliness_level = int(response.candidates[0].content.parts[0].text)
        except ValueError:
            cleanliness_level = 50

        new_image = CleaningChecklistStepImages.objects.create(
            cleaning_checklist_step=step, 
            cleanliness_level=cleanliness_level,
            image=image
        )

        return Response({"cleanliness_level": cleanliness_level, "image_id": new_image.pk}, status=200)
    
    @action(detail=True, methods=['delete'])
    def delete_image(self, request, pk=None):
        step = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response({"error": "Image ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            image_instance = CleaningChecklistStepImages.objects.get(id=image_id, cleaning_checklist_step=step)
            image_instance.delete()
            return Response({"message": "Image deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except CleaningChecklistStepImages.DoesNotExist:
            return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)