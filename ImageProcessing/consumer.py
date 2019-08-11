#!/usr/bin/python3
import time
import json
import logging

import crop_images
import upload_images
import update_status

from kafka import KafkaConsumer
from constants import JOB_ID, ORIGINAL_IMAGE, KAFKA_HOST, KAFKA_TOPIC, KAFKA_AUTO_OFFSET_RESET

deserializer = lambda m: json.loads(m.decode('utf-8'))

class Consumer:
    def run(self):
        consumer = KafkaConsumer(bootstrap_servers=KAFKA_HOST,
                                 auto_offset_reset=KAFKA_AUTO_OFFSET_RESET,
                                 value_deserializer=deserializer)
        consumer.subscribe([KAFKA_TOPIC])

        print ('Started:: Kafka Consumer...')
            
        while True:
            message_pack = consumer.poll(timeout_ms=500)

            for _, messages in message_pack.items():
                for message in messages:
                    job = message.value

                    job_id = job[JOB_ID]
                    original_image_url = job[ORIGINAL_IMAGE]

                    images_list = crop_images.crop(original_image_url, job_id)
                    images_upload_info = upload_images.upload(images_list)
                    update_status.update_job_status(job_id, images_upload_info)

                    print ('Success: Job Successfully Processed')


def start():
    consumer = Consumer()
    consumer.run()


if __name__ == "__main__":
    print ('Starting:: Kafka Consumer...')
    start()

