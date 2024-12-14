from django.urls import path, include
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views
from rest_framework.routers import DefaultRouter
from . import views

mobile_router = DefaultRouter()
mobile_router.register('cleaning_schedules', views.mobileviews.CleaningScheduleViewSet, basename='cleaning_schedules')

mobile_urlpatterns = [
    path('register', views.mobileviews.RegisterView.as_view(), name="register"),
    path('login', views.mobileviews.LoginView.as_view(), name="login"),
    path('logout', views.mobileviews.LogoutView.as_view(), name = "logout"),
    path('loginwithtoken', views.mobileviews.LoginwithTokenView.as_view(), name = 'loginwithtoken'),
    path('', include(mobile_router.urls)),
    path('cleaning_schedules/<int:cleaning_schedule_id>/checklist_steps/', views.mobileviews.CleaningChecklistStepViewSet.as_view({'get': 'list'}), name='checklist-steps'),
    path('checklist_steps/<int:pk>/', views.mobileviews.CleaningChecklistStepViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'}), name='checklist-steps-detail'),
    path(
        'checklist_steps/<int:pk>/upload_images/',
        views.mobileviews.CleaningChecklistStepViewSet.as_view({'patch': 'upload_images'}),
        name='checklist-steps-upload-images',
    ),
]

staff_router = DefaultRouter()
staff_router.register('bus_models', views.staffviews.BusModelViewSet, basename='bus_models')
staff_router.register('buses', views.staffviews.BusViewSet, basename='buses')
staff_router.register('cleaning_schedules', views.staffviews.CleaningScheduleViewSet, basename='cleaning_schedules')
staff_router.register('cleaning_checklists', views.staffviews.CleaningChecklistViewSet, basename='cleaning_checklists')

staff_urlpatterns = [
    path('register', views.staffviews.RegisterView.as_view(), name="register"),
    path('login', views.staffviews.LoginView.as_view(), name="login"),
    path('logout', views.staffviews.LogoutView.as_view(), name = "logout"),
    path('loginwithtoken', views.staffviews.LoginwithTokenView.as_view(), name = 'loginwithtoken'),
    path('', include(staff_router.urls)),
    path('cleaning_checklists/<int:cleaning_checklist_id>/checklist_items/', views.staffviews.CleaningChecklistItemViewSet.as_view({'get': 'list', 'post': 'create'}), name='checklist-items'),
    path('checklist_items/<int:pk>/', views.staffviews.CleaningChecklistItemViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy', 'patch': 'partial_update'}), name='checklist-items-detail'),
    path('cleaning_schedules/<int:cleaning_schedule_id>/checklist_steps/', views.staffviews.CleaningChecklistStepViewSet.as_view({'get': 'list'}), name='checklist-steps'),
    path('checklist_steps/<int:pk>/', views.staffviews.CleaningChecklistStepViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'}), name='checklist-steps-detail'),
]

urlpatterns = [
    path('token/', jwt_views.TokenObtainPairView.as_view(), name ="token_obtain_pair"),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path('mobile/', include(mobile_urlpatterns)),
    path('staff/', include(staff_urlpatterns)),
]

