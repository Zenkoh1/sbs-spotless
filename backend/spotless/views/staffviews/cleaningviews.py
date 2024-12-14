from spotless.models import CleaningChecklist, BusModel, CleaningChecklistItem, CleaningSchedule, CleaningChecklistStep, CleaningChecklistStepImages
from spotless.serializer import CleaningChecklistSerializer, CleaningChecklistItemSerializer, CleaningScheduleSerializer, CleaningChecklistStepSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework import viewsets
from rest_framework.decorators import action

class CleaningChecklistViewSet(viewsets.ModelViewSet):
    queryset = CleaningChecklist.objects.all()
    serializer_class = CleaningChecklistSerializer
    permission_classes = [IsAuthenticated]

class CleaningChecklistItemViewSet(viewsets.ModelViewSet):
    queryset = CleaningChecklistItem.objects.all()
    serializer_class = CleaningChecklistItemSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        cleaning_checklist_id = self.kwargs.get('cleaning_checklist_id')
        if CleaningChecklist.objects.filter(id=cleaning_checklist_id).count() == 0:
            raise NotFound(detail="Cleaning Checklist not found.")
        queryset = CleaningChecklistItem.objects.filter(cleaning_checklist_id=cleaning_checklist_id)
        queryset = queryset.order_by('order')
        serializer = CleaningChecklistItemSerializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        cleaning_checklist_id = self.kwargs.get('cleaning_checklist_id')
        try:
            cleaning_checklist = CleaningChecklist.objects.get(id=cleaning_checklist_id)
        except CleaningChecklist.DoesNotExist:
            raise NotFound(detail="Cleaning Checklist not found.")
        serializer.save(cleaning_checklist=cleaning_checklist)
    
class CleaningScheduleViewSet(viewsets.ModelViewSet):
    queryset = CleaningSchedule.objects.all()
    serializer_class = CleaningScheduleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer: CleaningScheduleSerializer):
        cleaning_schedule: CleaningSchedule = serializer.save()
        cleaning_checklist = cleaning_schedule.cleaning_checklist
        cleaning_checklist_item = CleaningChecklistItem.objects.filter(cleaning_checklist=cleaning_checklist)
        for item in cleaning_checklist_item:
            cleaning_checklist_step = CleaningChecklistStep.objects.create(
                cleaning_schedule_id=cleaning_schedule.pk,
                cleaning_checklist_item=item
            )
            cleaning_checklist_step.save()


        
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
            CleaningChecklistStepImages.objects.create(
                cleaning_checklist_step=step, 
                image=image
            )
        return Response({"detail": "Images uploaded successfully."})

