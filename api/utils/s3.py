import os
import secrets
import io
import zipfile
import boto3
from botocore.exceptions import ClientError


def generate_presigned_url(key):
    if key:
        s3 = boto3.client("s3")
        try:
            bucket = os.getenv("UPLOAD_BUCKET")
            url = f"https://{bucket}.s3.amazonaws.com/{key}"
            return url
        except ClientError:
            return None
    return None


def upload_file(file, extension=None, prefix=None, file_name=None):
    s3 = boto3.client("s3")
    try:
        formated_extension = f".{extension}" if extension else ""
        formated_prefix = f"{prefix}/" if prefix else ""

        key = f"{formated_prefix}{file_name}{formated_extension}"

        print(file_name)
        s3.put_object(
            Body=file,
            Bucket=os.getenv("UPLOAD_BUCKET"),
            Key=key,
        )

        return key
    except ClientError:
        return None


def download_file(key, file_name):
    s3 = boto3.client("s3")
    s3.download_file(os.getenv("UPLOAD_BUCKET"), key, file_name)


def head_object(key: str) -> dict:
    s3 = boto3.client("s3")
    return s3.head_object(Bucket=os.getenv("UPLOAD_BUCKET"), Key=key)


def get_object(key: str):
    s3 = boto3.client("s3")
    return s3.get_object(Bucket=os.getenv("UPLOAD_BUCKET"), Key=key)
