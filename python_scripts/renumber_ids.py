import json

file_path = r'c:\Users\Fahad\Downloads\Skycast\WeatherAPI\New folder\New folder\data\app2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for i, item in enumerate(data, 1):
    item['id'] = i

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print(f"Updated {len(data)} items.")