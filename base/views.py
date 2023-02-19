from django.views.generic.list import ListView
from .models import Task

from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.


class TaskList(LoginRequiredMixin, ListView):
    model = Task
    # template is sat automatically
    # to '<app name>/<class name:different format>.html'
    # so it's to 'base/task_list.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # search_input = self.request.GET.get('search-area', '')
        # context['search_input'] = self.request.GET.get('search-area', '')
        # if search_input:
        #     context['task_list'] = context['task_list'].filter(title__icontains=search_input)

        return context
