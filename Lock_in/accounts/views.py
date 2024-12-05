from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.shortcuts import redirect, render
from django import forms
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Goal, Task, StudySession
from .forms import GoalForm, TaskForm, StudySessionForm

def homepage(request):
    return render(request, 'index.html')
# RegisterForm (already correct)
class RegisterForm(forms.ModelForm):
    password1 = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password1")
        password2 = cleaned_data.get("password2")

        if password1 != password2:
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data

# Register View
def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password1'])
            user.save()
            login(request, user)  # Automatically log the user in after registration
            messages.success(request, "Registration successful!")
            return redirect('accounts/program.html')  # Assuming you have a dashboard or home page
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})

# Login View
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)

            return redirect('program')
        else:
            messages.error(request, "Invalid username or password.")
    return render(request, 'login.html')

# Logout view - handles user logout
def logout_view(request):
    logout(request)
    messages.info(request, "You have successfully logged out.")  # Logout confirmation message
    return redirect('login')  # Redirect to login page after logging out

# Dashboard (Program page) view
def dashboard(request):
    # Add logic here if you want to pass context (e.g., goals, tasks)
    return render(request, 'program.html')

# Goal creation view
def create_goal(request):
    if request.method == 'POST':
        form = GoalForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('program')  # Redirect to the program page (your dashboard)
    else:
        form = GoalForm()
    return render(request, 'create_goal.html', {'form': form})

# Task creation view
def create_task(request, goal_id):
    goal = Goal.objects.get(id=goal_id)
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.goal = goal
            task.save()
            return redirect('program')  # Redirect to the program page (your dashboard)
    else:
        form = TaskForm()
    return render(request, 'create_task.html', {'form': form, 'goal': goal})

def about_view(request):
    """
    Renders the About Us page.
    """
    return render(request, 'about.html')
def contact_view(request):
    """
    Renders the Contact Us page.
    """
    return render(request, 'contact.html')
