from spotless.models import CleaningChecklist, BusModel, CleaningChecklistItem, CleaningSchedule, CleaningChecklistStep, CleaningChecklistStepImages
from spotless.serializer import CleaningChecklistSerializer, CleaningChecklistItemSerializer, CleaningScheduleSerializer, CleaningChecklistStepSerializer, CleaningScheduleMassCreateSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework import viewsets, status
from rest_framework.decorators import action
import datetime

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

    @action(detail=False, methods=['post'])
    def mass_create(self, request, pk=None):
        serializer = CleaningScheduleMassCreateSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            
            buses = data.pop('buses')
            start_date: datetime.date = data.pop('start_date') 
            end_date: datetime.date = data.pop('end_date')
            time = data.pop('time') # cleaning start time
            interval = data.pop('interval')
            days_of_week = data.pop('days_of_week', [])
            days_of_month = data.pop('days_of_month', [])
            schedules_count = 0 # count of schedules created

            if interval == 'weekly':
                current_date = start_date
                while current_date <= end_date:
                    if current_date.strftime("%A").lower() in days_of_week:
                        for bus in buses:
                            request.data["datetime"] = datetime.datetime.combine(current_date, time)
                            request.data["bus"] = bus.pk
                            individual_serializer = CleaningScheduleSerializer(data=request.data)
                            if individual_serializer.is_valid():
                                self.perform_create(individual_serializer)
                                schedules_count += 1
                    current_date += datetime.timedelta(days=1)

            elif interval == 'monthly':
                current_date = start_date
                while current_date <= end_date:
                    if current_date.day in days_of_month:
                        for bus in buses:
                            request.data["datetime"] = datetime.datetime.combine(current_date, time)
                            request.data["bus"] = bus.pk
                            individual_serializer = CleaningScheduleSerializer(data=request.data)
                            if individual_serializer.is_valid():
                                self.perform_create(individual_serializer)
                                schedules_count += 1
                    current_date += datetime.timedelta(days=1)

            return Response(
                {"message": f"{schedules_count} schedules created successfully!"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        
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

