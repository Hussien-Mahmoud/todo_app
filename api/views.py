from django.shortcuts import render
from django.http import JsonResponse

from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework import status

from .serializers import TaskSerializer
from base.models import Task


# Create your views here.

@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'List': '/task-list/',
        'Detail View': '/task-detail/<str:pk>/',
        'Create': '/task-create/',
        'Update': '/task-update/<str:pk>/',
        'Delete': '/task-delete/<str:pk>/',
    }

    return Response(api_urls)


class TaskList(ListAPIView):
    serializer_class = TaskSerializer

    def list(self, request, *args, **kwargs):
        self.queryset = Task.objects.all().filter(user=request.user).order_by('-creation_time')
        return super().list(request, *args, **kwargs)


class TaskDetail(RetrieveAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    lookup_field = 'pk'


class TaskCreate(CreateAPIView):
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskUpdate(UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = 'pk'


class TaskDelete(DestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = 'pk'
