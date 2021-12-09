from django.http import HttpResponse
from rest_framework import status
from mimetypes import MimeTypes

class ImageResponse(HttpResponse):
    def __init__(self, image):
        if image:
            mime_type = MimeTypes().guess_type(image.path)[0]
            super().__init__(image, content_type=mime_type)
        else:
            super().__init__(status=status.HTTP_404_NOT_FOUND)
