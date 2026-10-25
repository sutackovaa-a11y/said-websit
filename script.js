document.addEventListener("DOMContentLoaded", () => {
  // ПЕРЕХОДЫ МЕЖДУ РАЗДЕЛАМИ
  const pages = document.querySelectorAll(".page");
  const navButtons = document.querySelectorAll(".navigation [data-page]");

  function showPage(pageId) {
    const target = document.getElementById(pageId);

    if (!target || !target.classList.contains("page")) return;

    pages.forEach(page => {
      page.classList.toggle("active", page.id === pageId);
    });

    navButtons.forEach(button => {
      button.classList.toggle("active", button.dataset.page === pageId);
    });

    history.replaceState(null, "", `#${pageId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("[data-page]");

    if (button) {
      event.preventDefault();
      showPage(button.dataset.page);
    }
  });

  // АРАБСКИЕ БУКВЫ
  const letters = [
    ["ا", "Алиф", "mouth"],
    ["ب", "Ба", "lips"],
    ["ت", "Та", "tongue"],
    ["ث", "Са", "tongue"],
    ["ج", "Джим", "tongue"],
    ["ح", "Ха", "throat"],
    ["خ", "Ха", "throat"],
    ["د", "Даль", "tongue"],
    ["ذ", "Заль", "tongue"],
    ["ر", "Ра", "tongue"],
    ["ز", "Зай", "tongue"],
    ["س", "Син", "tongue"],
    ["ش", "Шин", "tongue"],
    ["ص", "Сад", "tongue"],
    ["ض", "Дад", "tongue"],
    ["ط", "Та", "tongue"],
    ["ظ", "За", "tongue"],
    ["ع", "Айн", "throat"],
    ["غ", "Гайн", "throat"],
    ["ف", "Фа", "lips"],
    ["ق", "Каф", "tongue"],
    ["ك", "Кяф", "tongue"],
    ["ل", "Лям", "tongue"],
    ["م", "Мим", "lips"],
    ["ن", "Нун", "nose"],
    ["ه", "Ха", "throat"],
    ["و", "Вав", "lips"],
    ["ي", "Йа", "tongue"]
  ];

  const lettersGrid = document.getElementById("letters-grid");
  const letterSearch = document.getElementById("letter-search");
  const makhrajFilter = document.getElementById("makhraj-filter");
  const letterDetails = document.getElementById("letter-details");

  const studied = new Set(
    JSON.parse(localStorage.getItem("said-studied-letters") || "[]")
  );

  const placeNames = {
    throat: "Горло",
    tongue: "Язык",
    lips: "Губы",
    nose: "Полость носа",
    mouth: "Полость рта"
  };

  function renderLetters() {
    const query = letterSearch.value.trim().toLowerCase();
    const filter = makhrajFilter.value;

    lettersGrid.innerHTML = "";

    letters
      .filter(letter => {
        const matchesSearch =
          letter[0].includes(query) ||
          letter[1].toLowerCase().includes(query);

        const matchesFilter =
          filter === "all" || letter[2] === filter;

        return matchesSearch && matchesFilter;
      })
      .forEach(letter => {
        const button = document.createElement("button");

        button.type = "button";
        button.className =
          "letter-card" + (studied.has(letter[0]) ? " studied" : "");

        button.innerHTML = `
          <span class="arabic" lang="ar" dir="rtl">${letter[0]}</span>
          <strong>${letter[1]}</strong>
          <small>${studied.has(letter[0]) ? "Изучена ✓" : "Посмотреть"}</small>
        `;

        button.addEventListener("click", () => {
          studied.add(letter[0]);

          localStorage.setItem(
            "said-studied-letters",
            JSON.stringify([...studied])
          );

          letterDetails.innerHTML = `
            <h2>${letter[0]} — ${letter[1]}</h2>
            <p><strong>Махрадж:</strong> ${placeNames[letter[2]]}</p>
            <p>Повторите произношение буквы и закрепите её в упражнениях.</p>
          `;

          renderLetters();
          updateProgress();
        });

        lettersGrid.appendChild(button);
      });

    if (!lettersGrid.children.length) {
      lettersGrid.textContent = "Буквы не найдены.";
    }
  }

  letterSearch.addEventListener("input", renderLetters);
  makhrajFilter.addEventListener("change", renderLetters);
  renderLetters();

  // ПОИСК ПРАВИЛ ТАДЖВИДА
  const rules = [
    ["Нун сакина и танвин", "Правила произношения нун сакины и танвина."],
    ["Мим сакина", "Правила чтения мим сакины."],
    ["Мадд (удлинение)", "Правила удлинения звука."],
    ["Идгам", "Слияние звуков по правилам таджвида."],
    ["Икфа", "Скрытое произношение звука."],
    ["Изхар", "Ясное произношение звука."],
    ["Икляб", "Правило перехода нун сакины или танвина в мим."],
    ["Лям", "Особенности произношения лям."],
    ["Солнечные и лунные буквы", "Особенности произношения артикля ال."]
  ];

  const rulesGrid = document.getElementById("rules-grid");
  const ruleSearch = document.getElementById("rule-search");
  const ruleCategory = document.getElementById("rule-category");

  function renderRules() {
    const query = ruleSearch.value.trim().toLowerCase();
    const category = ruleCategory.value;

    rulesGrid.innerHTML = "";

    rules
      .filter(rule => {
        const matchesSearch =
          rule[0].toLowerCase().includes(query) ||
          rule[1].toLowerCase().includes(query);

        const matchesCategory =
          category === "all" ||
          rule[0] === category ||
          (category === "Нун сакина и танвин" &&
            ["Икфа", "Изхар", "Икляб"].includes(rule[0]));

        return matchesSearch && matchesCategory;
      })
      .forEach(rule => {
        const card = document.createElement("article");
        card.className = "topic-card";

        card.innerHTML = `
          <h3>${rule[0]}</h3>
          <p>${rule[1]}</p>
          <button class="primary-button" type="button">Изучить</button>
        `;

        card.querySelector("button").addEventListener("click", () => {
          card.querySelector("p").textContent =
            rule[1] + " Перейдите в упражнения, чтобы закрепить знания.";
        });

        rulesGrid.appendChild(card);
      });

    if (!rulesGrid.children.length) {
      rulesGrid.textContent = "Правила не найдены.";
    }
  }

  ruleSearch.addEventListener("input", renderRules);
  ruleCategory.addEventListener("change", renderRules);
  renderRules();

  // ПОИСК ВИДЕО
  const videoSearch = document.getElementById("video-search");

  videoSearch.addEventListener("input", () => {
    const query = videoSearch.value.toLowerCase().trim();

    document.querySelectorAll(".video-card").forEach(card => {
      card.hidden = !card.dataset.title.toLowerCase().includes(query);
    });
  });

  // ТЕСТ
  const questions = [
    {
      question: "Сколько букв в арабском алфавите?",
      answers: ["24", "28", "32"],
      correct: 1
    },
    {
      question: "Что означает термин «махрадж»?",
      answers: [
        "Место образования звука",
        "Удлинение звука",
        "Название огласовки"
      ],
      correct: 0
    },
    {
      question: "Как называется правило удлинения звука?",
      answers: ["Икфа", "Идгам", "Мадд"],
      correct: 2
    },
    {
      question: "Какая буква произносится с участием обеих губ?",
      answers: ["ب", "ع", "ق"],
      correct: 0
    },
    {
      question: "Какова цель таджвида?",
      answers: [
        "Ускорить чтение",
        "Правильно произносить звуки при чтении Корана",
        "Выучить только алфавит"
      ],
      correct: 1
    }
  ];

  let questionIndex = 0;
  let sessionCorrect = 0;
  let answered = false;

  let testsCompleted =
    Number(localStorage.getItem("said-tests-completed") || 0);

  let correctTotal =
    Number(localStorage.getItem("said-correct-answers") || 0);

  const questionElement = document.getElementById("quiz-question");
  const answersElement = document.getElementById("quiz-answers");
  const feedbackElement = document.getElementById("quiz-feedback");
  const scoreElement = document.getElementById("quiz-score");
  const startButton = document.getElementById("start-quiz");
  const nextButton = document.getElementById("next-question");

  function startQuiz() {
    questionIndex = 0;
    sessionCorrect = 0;
    answered = false;

    feedbackElement.textContent = "";
    scoreElement.textContent = "";
    startButton.hidden = true;
    nextButton.hidden = true;
    nextButton.textContent = "Следующий вопрос →";

    renderQuestion();
  }

  function renderQuestion() {
    const item = questions[questionIndex];

    questionElement.textContent =
      `${questionIndex + 1}/${questions.length}. ${item.question}`;

    answersElement.innerHTML = "";
    feedbackElement.textContent = "";

    item.answers.forEach((answer, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "answer-button";
      button.textContent = answer;

      button.addEventListener("click", () => {
        if (answered) return;

        answered = true;
        const correct = index === item.correct;

        if (correct) {
          sessionCorrect++;
          correctTotal++;
          button.classList.add("correct");
          feedbackElement.textContent = "Верно!";
        } else {
          button.classList.add("incorrect");
          answersElement.children[item.correct].classList.add("correct");
          feedbackElement.textContent =
            `Правильный ответ: ${item.answers[item.correct]}`;
        }

        answersElement.querySelectorAll("button").forEach(answerButton => {
          answerButton.disabled = true;
        });

        localStorage.setItem(
          "said-correct-answers",
          String(correctTotal)
        );

        nextButton.hidden = false;

        if (questionIndex === questions.length - 1) {
          nextButton.textContent = "Завершить тест";
        }
      });

      answersElement.appendChild(button);
    });
  }

  startButton.addEventListener("click", startQuiz);

  document.getElementById("open-quiz").addEventListener("click", () => {
    showPage("exercises");
    startQuiz();
  });

  nextButton.addEventListener("click", () => {
    if (!answered) return;

    if (questionIndex < questions.length - 1) {
      questionIndex++;
      answered = false;
      nextButton.hidden = true;
      renderQuestion();
      return;
    }

    testsCompleted++;

    localStorage.setItem(
      "said-tests-completed",
      String(testsCompleted)
    );

    questionElement.textContent =
      `Тест завершён. Результат: ${sessionCorrect} из ${questions.length}.`;

    answersElement.innerHTML = "";
    feedbackElement.textContent = "Результат сохранён на этом устройстве.";
    scoreElement.textContent = "";

    nextButton.hidden = true;
    startButton.hidden = false;
    startButton.textContent = "Пройти ещё раз";

    updateProgress();
  });

  // СТАТИСТИКА
  function updateProgress() {
    const testsElement = document.getElementById("tests-completed");
    const correctElement = document.getElementById("correct-answers");
    const accuracyElement = document.getElementById("accuracy");
    const studiedElement = document.getElementById("letters-studied");
    const progressFill = document.getElementById("progress-fill");
    const caption = document.getElementById("progress-caption");

    if (testsElement) testsElement.textContent = testsCompleted;
    if (correctElement) correctElement.textContent = correctTotal;

    const accuracy = testsCompleted
      ? Math.round(correctTotal / (testsCompleted * questions.length) * 100)
      : 0;

    if (accuracyElement) {
      accuracyElement.textContent = `${Math.min(100, accuracy)}%`;
    }

    if (studiedElement) {
      studiedElement.textContent = `${studied.size} из 28`;
    }

    if (progressFill) {
      progressFill.style.width =
        `${Math.round(studied.size / 28 * 100)}%`;
    }

    if (caption) {
      caption.textContent =
        `Изучено букв: ${studied.size} из 28. Пройдено тестов: ${testsCompleted}.`;
    }
  }

  updateProgress();

  // Открываем нужный раздел, если в адресе есть #letters и т. п.
  const initialPage = location.hash.slice(1);

  if (initialPage && document.getElementById(initialPage)?.classList.contains("page")) {
    showPage(initialPage);
  }
});