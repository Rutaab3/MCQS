    const quizData = window.quizData || [];
    
    // Check if data loaded
    if (quizData.length === 0) {
      console.error('Quiz data not found in data.js');
    } else {
      console.log('Quiz data loaded:', quizData.length, 'items');
    }
    
    let state = {
      showAnswers: false,
      userAnswers: {},
      limit: 'all',
      currentPage: 1
    };

    function renderQuiz() {
      const container = document.getElementById('quiz-container');
      let questionsToRender = quizData;

      if (state.limit !== 'all') {
        const limit = parseInt(state.limit);
        const startIndex = (state.currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        questionsToRender = quizData.slice(startIndex, endIndex);
      }

      let html = questionsToRender.map((q, idx) => {
        const userChoice = state.userAnswers[q.id];
        const globalIndex = quizData.findIndex(item => item.id === q.id);

        return `
                    <div class="card">
                        <div style="display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); display: flex; align-items: center; justify-content: center; font-weight: 500; font-size: 14px; flex-shrink: 0;">
                                ${globalIndex + 1}
                            </div>
                            <h2 style="font-size: 18px; line-height: 24px; color: var(--md-sys-color-on-surface);">
                                ${q.question}
                            </h2>
                        </div>
                        <div class="options-group">
                            ${q.options.map(option => renderOption(q, option, userChoice)).join('')}
                        </div>
                    </div>
                `;
      }).join('');

      if (state.limit !== 'all') {
        const limit = parseInt(state.limit);
        const totalPages = Math.ceil(quizData.length / limit);

        let paginationHTML = '<div class="pagination">';

        if (state.currentPage > 1) {
          paginationHTML += `<button onclick="changePage(-1)" class="btn-tonal"><span class="material-symbols-rounded">chevron_left</span> Previous</button>`;
        } else {
          paginationHTML += `<button disabled class="btn-tonal" style="opacity:0.3"><span class="material-symbols-rounded">chevron_left</span> Previous</button>`;
        }

        paginationHTML += `<span class="label-large">Page ${state.currentPage} of ${totalPages}</span>`;

        if (state.currentPage < totalPages) {
          paginationHTML += `<button onclick="changePage(1)" class="btn-tonal">Next <span class="material-symbols-rounded">chevron_right</span></button>`;
        } else {
          paginationHTML += `<button disabled class="btn-tonal" style="opacity:0.3">Next <span class="material-symbols-rounded">chevron_right</span></button>`;
        }

        paginationHTML += '</div>';
        html += paginationHTML;
      }

      container.innerHTML = html;
      updateStats();
    }

    window.changePage = function (delta) {
      state.currentPage += delta;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderQuiz();
    };

    function renderOption(q, option, userChoice) {
      const isSelected = userChoice === option;
      const isCorrect = q.answer === option;
      let classes = "option ";

      if (state.showAnswers) {
        if (isCorrect) {
          classes += "correct";
        } else if (isSelected && !isCorrect) {
          classes += "incorrect";
        } else {
          classes += "faded";
        }
      } else if (isSelected) {
        classes += "selected";
      }

      const iconName = (state.showAnswers && isCorrect) ? 'check_circle' :
        (state.showAnswers && isSelected && !isCorrect) ? 'cancel' : '';

      const iconHTML = iconName ? `<span class="material-symbols-rounded icon-filled" style="font-size: 20px;">${iconName}</span>` : '';

      return `
                <div class="${classes}" onclick="handleSelect(${q.id}, '${option.replace(/'/g, "\\'")}')">
                    <span>${option}</span>
                    ${iconHTML}
                </div>
            `;
    }

    function handleSelect(qId, option) {
      if (state.showAnswers) return;
      state.userAnswers[qId] = option;
      renderQuiz();
    }

    function updateStats() {
      let currentQuestions = quizData;
      if (state.limit !== 'all') {
        const limit = parseInt(state.limit);
        const startIndex = (state.currentPage - 1) * limit;
        currentQuestions = quizData.slice(startIndex, startIndex + limit);
      }

      let answeredCount = 0;
      currentQuestions.forEach(q => {
        if (state.userAnswers[q.id]) answeredCount++;
      });

      document.getElementById('progress-badge').innerText = `${answeredCount} / ${currentQuestions.length} Answered`;

      const actionFooter = document.getElementById('action-footer');
      if (answeredCount > 0 && !state.showAnswers) {
        actionFooter.classList.remove('hidden');
        document.getElementById('footer-status').innerText = `${answeredCount} questions answered on this page.`;
      } else {
        actionFooter.classList.add('hidden');
      }

      if (state.showAnswers) {
        const score = currentQuestions.reduce((acc, q) => {
          return acc + (state.userAnswers[q.id] === q.answer ? 1 : 0);
        }, 0);
        const scoreEl = document.getElementById('score-display');
        scoreEl.style.display = 'inline-flex';
        scoreEl.innerText = `Score: ${score} / ${currentQuestions.length}`;
      } else {
        document.getElementById('score-display').style.display = 'none';
      }
    }

    document.getElementById('toggle-answers').addEventListener('click', () => {
      state.showAnswers = !state.showAnswers;
      const text = document.getElementById('btn-text');
      const icon = document.getElementById('eye-icon');

      if (state.showAnswers) {
        text.innerText = "Hide Answers";
        icon.textContent = "visibility_off";
      } else {
        text.innerText = "Show Answers";
        icon.textContent = "visibility";
      }
      renderQuiz();
    });

    document.getElementById('finish-btn').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      state.showAnswers = true;
      document.getElementById('btn-text').innerText = "Hide Answers";
      document.getElementById('eye-icon').textContent = "visibility_off";
      renderQuiz();
    });

    document.getElementById('questions-per-page').addEventListener('change', (e) => {
      state.limit = e.target.value;
      state.currentPage = 1;
      renderQuiz();
    });

    // Ripple Effect
    function addRipple(el, e) {
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = `${size}px`;
      r.style.left = `${e.clientX - rect.left - size / 2}px`;
      r.style.top = `${e.clientY - rect.top - size / 2}px`;
      r.style.animation = `ripple-expand 600ms var(--md-sys-motion-easing-standard) forwards`;
      el.appendChild(r);
      setTimeout(() => r.remove(), 600);
    }

    document.addEventListener('click', e => {
      const btn = e.target.closest('button');
      const opt = e.target.closest('.option');
      if ((btn && !btn.disabled) || opt) {
        addRipple(btn || opt, e);
      }
    });

    // Theme Toggle Logic
    (function () {
      const saved = localStorage.getItem('app-theme') || 'light';
      document.documentElement.setAttribute('data-theme', saved);
      const icon = document.getElementById('themeIcon');
      if (icon) icon.textContent = saved === 'dark' ? 'dark_mode' : 'light_mode';
    })();

    document.getElementById('themeToggle')?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('app-theme', next);
    });

    // Initial Render
    renderQuiz();
