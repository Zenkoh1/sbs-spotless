from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from . import views

mobile_urlpatterns = [
    path('register', views.mobileviews.RegisterView.as_view(), name="register"),
    path('login', views.mobileviews.LoginView.as_view(), name="login"),
    path('logout', views.mobileviews.LogoutView.as_view(), name = "logout"),
    path('loginwithtoken', views.mobileviews.LoginwithTokenView.as_view(), name = 'loginwithtoken'),
]

staff_urlpatterns = [
    path('register', views.staffviews.RegisterView.as_view(), name="register"),
    path('login', views.staffviews.LoginView.as_view(), name="login"),
    path('logout', views.staffviews.LogoutView.as_view(), name = "logout"),
    path('loginwithtoken', views.staffviews.LoginwithTokenView.as_view(), name = 'loginwithtoken'),
]

urlpatterns = [
    path('token/', jwt_views.TokenObtainPairView.as_view(), name ="token_obtain_pair"),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path('mobile/', include(mobile_urlpatterns)),
    path('staff/', include(staff_urlpatterns)),
]

