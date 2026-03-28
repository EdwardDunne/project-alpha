from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .utils import get_hash_for_marvel_api
from bs4 import BeautifulSoup
import time
import requests
import random

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

    # @method_decorator(cache_page(60*60*2))
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

class ScrapeWaltsDC(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        omnis = []
        next_page_url = request.query_params.get('nextPageUrl')

        try:
            walts_base_url = 'https://waltscomicshop.com'
            url = walts_base_url + next_page_url
            # url = 'https://waltscomicshop.com/collections/dc-omnibus-collections?sort_by=title-ascending&page=1'
            
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            pagination_container = soup.find('div', {'class': 'pagination'})
            next_page_url = pagination_container.find('a', {'class': 'pagination__next'})['href']

            # while(next_page_url):

            books = soup.find_all("div", {'class':['product-item']})

            for book_item in books:
                book_details_url = book_item.find('a', {'class': 'product-item__image-wrapper'})['href']
                book_response = requests.get(walts_base_url + book_details_url)
                book_soup = BeautifulSoup(book_response.content, 'html.parser')

                cover_img = 'https:' + book_soup.find('img', {'class': 'product-gallery__image'})['src']

                title_node = book_soup.find('h1', {'class': 'product-meta__title'})
                title = title_node.get_text() if title_node else ''

                description_node = book_soup.find('div', {'class': 'product-block-list__item--description'})
                description = description_node.get_text() if description_node else ''

                page_count = 100


                omni = {
                    'title': title,
                    'description': description,
                    'publisher_name': 'DC Comics',
                    'author': '',
                    'artist': '',
                    'page_count': page_count,
                    'thumbnail_url': cover_img,
                    'book_url': book_details_url
                }

                # print(omni)
                omnis.append(omni)

            # pagination_container = soup.find('div', {'class': 'pagination'})
            # next_page_node = pagination_container.find('a', {'class': 'pagination__next'})
            # next_page_url = next_page_node['href'] if next_page_node else None

            # if next_page_url:
            #     response = requests.get(walts_base_url + next_page_url)
            #     soup = BeautifulSoup(response.content, 'html.parser')

            return Response({
                'success': True,
                'books': omnis,
                'next_page_url': next_page_url
            })

        except Exception as e:
            print(e)

            # return Response({'error':'Something went wrong with scraping DC omnis'})
            return Response({
                    'success': False,
                    'books': omnis
                })

class DCOmnisScarpe(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @method_decorator(cache_page(60*10))
    def get(self, request, format=None):
        try:
            headers = getAmazonScrapeHeaders()
            url = 'https://www.amazon.com/s?k=omnibus&i=stripbooks&rh=n%3A193766%2Cp_n_feature_eighteen_browse-bin%3A7421487011%2Cp_n_feature_nineteen_browse-bin%3A7421491011&s=date-desc-rank&dc&qid=1667757863&rnid=7421489011&ref=sr_pg_1'
            
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.content, 'html.parser')

            pagination_container = soup.find('span', {'class': 's-pagination-strip'})
            next_page_url = 'amazon.com' + pagination_container.find_all(True, {'class': 's-pagination-item'})[-1]['href']
            
            omnis = []
            while(next_page_url):
                print(omnis)
                time.sleep(3)
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
            return Response({'error':'Something went wrong with scraping DC omnis'})
        
class DCOmnisScarpe2(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        omnis = []
        try:
            headers = getAmazonScrapeHeaders()
            url = 'https://www.amazon.com/s?k=omnibus&i=stripbooks&rh=n%3A193766%2Cp_n_feature_eighteen_browse-bin%3A7421487011%2Cp_n_feature_nineteen_browse-bin%3A7421491011&s=date-desc-rank&dc&qid=1667757863&rnid=7421489011&ref=sr_pg_1'
            
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Get the number of pages in this result set
            pagination_container = soup.find('span', {'class': 's-pagination-strip'})
            total_page_count = pagination_container.find_all(True, {'class': 's-pagination-item'})[-2].getText()
            total_page_count = int(total_page_count) + 1

            page_counter = 2
            while(page_counter < total_page_count):

                # Trick amazon into thinking its not being scraped
                time.sleep(random.randint(1,4))

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
                    print(book_title)


                next_page_url = 'https://www.amazon.com/s?k=omnibus&i=stripbooks&rh=n%3A193766%2Cp_n_feature_eighteen_browse-bin%3A7421487011%2Cp_n_feature_nineteen_browse-bin%3A7421491011&s=date-desc-rank&dc&page=' + str(page_counter) + '&qid=1667757863&rnid=7421489011&ref=sr_pg_1'
                response = requests.get(next_page_url, headers=headers)
                soup = BeautifulSoup(response.content, 'html.parser')

                page_counter += 1

            return Response({
                'success': True,
                'books': omnis
            })

        except Exception as e:
            print(e)

            # return Response({'error':'Something went wrong with scraping DC omnis'})
            return Response({
                    'success': False,
                    'books': omnis
                })
        
class MarvelOmnisScarpe(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        soup = None
        omnis = []
        try:
            headers = getAmazonScrapeHeaders()
            url = 'https://www.amazon.com/s?k=omnibus&i=stripbooks&rh=n%3A4366%2Cp_n_feature_eighteen_browse-bin%3A7421487011%2Cp_n_feature_nineteen_browse-bin%3A7421490011&s=date-desc-rank&dc&page=1&qid=1667758382&rnid=7421489011&ref=sr_pg_1'
            
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Get the number of pages in this result set
            pagination_container = soup.find('span', {'class': 's-pagination-strip'})
            total_page_count = pagination_container.find_all(True, {'class': 's-pagination-item'})[-2].getText()
            total_page_count = int(total_page_count) + 1

            page_counter = 2
            while(page_counter < 6): # TEMP set to 6 for demo

                # Trick amazon into thinking its not being scraped
                time.sleep(random.randint(1,4))

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
                    print(book_title)

                next_page_url = 'https://www.amazon.com/s?k=omnibus&i=stripbooks&rh=n%3A4366%2Cp_n_feature_eighteen_browse-bin%3A7421487011%2Cp_n_feature_nineteen_browse-bin%3A7421490011&s=date-desc-rank&dc&page=' + str(page_counter) + '&qid=1667758382&rnid=7421489011&ref=sr_pg_1'
                response = requests.get(next_page_url, headers=headers)
                soup = BeautifulSoup(response.content, 'html.parser')

                page_counter += 1

            return Response({
                'success': True,
                'books': omnis
            })

        except Exception as e:
            print(e)
            return Response({
                'success': False,
                'books': omnis
            })

class AmazonDetailsScrape(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        try:
            data = self.request.data

            # Request product page
            headers = getAmazonScrapeHeaders()
            url = data['book_url']
            response = requests.get(url, headers=headers)
            soup = BeautifulSoup(response.content, 'html.parser')

            # Initialize data
            publish_date = pages = by_line = ''
            contributors = []

            # Get contributors
            by_container = soup.find('div', {'id': 'bylineInfo'})
            contributor_containers = by_container.find_all("span", {'class':['author']})
            for contributor in contributor_containers:
                contributors.append(' '.join(contributor.get_text().split()))

            # Get by line - Currently not using this
            by_line = soup.find('div', {'id': 'bylineInfo'}).get_text()
            by_line = ' '.join(by_line.split())
            
            # Get publish date
            publish_date_container = soup.find('div', {'id': 'rpi-attribute-book_details-publication_date'})
            if publish_date_container:
                publish_date = publish_date_container.find('div', {'class': 'rpi-attribute-value'}).get_text()

            # Get page count
            pages_container = soup.find('div', {'id': 'rpi-attribute-book_details-fiona_pages'})
            if pages_container:
                pages = int(pages_container.find('div', {'class': 'rpi-attribute-value'}).get_text().split()[0])

            omni_details = {
                'contributors': contributors,
                'publish_date': publish_date,
                'pages': pages
            }
            print(omni_details)

            return Response({
                'success': True,
                'omni_details': omni_details
            })

        except Exception as e:
            print(e)
            return Response({'error': "Something went wrong with getting the omni's details"})


def getAmazonScrapeHeaders():
    rand = random.randint(1,3)
    print('RANDOM NUMBER: ' + str(rand))
    # return {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36", "Accept-Encoding":"gzip, deflate", "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "DNT":"1","Connection":"close", "Upgrade-Insecure-Requests":"1"}
    if rand == 1:
        return {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36','Accept-Language': 'en-US, en;q=0.5'}
    elif rand == 2:
        return {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0", "Accept-Encoding":"gzip, deflate", "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "DNT":"1","Connection":"close", "Upgrade-Insecure-Requests":"1"}
    else:
        return {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36", "Accept-Encoding":"gzip, deflate", "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "DNT":"1","Connection":"close", "Upgrade-Insecure-Requests":"1"}
