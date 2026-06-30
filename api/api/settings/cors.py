import os

from corsheaders.defaults import default_headers

CORS_ORIGIN_WHITELIST = os.getenv('CORS_ORIGIN_WHITELIST', 'http://localhost:3000,http://localhost:3000').split(',')

CORS_ORIGIN_ALLOW_ALL = False

CORS_ALLOW_HEADERS = (
    *default_headers,
    'x-empresa-id',
)

# This allows the client to get the filename when the API returns a downloadable file
CORS_EXPOSE_HEADERS = ['Content-Disposition']
