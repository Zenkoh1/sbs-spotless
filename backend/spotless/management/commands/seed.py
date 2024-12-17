from django.core.management.base import BaseCommand
from spotless.models import CleaningChecklistItem, CleaningSchedule, CleaningChecklistStep, CleaningChecklistStepImages, CleaningChecklist
from spotless.models import Bus, BusModel
from spotless.models import User
from datetime import datetime
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

# python manage.py seed --mode=refresh

""" Clear all data and creates addresses """
MODE_REFRESH = 'refresh'

""" Clear all data and do not create any object """
MODE_CLEAR = 'clear'

class Command(BaseCommand):
    help = "seed database for testing and development."

    def add_arguments(self, parser):
        parser.add_argument('--mode', type=str, help="Mode")

    def handle(self, *args, **options):
        self.stdout.write('seeding data...')
        run_seed(self, options['mode'])
        self.stdout.write('done.')


def clear_data():
    """Deletes all the table data"""
    logger.info("Delete Address instances")
    CleaningChecklistItem.objects.all().delete()
    CleaningSchedule.objects.all().delete()
    CleaningChecklistStep.objects.all().delete()
    CleaningChecklistStepImages.objects.all().delete()
    CleaningChecklist.objects.all().delete()
    Bus.objects.all().delete()
    BusModel.objects.all().delete()
    User.objects.all().delete()

def create_data():
    """Creates data for the tables"""

    """Create Admin"""
    logger.info("Creating Admin")
    admin = User.objects.create_superuser(
        email="admin@example.com",
        password="securepassword",
        name="Admin User",
    )

    """Create Test User"""
    logger.info("Creating Test User")
    user = User.objects.create_user(
        email="testuser@gmail.com",
        password="Testuser",
        name="Test User",
    )

    """Create Bus Models"""
    logger.info("Creating Bus Models")
    bus_models = [
        BusModel(name="Volvo", description="Volvo Bus Model"),
        BusModel(name="Citaro", description="Citaro Bus Model"),
        BusModel(name="MAN", description="MAN Bus Model"),
        BusModel(name="Scania", description="Scania Bus Model"),
        BusModel(name="LINKKER", description="LINKKER Bus Model"),
        BusModel(name="Alexander Dennis", description="Alexander Dennis Bus Model"),
    ]
    for bus_model in bus_models:
        bus_model.save()

    """Create Buses"""
    logger.info("Creating Buses")
    buses = [
        Bus(bus_model=bus_models[0], number_plate="SBS1234A"),
        Bus(bus_model=bus_models[1], number_plate="SBS6504A"),
        Bus(bus_model=bus_models[2], number_plate="SBS6963B"),
        Bus(bus_model=bus_models[3], number_plate="SBS2356D"),
        Bus(bus_model=bus_models[4], number_plate="SBS9823E"),
        Bus(bus_model=bus_models[5], number_plate="SBS4529J"),
    ]
    for bus in buses:
        bus.save()

    """Create Cleaning Checklist"""
    logger.info("Creating Cleaning Checklist")
    cleaning_checklist = CleaningChecklist.objects.create(
        title="Bus Cleaning Checklist",
        description="This is the bus cleaning checklist"
    )

    """Create Cleaning Checklist Items"""
    logger.info("Creating Cleaning Checklist Items")
    cleaning_checklist_items = [
        CleaningChecklistItem(cleaning_checklist=cleaning_checklist, title="Check Bus Interior", description="Check the interior of the bus", order=1, is_image_required=True),
        CleaningChecklistItem(cleaning_checklist=cleaning_checklist, title="Check Bus Seat Frame", description="Check the seat frame of the bus", order=2, is_image_required=True),
        CleaningChecklistItem(cleaning_checklist=cleaning_checklist, title="Check Bus Engine", description="Check the engine of the bus", order=3, is_image_required=False),
        CleaningChecklistItem(cleaning_checklist=cleaning_checklist, title="Check Bus Wheels", description="Check the wheels of the bus", order=4, is_image_required=False),
        CleaningChecklistItem(cleaning_checklist=cleaning_checklist, title="Check Bus Seats", description="Check the seats of the bus", order=5, is_image_required=True),
        CleaningChecklistItem(cleaning_checklist=cleaning_checklist, title="Check Bus Windows", description="Check the windows of the bus", order=6, is_image_required=True),
    ]
    for cleaning_checklist_item in cleaning_checklist_items:
        cleaning_checklist_item.save()

    """Create Cleaning Schedule"""
    logger.info("Creating Cleaning Schedule")
    year = datetime.now().year
    month = datetime.now().month
    day = datetime.now().day
    cleaning_schedules = [
        CleaningSchedule(bus=buses[0], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0)),
        CleaningSchedule(bus=buses[1], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0)),
        CleaningSchedule(bus=buses[2], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0)),
        CleaningSchedule(bus=buses[3], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0)),
        CleaningSchedule(bus=buses[4], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0)),
        CleaningSchedule(bus=buses[5], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0)),

        CleaningSchedule(bus=buses[0], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=1)),
        CleaningSchedule(bus=buses[1], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=1)),
        CleaningSchedule(bus=buses[2], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=1)),
        CleaningSchedule(bus=buses[3], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=1)),
        CleaningSchedule(bus=buses[4], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=1)),
        CleaningSchedule(bus=buses[5], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=1)),

        CleaningSchedule(bus=buses[0], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=2)),
        CleaningSchedule(bus=buses[1], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=2)),
        CleaningSchedule(bus=buses[2], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=2)),
        CleaningSchedule(bus=buses[3], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=2)),
        CleaningSchedule(bus=buses[4], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=2)),
        CleaningSchedule(bus=buses[5], cleaning_checklist=cleaning_checklist, datetime=datetime(year, month, day, 8, 0) + timedelta(days=2)),
    ]
    for cleaning_schedule in cleaning_schedules:
        cleaning_schedule.save()
        cleaning_schedule.cleaners.add(user)

    """Create Cleaning Checklist Steps"""
    logger.info("Creating Cleaning Checklist Steps")
    cleaning_checklist_steps = [
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[0], cleaning_checklist_item=cleaning_checklist_items[0], status=CleaningChecklistStep.StatusType.INCOMPLETE),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[0], cleaning_checklist_item=cleaning_checklist_items[1], status=CleaningChecklistStep.StatusType.IN_PROGRESS),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[0], cleaning_checklist_item=cleaning_checklist_items[2], status=CleaningChecklistStep.StatusType.INCOMPLETE),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[0], cleaning_checklist_item=cleaning_checklist_items[3], status=CleaningChecklistStep.StatusType.IN_PROGRESS),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[0], cleaning_checklist_item=cleaning_checklist_items[4], status=CleaningChecklistStep.StatusType.INCOMPLETE),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[0], cleaning_checklist_item=cleaning_checklist_items[5], status=CleaningChecklistStep.StatusType.IN_PROGRESS),

        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[1], cleaning_checklist_item=cleaning_checklist_items[0], status=CleaningChecklistStep.StatusType.IN_PROGRESS),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[1], cleaning_checklist_item=cleaning_checklist_items[1], status=CleaningChecklistStep.StatusType.INCOMPLETE),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[1], cleaning_checklist_item=cleaning_checklist_items[2], status=CleaningChecklistStep.StatusType.IN_PROGRESS),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[1], cleaning_checklist_item=cleaning_checklist_items[3], status=CleaningChecklistStep.StatusType.INCOMPLETE),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[1], cleaning_checklist_item=cleaning_checklist_items[4], status=CleaningChecklistStep.StatusType.IN_PROGRESS),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[1], cleaning_checklist_item=cleaning_checklist_items[5], status=CleaningChecklistStep.StatusType.INCOMPLETE),

        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[2], cleaning_checklist_item=cleaning_checklist_items[0], status=CleaningChecklistStep.StatusType.INCOMPLETE),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[2], cleaning_checklist_item=cleaning_checklist_items[1], status=CleaningChecklistStep.StatusType.IN_PROGRESS),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[2], cleaning_checklist_item=cleaning_checklist_items[2], status=CleaningChecklistStep.StatusType.INCOMPLETE),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[2], cleaning_checklist_item=cleaning_checklist_items[3], status=CleaningChecklistStep.StatusType.IN_PROGRESS),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[2], cleaning_checklist_item=cleaning_checklist_items[4], status=CleaningChecklistStep.StatusType.INCOMPLETE),
        CleaningChecklistStep(cleaning_schedule=cleaning_schedules[2], cleaning_checklist_item=cleaning_checklist_items[5], status=CleaningChecklistStep.StatusType.IN_PROGRESS),
    ]
    for cleaning_checklist_step in cleaning_checklist_steps:
        cleaning_checklist_step.save()

def run_seed(self, mode):
    """ Seed database based on mode

    :param mode: refresh / clear 
    :return:
    """
    # Clear data from tables
    clear_data()
    if mode == MODE_CLEAR:
        return

    create_data()
