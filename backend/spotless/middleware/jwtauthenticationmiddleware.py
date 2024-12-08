from rest_framework_simplejwt import authentication


class JwtAuthenticationMiddleware():
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if auth := authentication.JWTAuthentication().authenticate(request):
            request.user = auth[0]
        response = self.get_response(request)
        return response
