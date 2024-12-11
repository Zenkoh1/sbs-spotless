from spotless.models import Bus, BusModel, CleaningChecklistItem, CleaningSchedule, CleaningChecklistStep
from spotless.serializer import CleaningChecklistItemSerializer, CleaningScheduleSerializer, CleaningChecklistStepSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework import viewsets

'''
You should be able to operate on schedules that are assigned to you
In the mobile app, you should only be able to get and update the cleaning schedule
'''
class CleaningScheduleViewSet(viewsets.ModelViewSet):
    queryset = CleaningSchedule.objects.all()
    serializer_class = CleaningScheduleSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']

    def get_queryset(self):
        return super().get_queryset().filter(cleaner=self.request.user)