import os
import django
from datetime import timedelta
from django.utils.encoding import smart_str
from django.utils.translation import gettext

django.utils.translation.ugettext = gettext
django.utils.encoding.smart_text = smart_str

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 'o=^ugslkltb$j*sz&)*magg$n%+j9w1nj0)qy2%(ibn=wo=b09'

DEBUG = False

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # installers
    'rest_framework',
    'django_filters',
    'corsheaders', 
    'admin_auto_filters',
    'django_admin_json_editor',
    # apps
    'login.apps.LoginConfig',
    "temas.apps.TemasConfig",
    "person.apps.PersonConfig",

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'api.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'api.wsgi.application'

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

AUTH_USER_MODEL = 'login.User'

db = os.getenv('DJANGO_BD_TYPE')

DATABASES = {
    'default': {
        'ENGINE': 'mssql',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': os.getenv('DATABASE_PORT'),
        'OPTIONS': {
            "dsn": str(os.getenv('DATABASE_DNS')),
            "host_is_server": True,
            "autocommit": True,
            "unicode_results": True,
            "isolation_level": "READ UNCOMMITTED",
            "connection_timeout": 8,
            "query_timeout": 8,
            'driver': 'ODBC Driver 18 for SQL Server',
            'extra_params': "Encrypt=no",
        },
    },
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = "pt-br"

TIME_ZONE = os.getenv("TIME_ZONE", "America/Sao_Paulo")

USE_I18N = True

USE_L10N = True

USE_TZ = os.getenv("USE_TZ", "True") == "True"

STATIC_URL = '/static/'

# Import additional settings
from .rest_framework import *
from .jwt_auth import *
from .cors import *
