from spotless.models import Bus
from .models import CleanlinessSurvey, CleanlinessSurveyImage
from rest_framework import serializers

class CleanlinessSurveyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CleanlinessSurveyImage
        fields = ['id', 'image', 'created_at']

class CleanlinessSurveySerializer(serializers.ModelSerializer):
    images = CleanlinessSurveyImageSerializer(many=True, read_only=True)
    bus_number_plate = serializers.CharField(max_length=20, required=False)

    class Meta:
        model = CleanlinessSurvey
        fields = ['id', 'rating', 'comment', 'email', 'created_at', 'updated_at', 'bus_number_plate', 'bus', 'images']
        read_only_fields = ['bus', 'created_at', 'updated_at']
        
    def validate_bus_number_plate(self, value):
        try:
            bus = Bus.objects.get(number_plate=value)
            return bus  # Return the actual Bus instance
        except Bus.DoesNotExist:
            raise serializers.ValidationError("Bus with this number plate does not exist.")
        
    
    def create(self, validated_data):
        bus = validated_data.pop('bus_number_plate', None)
        if bus:
            # The bus_number_plate has been validated and resolved to a Bus instance
            cleaning_schedule = CleanlinessSurvey.objects.create(bus=bus, **validated_data)
            return cleaning_schedule
        else:
            raise serializers.ValidationError("Bus number plate is required.")