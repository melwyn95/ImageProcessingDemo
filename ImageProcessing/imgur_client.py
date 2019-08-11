from imgurpython import ImgurClient

from constants import CLIENT_ID, CLIENT_SECRET

def get_imgur_client():
    client = ImgurClient(CLIENT_ID, CLIENT_SECRET)
    return client