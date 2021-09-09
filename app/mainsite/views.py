from django.shortcuts import render

def main_site(request):
    return render(request, "mainsite.html")