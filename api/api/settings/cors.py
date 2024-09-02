import os

CORS_ORIGIN_WHITELIST = os.getenv('CORS_ORIGIN_WHITELIST', 'http://localhost:3000,http://localhost:3000').split(',')

CORS_ORIGIN_ALLOW_ALL = False

# This allows the client to get the filename when the API returns a downloadable file
CORS_EXPOSE_HEADERS = ['Content-Disposition']
