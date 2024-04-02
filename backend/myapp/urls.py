from .views import *
from django.urls import path

urlpatterns = [
    path('register',RegisterView.as_view()),
    path('login',LoginView.as_view()),
    path('admin-login',AdminLoginView.as_view()),
    path('admin-dashboard',AdminDashboardView.as_view()),
    path('update-user/<int:pk>',UpdateUserView.as_view()),
    path('add-user',AddUserView.as_view()),
    path('delete-user/<int:pk>', DeleteUserView.as_view()),
    path('search-user', SearchUserView.as_view()),
    # path('logout', LogoutView.as_view())
    path('profile-picture', ProfilePictureUploadView.as_view())
    
]

