from django.shortcuts import render

def homepage(request):
    print("Rendering homepage")
    return render(request, 'index.html', {})
