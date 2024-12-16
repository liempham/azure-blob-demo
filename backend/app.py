from flask import Flask, request, jsonify
from flask_cors import CORS
from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

account_url = os.getenv('AZURE_STORAGE_ACCOUNT_URL')
container_name = os.getenv('AZURE_STORAGE_CONTAINER_NAME')
account_key = os.getenv('AZURE_STORAGE_ACCOUNT_KEY')
write_exp_hours = int(os.getenv('WRITE_BLOB_EXPIRY_HOURS'))
read_exp_hours = int(os.getenv('READ_BLOB_EXPIRY_HOURS'))
blob_service_client = BlobServiceClient(account_url, credential=account_key)

def generate_sas_token(blob_name, permissions, expiry_hours):
    sas_token = generate_blob_sas(
        account_name=blob_service_client.account_name,
        container_name=container_name,
        blob_name=blob_name,
        account_key=account_key,
        permission=permissions,
        expiry=datetime.utcnow() + timedelta(hours=expiry_hours)
    )
    sas_url = f"{account_url}/{container_name}/{blob_name}?{sas_token}"
    return sas_url


@app.route('/generate-upload-sas', methods=['GET'])
def generate_upload_sas():
    blob_name = request.args.get('blob_name')
    sas_url = generate_sas_token(
        blob_name, BlobSasPermissions(write=True, delete=True), write_exp_hours)
    return jsonify({"sas_url": sas_url}), 200


@app.route('/generate-read-sas', methods=['GET'])
def generate_read_sas():
    blob_name = request.args.get('blob_name')
    sas_url = generate_sas_token(blob_name, BlobSasPermissions(read=True), read_exp_hours)
    return jsonify({"sas_url": sas_url}), 200


@app.route('/files', methods=['GET'])
def list_files():
    container_client = blob_service_client.get_container_client(container_name)
    blobs = container_client.list_blobs()
    files = [
        {
            "name": blob.name,
            "url": generate_sas_token(blob.name, BlobSasPermissions(read=True), read_exp_hours),
            "upload_date": blob.creation_time.strftime('%Y-%m-%d %H:%M:%S')
        }
        for blob in blobs
    ]
    return jsonify(files), 200

if __name__ == '__main__':
    app.run(debug=True)
