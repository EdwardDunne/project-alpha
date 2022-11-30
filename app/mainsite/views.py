from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib import auth
from .utils import get_hash_for_marvel_api
from django.contrib.auth.models import User
from mainsite.models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer
from bs4 import BeautifulSoup
import time
import requests
import json
import random

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})

class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        try:
            isAuthenticated = request.user.is_authenticated

            if isAuthenticated:
                return Response({'isAuthenticated': 'success'})
            else:
                return Response({'isAuthenticated': 'error'})
        except:
            return Response({'error':'Something went wrong with checking authentication'})

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']

        try:
            user = auth.authenticate(username=username, password=password)

            if user is not None:
                auth.login(request, user)
                return Response({ 'success': 'User Authenticated' })
            else:
                return Response({ 'error': 'Error Authentiocating' })
        except:
            return Response({ 'error': 'Something went wrong when logging in' })


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'success': 'Logged Out' })
        except:
            return Response({ 'error': 'Something went wrong when logging out' })

@method_decorator(csrf_protect, name='dispatch')
class SignupView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']
        re_password = data['re_password']

        try:
            if password == re_password:
                if User.objects.filter(username=username).exists():
                    return Response({'error':'Username already exists'})
                else:
                    if len(password) < 6:
                        return Response({'error':'Password must be at least 6 characters'})
                    else:
                        user = User.objects.create_user(username=username, password=password)
                        user = User.objects.get(id=user.id)
                        UserProfile.objects.create(user=user, first_name='', last_name='', email='')

                        return Response({'success': 'User created successfully'})
            else:
                return Response({'error':'Passwords do not match'})
        except:
            return Response({'error':'Something went wrong with registering account'})

class DeleteAccountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        user = self.request.user

        try:
            user = User.objects.filter(id=user.id).delete()
            return Response({'success': 'User deleted successfully'})
        except:
            return Response({'error': 'Something went wrong when trying to delete user'})

class GetUsersView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        users = User.objects.all()
        users = UserSerializer(users, many=True)

        return Response(users.data)

class GetUserProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        try:
            user = self.request.user
            user = User.objects.get(id=user.id)

            user_profile = UserProfile.objects.get(user=user)
            user_profile = UserProfileSerializer(user_profile)

            return Response({
                'profile': user_profile.data, 
                'username': str(user.username), 
                'is_staff': user.is_staff})
        except:
            return Response({'error': 'Something went wrong when retrieving user profile'})

class UpdateUserProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request, format=None):
        try:
            user = self.request.user

            data = self.request.data
            first_name = data['first_name']
            last_name = data['last_name']
            email = data['email']

            user = User.objects.get(id=user.id)
            UserProfile.objects.filter(user=user).update(
                first_name=first_name,
                last_name=last_name,
                email=email
            )
            
            user_profile = UserProfile.objects.get(user=user)
            user_profile = UserProfileSerializer(user_profile)
            return Response({'profile': user_profile.data, 'username': str(user.username)})
        except:
            return Response({'error': 'Something went wrong when updating user profile'})

class TestMarvelApi(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        try:
            timestamp = time.time()
            headers = { 'Accept': '*/*' }
            url = 'http://gateway.marvel.com/v1/public/comics'
            payload = {
                'ts': timestamp,
                'apikey': settings.MARVEL_API_PUBLIC_KEY,
                'hash': get_hash_for_marvel_api(timestamp)
            }

            response = requests.get(url, headers=headers, params=payload)
            res_data = response.json()

            print(res_data)

            return Response({
                'success': True,
                'data': res_data
            })

        except:
            return Response({'error':'Something went wrong with testing the Marvel Api'})

class MarvelOmnis(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @method_decorator(cache_page(60*60*2))
    def get(self, request, format=None):
        try:
            timestamp = time.time()
            headers = { 'Accept': '*/*' }
            url = 'http://gateway.marvel.com/v1/public/comics'
            offset = 0
            payload = {
                'ts': timestamp,
                'apikey': settings.MARVEL_API_PUBLIC_KEY,
                'hash': get_hash_for_marvel_api(timestamp),
                'format': 'hardcover',
                'formatType': 'collection',
                'orderBy': 'title',
                'offset': offset
            }

            response = requests.get(url, headers=headers, params=payload)
            res_data = response.json()

            print(res_data['data']['total'])
            total_results =  res_data['data']['total']

            omnis = []
            while offset < total_results:
                for book in res_data['data']['results']:
                    title = book['title']
                    if 'omnibus' in title.lower() or book['pageCount'] > 500:
                        print(book['title'])
                        omnis.append(book)
                        if not book['isbn']:
                            print('MISSING ISBN')
                # Increment
                offset += 20
                timestamp = time.time()

                # Update Payload
                payload['offset'] = offset
                payload['ts'] = timestamp
                payload['hash'] = get_hash_for_marvel_api(timestamp)

                # Make new request
                response = requests.get(url, headers=headers, params=payload)
                res_data = response.json()
                print(offset)

            return Response({
                'success': True,
                'books': omnis
            })

        except Exception as e:
            print(e)
            return Response({'error':'Something went wrong with testing the Marvel Api'})

class DCOmnisScarpe(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @method_decorator(cache_page(60*10))
    def get(self, request, format=None):
        try:
            headers = getAmazonScrapeHeaders()
            url = "http://api.scraperapi.com?api_key=6fbe90a97851773ef3bc5527a64121b4&url=https://www.amazon.com/s?k=omnibus&i=stripbooks&rh=n%3A193766%2Cp_n_feature_eighteen_browse-bin%3A7421487011%2Cp_n_feature_nineteen_browse-bin%3A7421491011&s=date-desc-rank&dc&qid=1667757863&rnid=7421489011&ref=sr_pg_1"
            # url = 'https://www.amazon.com/s?k=omnibus&i=stripbooks&rh=n%3A193766%2Cp_n_feature_eighteen_browse-bin%3A7421487011%2Cp_n_feature_nineteen_browse-bin%3A7421491011&s=date-desc-rank&dc&qid=1667757863&rnid=7421489011&ref=sr_pg_1'
            
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.content, 'html.parser')

            pagination_container = soup.find('span', {'class': 's-pagination-strip'})
            next_page_url = 'amazon.com' + pagination_container.find_all(True, {'class': 's-pagination-item'})[-1]['href']
            
            omnis = []
            while(next_page_url):
                book_search_items = soup.find_all("div", {'class':['s-asin']})
                for book_item in book_search_items:
                    book_asin = book_item['data-asin']
                    book_title = book_item.find('h2').find('span').get_text()
                    book_img_container = book_item.find('div', {'class': 's-product-image-container'})
                    book_url = 'http://amazon.com' + book_img_container.find('a', {'class': 'a-link-normal'})['href']
                    book_img_url = book_img_container.find('img')['src']

                    omni = {
                        'book_asin': book_asin,
                        'book_title': book_title,
                        'book_img_url': book_img_url,
                        'book_url': book_url
                    }
                    omnis.append(omni)

                pagination_container = soup.find('span', {'class': 's-pagination-strip'})
                last_pagination_element = pagination_container.find_all(True, {'class': 's-pagination-item'})[-1]
                if last_pagination_element.has_attr('href'):
                    next_page_url = 'http://amazon.com' + pagination_container.find_all(True, {'class': 's-pagination-item'})[-1]['href']
                    response = requests.get(next_page_url, headers=headers)
                    soup = BeautifulSoup(response.content, 'html.parser')
                else:
                    next_page_url = None

            return Response({
                'success': True,
                'books': omnis
            })

        except Exception as e:
            print(e)
            return Response({'error':'Something went wrong with testing the Marvel Api'})

class AmazonDetailsScrape(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        try:
            data = self.request.data

            headers = getAmazonScrapeHeaders()
            url = data['book_url']
            
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.content, 'html.parser')

            book_pages_container = soup.find('div', {'id': 'rpi-attribute-book_details-fiona_pages'})
            book_pages = ''
            if book_pages_container:
                book_pages = book_pages_container.find('div', {'class': 'rpi-attribute-value'}).get_text()
                print(book_pages)

            omni_details = {
                'book_pages': book_pages
            }

            return Response({
                'success': True,
                'omni_details': omni_details
            })

        except Exception as e:
            print(e)
            return Response({'error':'Something went wrong with testing the Marvel Api'})


def getAmazonScrapeHeaders():
    rand = random.randint(1,2)
    return {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36", "Accept-Encoding":"gzip, deflate", "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "DNT":"1","Connection":"close", "Upgrade-Insecure-Requests":"1"}
    if rand == 1:
        return {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36','Accept-Language': 'en-US, en;q=0.5'}
    else:
        return {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0", "Accept-Encoding":"gzip, deflate", "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "DNT":"1","Connection":"close", "Upgrade-Insecure-Requests":"1"}
