from django.conf import settings
import hashlib

def get_hash_for_marvel_api(ts):
    return hashlib.md5('{}{}{}'.format(
        ts, 
        settings.MARVEL_API_PRIVATE_KEY, 
        settings.MARVEL_API_PUBLIC_KEY).encode()).hexdigest()