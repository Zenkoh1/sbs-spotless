from django.http import HttpResponseForbidden


class StaffCheckMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Allow the user to logout without checking if they are staff
        if request.path.startswith('/api/staff/logout'):
            return self.get_response(request)
        
        if not request.path.startswith('/api/staff/'):
            return self.get_response(request)
        if not request.user.is_authenticated:
            return self.get_response(request)
        if request.user.is_staff:
            return self.get_response(request)
        
        return HttpResponseForbidden()

