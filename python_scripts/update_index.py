with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_line = -1
end_line = -1

for i, line in enumerate(lines):
    if 'const quizData = [' in line:
        start_line = i
    if i > start_line and start_line != -1 and '    ]' in line and lines[i+1].strip() == '':
        # Look for the last '    ]' before the state initialization
        # Actually line 2417 is '    ]'
        if i >= 2416: # Rough estimate from my previous view_file
             end_line = i
             break

if start_line != -1 and end_line != -1:
    new_script = """    let quizData = [];

    async function fetchQuizData() {
      try {
        const response = await fetch('app.json');
        if (!response.ok) throw new Error('Failed to load quiz data');
        quizData = await response.json();
        renderQuiz();
      } catch (error) {
        console.error('Error fetching quiz data:', error);
        document.getElementById('quiz-container').innerHTML = `
          <div class="card" style="text-align: center; color: var(--md-sys-color-error);">
            <span class="material-symbols-rounded" style="font-size: 48px;">error</span>
            <p>Error loading quiz data. Please ensure app.json is available.</p>
          </div>
        `;
      }
    }

    fetchQuizData();
"""
    lines[start_line:end_line+1] = [new_script]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Successfully updated index.html")
else:
    print(f"Failed to find markers: start_line={start_line}, end_line={end_line}")
