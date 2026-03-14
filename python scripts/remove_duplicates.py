import json

def remove_duplicates(input_file, output_file):
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        seen_questions = set()
        unique_data = []
        
        for item in data:
            question = item.get('question')
            if question not in seen_questions:
                unique_data.append(item)
                seen_questions.add(question)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(unique_data, f, indent=4, ensure_ascii=False)
            
        print(f"Original count: {len(data)}")
        print(f"Unique count: {len(unique_data)}")
        print(f"Removed {len(data) - len(unique_data)} duplicates.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    remove_duplicates('/home/ubuntu/upload/app.json', '/home/ubuntu/app_cleaned.json')
