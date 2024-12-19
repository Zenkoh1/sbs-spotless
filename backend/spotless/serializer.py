from rest_framework import serializers
from .models import User, BusModel, Bus, CleaningChecklist, CleaningChecklistItem, CleaningSchedule, CleaningChecklistStep, CleaningChecklistStepImages

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
    
class CleaningChecklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = CleaningChecklist
        fields = '__all__'
    
    def create(self, validated_data):
        return CleaningChecklist.objects.create(**validated_data)
    
class CleaningChecklistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CleaningChecklistItem
        fields = '__all__'
        read_only_fields = ['bus_model']
    
    def create(self, validated_data):
        return CleaningChecklistItem.objects.create(**validated_data)

class CleaningScheduleSerializer(serializers.ModelSerializer):
    cleaners = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())
    class Meta:
        model = CleaningSchedule
        fields = '__all__'
    
    def create(self, validated_data):
        cleaners = validated_data.pop('cleaners', [])
        cleaning_schedule = CleaningSchedule.objects.create(**validated_data)
        cleaning_schedule.cleaners.set(cleaners)
        return cleaning_schedule
    
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

        if 'cleaners' in self.validated_data and self.validated_data['cleaners']:
            if final_status == CleaningSchedule.StatusType.UNASSIGNED:
                self.validated_data['status'] = CleaningSchedule.StatusType.ASSIGNED
        return super().save(**kwargs)

class CleaningScheduleMassCreateSerializer(serializers.Serializer):
    buses = serializers.PrimaryKeyRelatedField(many=True, queryset=Bus.objects.all())
    time = serializers.TimeField()
    cleaners = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())
    cleaning_checklist = serializers.PrimaryKeyRelatedField(queryset=CleaningChecklist.objects.all())
    start_date = serializers.DateField()
    end_date = serializers.DateField()
    interval = serializers.ChoiceField(choices=['weekly', 'monthly'])
    days_of_week = serializers.ListField(
        child=serializers.ChoiceField(choices=[
            "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
        ]),
        required=False
    )
    days_of_month = serializers.ListField(
        child=serializers.IntegerField(min_value=1, max_value=31),
        required=False
    )

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date must be before end date.")
        if data['interval'] == 'weekly' and not data.get('days_of_week'):
            raise serializers.ValidationError("For weekly intervals, days_of_week is required.")
        if data['interval'] == 'monthly' and not data.get('days_of_month'):
            raise serializers.ValidationError("For monthly intervals, days_of_month is required.")
        return data

class CleaningChecklistStepImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CleaningChecklistStepImages
        fields = ['id', 'image', 'created_at']

class CleaningChecklistStepSerializer(serializers.ModelSerializer):
    cleaning_checklist_item = CleaningChecklistItemSerializer()
    images = CleaningChecklistStepImageSerializer(many=True, read_only=True)

    class Meta:
        model = CleaningChecklistStep
        fields = '__all__'
        read_only_fields = ['cleaning_schedule', 'cleaning_checklist_item']
    
    def create(self, validated_data):
        return CleaningChecklistStep.objects.create(**validated_data)
