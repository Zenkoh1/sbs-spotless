from rest_framework import serializers
from .models import User, BusModel, Bus, CleaningChecklistItem, CleaningSchedule, CleaningChecklistStep

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')
        
    def create(self, validated_data):
        password = validated_data.pop("password")
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class BusModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusModel
        fields = '__all__'
    
    def create(self, validated_data):
        return BusModel.objects.create(**validated_data)

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'
    
    def create(self, validated_data):
        return Bus.objects.create(**validated_data)
    
class CleaningChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CleaningChecklistItem
        fields = '__all__'
        read_only_fields = ['bus_model']
    
    def create(self, validated_data):
        return CleaningChecklistItem.objects.create(**validated_data)

class CleaningScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CleaningSchedule
        fields = '__all__'
    
    def create(self, validated_data):
        return CleaningSchedule.objects.create(**validated_data)
    
    '''
    This function automatically updates the status if the cleaner is assigned AND the status was unassigned
    '''
    def save(self, **kwargs):
        final_status = None
        if 'status' in self.validated_data:
            final_status = self.validated_data['status']
        elif self.instance:
            final_status = self.instance.status
        else:
            final_status = CleaningSchedule.StatusType.UNASSIGNED

        if 'cleaner' in self.validated_data:
            if final_status == CleaningSchedule.StatusType.UNASSIGNED:
                self.validated_data['status'] = CleaningSchedule.StatusType.ASSIGNED
        return super().save(**kwargs)

class CleaningChecklistStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = CleaningChecklistStep
        fields = '__all__'
        read_only_fields = ['cleaning_schedule', 'cleaning_checklist_item']
    
    def create(self, validated_data):
        return CleaningChecklistStep.objects.create(**validated_data)
        