from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Goal, Task
from django.utils import timezone

class LockInTests(TestCase):

    def setUp(self):
        """Set up a test user for the tests."""
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.user.save()

    def test_register_view(self):
        """Test if a user can register successfully."""
        response = self.client.post(reverse('register'), {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password1': 'password123',
            'password2': 'password123',
        })
        self.assertEqual(response.status_code, 302)  # Redirects after successful registration
        user = User.objects.get(username='newuser')
        self.assertIsNotNone(user)
        self.assertTrue(user.check_password('password123'))

    def test_login_view(self):
        """Test if a user can log in."""
        self.client.login(username='testuser', password='password123')
        response = self.client.get(reverse('program'))  # Assuming your dashboard is the 'program' view
        self.assertEqual(response.status_code, 200)

    def test_create_goal(self):
        """Test if a logged-in user can create a goal."""
        self.client.login(username='testuser', password='password123')
        response = self.client.post(reverse('create_goal'), {
            'name': 'Test Goal',
            'description': 'This is a test goal.',
            'due_date': timezone.now().date(),
        })
        self.assertEqual(response.status_code, 302)  # Redirect to the dashboard after goal creation
        goal = Goal.objects.get(name='Test Goal')
        self.assertEqual(goal.description, 'This is a test goal.')

    def test_create_task(self):
        """Test if a logged-in user can create a task under a goal."""
        self.client.login(username='testuser', password='password123')
        goal = Goal.objects.create(name='Test Goal', description='Test Goal Description', due_date=timezone.now().date(), user=self.user)
        response = self.client.post(reverse('create_task', kwargs={'goal_id': goal.id}), {
            'name': 'Test Task',
            'description': 'This is a test task.',
            'due_date': timezone.now().date(),
        })
        self.assertEqual(response.status_code, 302)  # Redirect to the dashboard after task creation
        task = Task.objects.get(name='Test Task')
        self.assertEqual(task.description, 'This is a test task.')

    def test_program(self):
        """Test if the dashboard (program view) shows goals and tasks for the logged-in user."""
        self.client.login(username='testuser', password='password123')
        goal = Goal.objects.create(name='Test Goal', description='Test Goal Description', due_date=timezone.now().date(), user=self.user)
        task = Task.objects.create(name='Test Task', description='Test Task Description', goal=goal, due_date=timezone.now().date())
        response = self.client.get(reverse('program'))  # Assuming your dashboard is the 'program' view
        self.assertContains(response, 'Test Goal')  # Check if the goal is displayed on the dashboard
        self.assertContains(response, 'Test Task')  # Check if the task is displayed on the dashboard

    def test_goal_permissions(self):
        """Test that an unauthenticated user cannot create a goal."""
        response = self.client.post(reverse('create_goal'), {
            'name': 'Test Goal',
            'description': 'Test Goal Description',
            'due_date': timezone.now().date(),
        })
        self.assertRedirects(response, '/accounts/login/')  # Redirect to login if not authenticated

    def test_task_permissions(self):
        """Test that an unauthenticated user cannot create a task."""
        goal = Goal.objects.create(name='Test Goal', description='Test Goal Description', due_date=timezone.now().date(), user=self.user)
        response = self.client.post(reverse('create_task', kwargs={'goal_id': goal.id}), {
            'name': 'Test Task',
            'description': 'Test Task Description',
            'due_date': timezone.now().date(),
        })
        self.assertRedirects(response, '/accounts/login/')  # Redirect to login if not authenticated
