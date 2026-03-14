import re
from collections import defaultdict

def find_duplicates(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    questions = defaultdict(list)
    current_id = None
    
    # Simple state machine to parse the markdown
    # The markdown structure from the `read` output:
    # Line N: ID (e.g., "1")
    # Line N+1: Question text
    # Line N+2 to N+5: Options
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Check if the line is just a number (the ID)
        if re.match(r'^\d+$', line):
            current_id = line
            # The next line should be the question
            if i + 1 < len(lines):
                question_text = lines[i+1].strip()
                if question_text:
                    questions[question_text].append(current_id)
                i += 1 # Skip the question line
        i += 1

    duplicates = {q: ids for q, ids in questions.items() if len(ids) > 1}
    return duplicates

if __name__ == "__main__":
    file_path = '/home/ubuntu/page_texts/rutaab3.github.io_MCQS_.md'
    duplicates = find_duplicates(file_path)
    
    if not duplicates:
        print("No duplicate questions found.")
    else:
        print(f"Found {len(duplicates)} duplicate questions:")
        for q, ids in duplicates.items():
            print(f"Question: {q}")
            print(f"IDs: {', '.join(ids)}")
            print("-" * 20)
