import json
import os
import re
from ai21 import Completion, SageMakerDestination

# import requests

endpoint_name = os.environ["SAGEMAKER_ENDPOINT"]

def lambda_handler(event, context):
    print('received event:')
    print(event)

    input = json.loads(event["body"])
    language = input["language"]
    destination = input["destination"]
    duration = input["duration"]
    persona = input["persona"]

    en_prompt = f"""
You are a copywriter and illustrator for travel agents. 
Write daily travel itinerary plan based on the destination, traveler persona, and travel duration.

For each day, write a bullet point describing the itinerary. 
Also create a caption with prefix "Caption: " for each day summarizing the day activity.

Destination: Surabaya.
Traveler: family.
Duration: 1 days.

Day 1:

* Visit Surabaya Zoo
* Visit Botanical Garden
* Stroll in park

Caption: Explore nature of Surabaya

END OF ITINERARY

Destination:  {destination}.
Traveler: {persona}.
Duration: {duration} days.
    """

    id_prompt = f"""
Anda adalah seorang copywriter dan ilustrator untuk sebuah agen perjalanan wisata.
Buat jadwal perjalanan wisata harian berdasarkan tujuan, persona turis, dan durasi perjalanan.

Untuk masing-masing hari, tulis rencana perjalanan sebagai poin-poin, dan buat keterangan yang merangkum aktivitas hari tersebut.

Tujuan: Surabaya
Turis: Keluarga
Durasi: 1 hari

Hari 1:

* Jelajahi kebun binatang Surabaya
* Kunjungi botanical garden
* Bersantai di taman kota

Keterangan: Rasakan keindahan alam Surabaya

AKHIR RENCANA PERJALANAN

Tujuan: {destination}
Turis: {persona}
Durasi: {duration} hari
    """

    dicts = {
        "en":  {"prompt": en_prompt, "stop": "END OF ITINERARY", "day": "Day", "caption": "Caption"},
        "id": {"prompt": id_prompt, "stop": "AKHIR RENCANA PERJALANAN", "day": "Hari", "caption": "Keterangan"}
    }

    print(dicts[language]["prompt"])

    response = Completion.execute(
        destination=SageMakerDestination(endpoint_name),
        prompt=dicts[language]["prompt"],
        maxTokens=2000,
        temperature=0,
        numResults=1,
        stopSequences=[dicts[language]["stop"], "\n\n\n"]
    )
    
    print(response)
    text = response['completions'][0]['data']['text']

    days = re.split(rf'{dicts[language]["day"]} \d+:', text)
    days[:] = [x.strip() for x in days if x]
    
    itineraries = []
    captions = []

    print(days)

    for i, txt in enumerate(days):
        print(txt)
        if txt:
            act, caption = txt.split(f'{dicts[language]["caption"]}: ',1)
            itineraries.append(act.strip())
            captions.append(caption.partition("\n\n")[0])

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS" 
        },
        "body": json.dumps({
            "itineraries": itineraries,
            "captions": captions
        }),
    }
