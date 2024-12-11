from spotless.models import Bus, BusModel, CleaningChecklistItem, CleaningSchedule, CleaningChecklistStep
from spotless.serializer import CleaningChecklistItemSerializer, CleaningScheduleSerializer, CleaningChecklistStepSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework import viewsets

class CleaningChecklistItemViewSet(viewsets.ModelViewSet):
    queryset = CleaningChecklistItem.objects.all()
    serializer_class = CleaningChecklistItemSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        bus_model_id = self.kwargs.get('bus_model_id')
        queryset = CleaningChecklistItem.objects.filter(bus_model_id=bus_model_id)
        serializer = CleaningChecklistItemSerializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        bus_model_id = self.kwargs.get('bus_model_id')
        try:
            bus_model = BusModel.objects.get(id=bus_model_id)
        except BusModel.DoesNotExist:
            raise NotFound(detail="Bus model not found.")
        serializer.save(bus_model=bus_model)
    
class CleaningScheduleViewSet(viewsets.ModelViewSet):
    queryset = CleaningSchedule.objects.all()
    serializer_class = CleaningScheduleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer: CleaningScheduleSerializer):
        cleaning_schedule: CleaningSchedule = serializer.save()
        bus = cleaning_schedule.bus
        bus_model = bus.bus_model
        cleaning_checklist_item = CleaningChecklistItem.objects.filter(bus_model=bus_model)
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
        queryset = CleaningChecklistStep.objects.filter(cleaning_schedule_id=cleaning_schedule_id)
        serializer = CleaningChecklistStepSerializer(queryset, many=True)
        return Response(serializer.data)

