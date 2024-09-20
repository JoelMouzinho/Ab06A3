// Unveränderliche Quizkarten-Daten
const quizCards = [
    { question: "Was ist die Hauptstadt von Deutschland?", answer: "Berlin", rating: null },
    { question: "Wie viele Kontinente gibt es?", answer: "7", rating: null },
    { question: "Was ist 5 + 3?", answer: "8", rating: null }
];

// Hilfsfunktionen zum Manipulieren der Quizkarten
const updateQuizCards = (cards, index, newCard) => 
    cards.map((card, i) => i === index ? newCard : card);

const sortQuizCards = (cards) =>
    [
        ...cards.filter(card => card.rating === 0),   // bad
        ...cards.filter(card => card.rating === 1),   // good
        ...cards.filter(card => card.rating === 2),   // great
        ...cards.filter(card => card.rating === null)
    ];

const updateCardRating = (cards, index, rating) =>
    updateQuizCards(cards, index, { ...cards[index], rating });

// Anzeige-Elemente laden
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const currentCardElement = document.getElementById('current-card');
const totalCardsElement = document.getElementById('total-cards');
const cardListElement = document.getElementById('card-list');

// Anzeigen und Rendern
const displayCard = (cards, currentCardIndex) => {
    const currentCard = cards[currentCardIndex];
    questionElement.innerText = currentCard.question;
    answerElement.innerText = currentCard.answer;
    answerElement.classList.add('hidden');
    currentCardElement.innerText = currentCardIndex + 1;
};

const renderCardList = (cards) => {
    cardListElement.innerHTML = ''; // Liste leeren
    cards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = "p-4 bg-white shadow rounded-lg";

        let ratingText;
        switch (card.rating) {
            case 0:
                ratingText = "bad";
                break;
            case 1:
                ratingText = "good";
                break;
            case 2:
                ratingText = "great";
                break;
            default:
                ratingText = 'unbewertet';
        }

        cardDiv.innerHTML = `
            <h3 class="text-lg font-bold">${card.question}</h3>
            <p class="text-gray-500">${ratingText}</p>
            <div class="mt-2">
                <button data-test-id="delete" class="bg-red-500 text-white px-2 py-1 rounded" onclick="handleDelete(${index})">Löschen</button>
                <button class="bg-yellow-500 text-white px-2 py-1 ml-2 rounded" onclick="handleEdit(${index})">Bearbeiten</button>
            </div>
        `;

        cardListElement.appendChild(cardDiv);
    });
};

// Rekursive Logik für den Quizablauf
const quizFlow = (cards, currentCardIndex = 0) => {
    const sortedCards = sortQuizCards(cards);

    // Karte anzeigen
    displayCard(sortedCards, currentCardIndex);

    // Kartenliste anzeigen
    renderCardList(sortedCards);

    let answerRevealed = false; // Zustand, um zu überprüfen, ob die Antwort angezeigt wurde

    // Funktion zum Bewerten der Karte
    const handleRating = (rating) => {
        if (answerRevealed) { // Bewertung nur erlauben, wenn die Antwort angezeigt wurde
            const newCards = updateCardRating(cards, currentCardIndex, rating);
            const nextIndex = (currentCardIndex + 1) % newCards.length;
            quizFlow(newCards, nextIndex); // Nächster Zustand wird weitergegeben
        } else {
            alert("Bitte zeige zuerst die Antwort an, bevor du bewertest.");
        }
    };

    // Event-Listener für Bewertungen
    document.getElementById('bad').onclick = () => handleRating(0);  // bad = 0
    document.getElementById('good').onclick = () => handleRating(1); // good = 1
    document.getElementById('great').onclick = () => handleRating(2); // great = 2
    document.getElementById('show-answer').onclick = () => {
        answerElement.classList.toggle('hidden');
        answerRevealed = !answerRevealed; // Zustand der Antwortanzeige umschalten
    };
};

// Lösch- und Bearbeitungsfunktionen
const handleDelete = (index) => {
    const newCards = quizCards.filter((_, i) => i !== index);
    quizFlow(newCards);
};

const handleEdit = (index) => {
    const newQuestion = prompt('Neue Frage:', quizCards[index].question);
    const newAnswer = prompt('Neue Antwort:', quizCards[index].answer);
    if (newQuestion !== null && newAnswer !== null) {
        const newCards = updateQuizCards(quizCards, index, { ...quizCards[index], question: newQuestion, answer: newAnswer });
        quizFlow(newCards);
    }
};

// Neue Karte hinzufügen
document.getElementById('card-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newQuestion = document.getElementById('new-question').value;
    const newAnswer = document.getElementById('new-answer').value;

    if (newQuestion && newAnswer) {
        const newCard = { question: newQuestion, answer: newAnswer, rating: null };
        const newCards = [...quizCards, newCard];
        quizFlow(newCards); // Neuer Zustand wird übergeben
    }
});

// Initialisierung des Quizflows und der Kartenliste
totalCardsElement.innerText = quizCards.length;
quizFlow(quizCards);
