import json

json_file = r'c:\Users\Fahad\Downloads\Skycast\WeatherAPI\New folder\New folder\app.json'
js_file = r'c:\Users\Fahad\Downloads\Skycast\WeatherAPI\New folder\New folder\data.js'

with open(json_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

with open(js_file, 'w', encoding='utf-8') as f:
    f.write('window.quizData = ')
    json.dump(data, f, indent=4)
    f.write(';')

print(f"Created {js_file} successfully.")
