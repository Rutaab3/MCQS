import os
import re
import urllib.request

def download_file(url, dest):
    print(f"Downloading {url} to {dest}...")
    try:
        urllib.request.urlretrieve(url, dest)
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def process_css(css_content, css_name, base_dir):
    fonts_dir = os.path.join(base_dir, "libraries", "fonts")
    css_dir = os.path.join(base_dir, "libraries", "css")
    
    if not os.path.exists(fonts_dir):
        os.makedirs(fonts_dir)
    if not os.path.exists(css_dir):
        os.makedirs(css_dir)

    # Find all urls
    urls = re.findall(r'url\((.*?)\)', css_content)
    
    for url in urls:
        # Clean url (remove quotes)
        clean_url = url.strip("'\"")
        filename = os.path.basename(clean_url)
        dest_path = os.path.join(fonts_dir, filename)
        
        if download_file(clean_url, dest_path):
            # Replace in CSS
            local_path = f"../fonts/{filename}"
            css_content = css_content.replace(url, f"'{local_path}'")
    
    with open(os.path.join(css_dir, css_name), "w", encoding="utf-8") as f:
        f.write(css_content)

# Google Fonts
google_fonts_url = "https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Google+Sans+Display:wght@400;500;700&family=Roboto:wght@300;400;500;700&family=Google+Sans+Mono&display=swap"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

req = urllib.request.Request(google_fonts_url, headers=headers)
with urllib.request.urlopen(req) as response:
    google_css = response.read().decode('utf-8')

process_css(google_css, "google-fonts.css", r"c:\Users\Fahad\Downloads\Skycast\WeatherAPI\New folder\New folder")

# Material Symbols
material_symbols_url = "https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
req2 = urllib.request.Request(material_symbols_url, headers=headers)
with urllib.request.urlopen(req2) as response:
    material_css = response.read().decode('utf-8')

process_css(material_css, "material-symbols.css", r"c:\Users\Fahad\Downloads\Skycast\WeatherAPI\New folder\New folder")

print("Done!")
