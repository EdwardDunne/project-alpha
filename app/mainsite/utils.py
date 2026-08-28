from django.conf import settings
import hashlib

def get_hash_for_marvel_api(ts):
    return hashlib.md5('{}{}{}'.format(
        ts,
        settings.MARVEL_API_PRIVATE_KEY,
        settings.MARVEL_API_PUBLIC_KEY).encode()).hexdigest()

def format_errors(errors):
    if isinstance(errors, dict):
        return '; '.join(
            f"{field}: {' '.join(str(m) for m in messages) if isinstance(messages, list) else messages}"
            for field, messages in errors.items()
        )
    if isinstance(errors, list):
        return ' '.join(str(message) for message in errors)
    return str(errors)

def serializer_error_message(serializer):
    return format_errors(serializer.errors)

def custom_exception_handler(exc, context):
    """
    Normalizes every exception DRF handles to {"error": "..."} response
    """
    from rest_framework.exceptions import ValidationError
    from rest_framework.views import exception_handler as drf_exception_handler

    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    if isinstance(exc, ValidationError):
        response.data = {'error': format_errors(exc.detail)}
    elif isinstance(response.data, dict) and 'detail' in response.data:
        response.data = {'error': str(response.data['detail'])}

    return response