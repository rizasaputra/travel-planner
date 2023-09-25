import json
import os
import boto3
from stability_sdk.api import GenerationRequest, TextPrompt

# import requests

endpoint_name = os.environ["SAGEMAKER_ENDPOINT"]
sagemaker_client = boto3.client("sagemaker-runtime")


def lambda_handler(event, context):
    print('received event:')
    print(event)

    input = json.loads(event["body"])
    caption = input["caption"]

    text = f"{caption}. Breathtaking, 8K, professional photography." 
    negative_prompts = "Bad quality, bad detail, blurry-image, jpeg artifacts, bad contrast, bad anatomy, duplicate, watermark, extra detail, chaotic distribution of objects, distortion, bad detail facial details"

    data = GenerationRequest(
      text_prompts=[TextPrompt(text=text, weight=1), TextPrompt(text=negative_prompts, weight=-1)],
      style_preset= "photographic",
      cfg_scale=7,
      height=1024,
      width=1024,
      steps=30,
  )

    prompt = data.json(exclude_unset=True).encode("utf-8")
    response = sagemaker_client.invoke_endpoint(
        EndpointName=endpoint_name, ContentType="application/json", Body=prompt, Accept="application/json;png;jpg"
    )
    base64img = json.loads(response["Body"].read())["artifacts"][0]["base64"]

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS" 
        },
        "body": json.dumps({
            "image": base64img
        }),
    }
