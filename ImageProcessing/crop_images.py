import os
import cv2
import numpy as np
from urllib.request import urlopen

from constants import HORIZONTAL, VERTICAL, HORIZONTAL_SMALL, GALLERY, ORIGIN_X, ORIGIN_Y, HORIZONTAL_X, HORIZONTAL_Y, VERTICAL_X, VERTICAL_Y, HORIZONTAL_SMALL_X, HORIZONTAL_SMALL_Y, GALLERY_X, GALLERY_Y

image_keys = [HORIZONTAL, VERTICAL, HORIZONTAL_SMALL, GALLERY]

def get_image_paths(job_id):
    path_horizontal = job_id + '_horizontal.png'
    path_vertical = job_id + '_vertical.png' 
    path_horizontal_small = job_id + '_horizontal_small.png'
    path_gallery = job_id + '_gallery.png' 
    return [path_horizontal, path_vertical, path_horizontal_small, path_gallery]

def get_cropped_image(image, start_x, start_y, end_x, end_y):
    return image[start_x:end_x, start_y:end_y]

def url_to_image(url):
    resp = urlopen(url)
    image = np.asarray(bytearray(resp.read()), dtype="uint8")
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image

def crop(url, job_id):
    original_image = url_to_image(url)

    horizontal = get_cropped_image(original_image, ORIGIN_X, ORIGIN_Y, HORIZONTAL_X, HORIZONTAL_Y)
    vertical = get_cropped_image(original_image, ORIGIN_X, ORIGIN_Y, VERTICAL_X, VERTICAL_Y)
    horizontal_small = get_cropped_image(original_image, ORIGIN_X, ORIGIN_Y, HORIZONTAL_SMALL_X, HORIZONTAL_SMALL_Y)
    gallery = get_cropped_image(original_image, ORIGIN_X, ORIGIN_Y, GALLERY_X, GALLERY_Y)

    images = [horizontal, vertical, horizontal_small, gallery]
    image_paths = get_image_paths(job_id)

    return list(zip(images, image_paths, image_keys))