import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from bs4 import BeautifulSoup
import requests
import re

logger = logging.getLogger(__name__)

class ScrapePB(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        omnis = []
        next_page_url = request.query_params.get('nextPageUrl')
        publisher = request.query_params.get('publisher')

        if publisher == 'dc':
            try:
                walts_base_url = 'https://www.panelboundcomics.com'
                url = walts_base_url + next_page_url

                response = requests.get(url)
                soup = BeautifulSoup(response.content, 'html.parser')

                pagination_container = soup.find('ul', {'class': 'pagination__list'})
                next_page_url = pagination_container.find('a', {'class': 'pagination__item--prev'})['href']

                books = soup.find_all("li", {'class':['grid__item']})

                for book_item in books:
                    book_details_url = book_item.find('a', {'class': 'full-unstyled-link'})['href']
                    book_response = requests.get(walts_base_url + book_details_url)
                    book_soup = BeautifulSoup(book_response.content, 'html.parser')

                    img_container = book_soup.find('div', {'class': 'product-media-modal__content'})
                    cover_img = 'https:' + img_container.find('img', {'class': 'global-media-settings'})['src']

                    title_node_container = book_soup.find('div', {'class': 'product__title'})
                    title_node = title_node_container.find('h1', {'class': 'product-meta__title'})
                    title = title_node.get_text() if title_node else ''

                    # description_node_container = book_soup.find('div', {'class': 'product-block-list__item--description'})
                    description_node = book_soup.find('div', {'class': 'product__description'})
                    description = description_node.get_text() if description_node else ''

                    match = re.search(r'(\d+)\s+pages', description)
                    page_count = int(match.group(1)) if match else None

                    def parse_contributors(text):
                        authors = []
                        artists = []

                        for line in text.splitlines():
                            if line.startswith('Written by:'):
                                authors.append(line.replace('Written by:', '').strip())
                            elif line.startswith('Illustrated by:'):
                                artists.append(line.replace('Illustrated by:', '').strip())

                        return authors, artists

                    authors, artists = parse_contributors(description)

                    omni = {
                        'title': title,
                        'description': description,
                        'publisher_name': 'DC Comics',
                        'author': authors,
                        'artist': artists,
                        'page_count': page_count,
                        'thumbnail_url': cover_img,
                        'book_url': book_details_url
                    }

                    logger.debug('Scraped omni: %s', omni)
                    omnis.append(omni)

                return Response({
                    'success': True,
                    'books': omnis,
                    'next_page_url': next_page_url
                })

            except Exception:
                logger.exception('Something went wrong with scraping DC omnis')

                # return Response({'error':'Something went wrong with scraping DC omnis'})
                return Response({
                        'success': False,
                        'books': omnis
                    })
