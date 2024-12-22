from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('survey', views.CleanlinessSurveyViewSet, basename='survey')

urlpatterns = [
    path('', include(router.urls)),
    path('survey/<int:bus_id>/get_survey_by_bus/', views.CleanlinessSurveyViewSet.as_view({'get': 'get_survey_by_bus'}), name='get_survey_by_bus'),
    path('survey/<int:bus_id>/resolve_all_survey_by_bus/', views.CleanlinessSurveyViewSet.as_view({'patch': 'resolve_all_survey_by_bus'}), name='resolve_all_survey_by_bus'),
]

