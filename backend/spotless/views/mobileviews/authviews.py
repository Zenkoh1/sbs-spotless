from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from ...serializer import UserSerializer
from ...models import User
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from rest_framework import status
from django.forms.models import model_to_dict

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data = request.data)
        
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    permission_classes = ()
    authentication_classes = ()
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]
        
        try:
            user = User.objects.get(email = email)
        except User.DoesNotExist:
            return Response("Account does not exist, try a different account", status=status.HTTP_404_NOT_FOUND)
        if user is None:
            return Response("User does not exist, try a different account", status=status.HTTP_404_NOT_FOUND)
        if not user.check_password(password):
            return Response("Incorrect Password, try a different password", status=status.HTTP_400_BAD_REQUEST)
        access_token = AccessToken.for_user(user)
        refresh_token =RefreshToken.for_user(user)
        return Response({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "access_token" : str(access_token),
            "refresh_token" : str(refresh_token)
        }, status=status.HTTP_200_OK)
    
class LoginwithTokenView(APIView):
    permission_classes = ()
    authentication_classes = ()
    def post(self, request):
        try:
            access_token = request.data['access_token']
            if access_token:
                token = AccessToken(access_token)
                user = User.objects.get(id = token['user_id'])
                return Response({
                    "id": user.id,
                    "name": user.name,
                    "email": user.email
                }, status = status.HTTP_200_OK)
        except TokenError:
            return Response("Please log in again", status=status.HTTP_401_UNAUTHORIZED)
        
class LogoutView(APIView):
    
    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response("Logout Successful", status=status.HTTP_200_OK)
        except TokenError:
            raise AuthenticationFailed("Invalid Token")
