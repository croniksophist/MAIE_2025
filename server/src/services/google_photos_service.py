import requests

def fetch_google_photos(access_token: str) -> list:
    API_URL = "https://photoslibrary.googleapis.com/v1/mediaItems"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(API_URL, headers=headers)

    if response.status_code == 200:
        data = response.json()
        return [item['baseUrl'] for item in data.get('mediaItems', [])]
    else:
        print(f"Error fetching Google Photos: {response.status_code}")
        return []
