import os
import cv2
import imgur_client

from constants import LINK, STATUS, MESSAGE, FAILURE, FAILURE_MESSAGE, SUCCESS, SUCCESS_MESSAGE

def delete_file(path): 
    os.remove(path)

def upload_image(image_path):
    client = imgur_client.get_imgur_client()
    return client.upload_from_path(image_path)

def save_image(image_path, image):
    cv2.imwrite(image_path, image)

def upload(images_list):
    job_data = {}

    for image_info in images_list:
        image, image_path, image_key = image_info
        save_image(image_path, image)
        
        try:
            response = upload_image(image_path)
            job_data[image_key] = response[LINK]
        except:
            job_data[STATUS] = FAILURE
            job_data[MESSAGE] = FAILURE_MESSAGE

        delete_file(image_path)

    job_data[STATUS] = SUCCESS
    job_data[MESSAGE] = SUCCESS_MESSAGE    
    
    return job_data