from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken
from rest_framework.permissions import IsAuthenticated,BasePermission
from django.contrib.auth import authenticate,login,logout
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken



# Create your views here.

class IsSuperUser(IsAuthenticated):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser
    
# class IsNotAuthenticated(BasePermission):
#     def has_permission(self, request, view):
#         return not request.user or not request.user.is_authenticated


class RegisterView(APIView):
    def post(self,request):
        serializer=UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class LoginView(APIView):
    def post(self,request):
        email=request.data['email']
        password=request.data['password']

        if not email or not password:
            raise AuthenticationFailed("Email and password are required")


        user=authenticate(email=email,password=password)
        

        if user is None:
            raise AuthenticationFailed("user not found")
        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect password")  
        login(request, user)

        refresh = RefreshToken.for_user(user)
        user_serializer = UserSerializer(user)

        return Response( {
            'user': user_serializer.data, 
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
        


class AdminLoginView(APIView):
    # permission_classes = [IsNotAuthenticated]

    def post(self, request):
        email = request.data['email']
        password = request.data['password']
        user = authenticate(email=email, password=password)

        if user is None or not user.is_superuser:
            return Response({'error': 'Invalid credentials'}, status=400)
        login(request, user)
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    


class AdminDashboardView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        if not request.user.is_superuser:
            return Response({'error': 'Unauthorized'}, status=403)
        try:
            access_token_string = request.headers["Authorization"].split()[1]
            access_token = AccessToken(access_token_string)
            refresh_token = access_token.payload.get('refresh')
            
            # Check if the refresh token is blacklisted
            if OutstandingToken.objects.filter(token=refresh_token).exists():
                raise AuthenticationFailed("Refresh token is blacklisted")
        except KeyError:
            raise AuthenticationFailed("Access token is missing")  
          
        
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)    
    

class AddUserView(APIView):
    permission_classes = [IsSuperUser]

    def post(self, request):
        if not request.user.is_superuser:
            return Response({'error': 'Unauthorized'}, status=403)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    
class UpdateUserView(APIView):
    permission_classes = [IsSuperUser]

    def put(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class DeleteUserView(APIView):
    permission_classes = [IsSuperUser]
    
    def delete(self, request, pk):
        if not request.user.is_superuser:
            return Response({'error': 'Unauthorized'}, status=403)
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response({'success': 'User deleted successfully'}, status=200)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
class SearchUserView(APIView):
    permission_classes = [IsSuperUser]
    def get(self, request):
        name = request.query_params.get('name', None)
        if not name:
            return Response({'error': 'Name parameter is required'}, status=400)

        users = User.objects.filter(name__icontains=name)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)        


# class LogoutView(APIView):
#     permission_classes = [IsSuperUser]

#     def post(self, request):
#         logout(request)
#         try:
#             access_token_string = request.headers["Authorization"].split()[1]
#             access_token = AccessToken(access_token_string)
          
            
#             # Extract the associated refresh token and blacklist it
        
#             refresh_token   = access_token.payload.get('refresh')
#             refresh_token_object = RefreshToken(refresh_token)
           
#             print(refresh_token_object)
#             refresh_token_object.blacklist()
#             return Response({"message": "Logout successful"}, status=200)
#         except Exception as e:
#             return Response({"error": "Refresh token is required"}, status=400)


class ProfilePictureUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if 'profile_picture' not in request.FILES:
            return Response({'error': 'No profile picture provided'}, status=400)
        
        profile_picture = request.FILES['profile_picture']
        user.profile_picture = profile_picture
        user.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)