from drf_yasg import openapi
from drf_yasg.inspectors import DjangoRestResponsePagination
from collections import OrderedDict
from rest_framework.pagination import CursorPagination, LimitOffsetPagination, PageNumberPagination


class MyPaginationInspector(DjangoRestResponsePagination):

    def get_paginated_response(self, paginator, response_schema):
        assert response_schema.type == openapi.TYPE_ARRAY, "array return expected for paged response"
        paged_schema = None

        title = response_schema.items_.ref[14:] + 'ListResponse'

        if isinstance(paginator, (LimitOffsetPagination, PageNumberPagination, CursorPagination)):
            has_count = not isinstance(paginator, CursorPagination)
            paged_schema = openapi.Schema(
                type=openapi.TYPE_OBJECT,
                title=title,
                properties=OrderedDict((
                    ('count', openapi.Schema(type=openapi.TYPE_INTEGER) if has_count else None),
                    ('next', openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI, x_nullable=True)),
                    ('previous', openapi.Schema(type=openapi.TYPE_STRING, format=openapi.FORMAT_URI, x_nullable=True)),
                    ('results', response_schema),
                )),
                required=['results']
            )

            if has_count:
                paged_schema.required.insert(0, 'count')

        return paged_schema
