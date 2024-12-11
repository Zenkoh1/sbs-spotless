# Views for Bus related operations
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from spotless.models import BusModel, Bus
from spotless.serializer import BusModelSerializer, BusSerializer

class BusModelViewSet(viewsets.ModelViewSet):
    queryset = BusModel.objects.all()
    serializer_class = BusModelSerializer
    permission_classes = [IsAuthenticated]

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer
    permission_classes = [IsAuthenticated]