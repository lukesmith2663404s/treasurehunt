let current;
let active = [];

// Hint tasks list
const hintTasks = [
    'Find 3 different shades of blue in the room and show Anna',
    'Do 10 jumping jacks and show Anna when done',
    'Find something that rhymes with "clue" and show Anna',
    'Sing the first line of a song to Anna',
    'Do a funny dance move for Anna',
    'Find an object that starts with each letter of your name and show Anna',
    'Tell Anna a joke',
    'Balance something on your head for 5 seconds and show Anna',
    'Find the most interesting book nearby and show Anna',
    'Do 5 push-ups and show Anna when done',
    'Make a silly face and show Anna',
    'Find something red, yellow, and green and show Anna',
    'Recite the alphabet backwards to Anna',
    'Find 3 things that are square and show Anna',
    'Tell Anna what your favorite food is and why'
];

function unlock() {
    let rem = clues.filter(c => c.state === 'locked');
    while (active.length < 2 && rem.length) {
        let c = rem.splice(Math.random() * rem.length | 0, 1)[0];
        c.state = 'open';
        active.push(c);
    }
}

function render() {
    let clueGrid = document.getElementById('clueGrid');
    clueGrid.innerHTML = '';
    let done = 0;
    
    clues.forEach(c => {
        if (c.state === 'done') done++;
        
        let b = document.createElement('button');
        b.className = 'clueTile ' + (
            c.state === 'open' ? 'available' : 
            c.state === 'done' ? 'complete' : 
            'locked'
        );
        b.textContent = c.state === 'locked' ? '🔒' : c.state === 'done' ? '✓' : c.id;
        
        if (c.state === 'open') {
            b.onclick = () => openClue(c);
        }
        
        clueGrid.appendChild(b);
    });
    
    // Check if all clues are complete
    if (done === 15) {
        setTimeout(() => {
            showFinal();
        }, 300);
    }
}

function openClue(c) {
    current = c;
    
    document.getElementById('clueTitle').textContent = 'Clue ' + c.id;
    document.getElementById('clueText').textContent = c.clue;
    
    let clueImage = document.getElementById('clueImage');
    if (c.image) {
        clueImage.src = c.image;
        clueImage.classList.remove('hidden');
    } else {
        clueImage.classList.add('hidden');
    }
    
    document.getElementById('answerInput').value = '';
    
    let clueOverlay = document.getElementById('clueOverlay');
    clueOverlay.classList.remove('hidden');
}

function closeSheet() {
    let clueOverlay = document.getElementById('clueOverlay');
    clueOverlay.classList.add('hidden');
}

function getRandomHintTask() {
    return hintTasks[Math.floor(Math.random() * hintTasks.length)];
}

function showHintTask() {
    let hintTaskText = document.getElementById('hintTaskText');
    let randomTask = getRandomHintTask();
    hintTaskText.textContent = 'Task: ' + randomTask + '\n\nShow Anna when you\'ve completed it to get your hint!';
    
    let hintTaskOverlay = document.getElementById('hintTaskOverlay');
    hintTaskOverlay.classList.remove('hidden');
}

function closeHintTask() {
    let hintTaskOverlay = document.getElementById('hintTaskOverlay');
    hintTaskOverlay.classList.add('hidden');
}

function showHint() {
    let hintText = document.getElementById('hintText');
    hintText.textContent = current.hint || 'No hint available';
    
    let hintOverlay = document.getElementById('hintOverlay');
    hintOverlay.classList.remove('hidden');
}

function closeHint() {
    let hintOverlay = document.getElementById('hintOverlay');
    hintOverlay.classList.add('hidden');
}

function check() {
    let a = document.getElementById('answerInput').value.trim().toLowerCase();
    
    if (current.answers.includes(a)) {
        current.state = 'done';
        active = active.filter(x => x !== current);
        unlock();
        
        localStorage.setItem('hunt', JSON.stringify(clues));
        
        closeSheet();
        render();
    } else {
        let wrongOverlay = document.getElementById('wrongOverlay');
        wrongOverlay.classList.remove('hidden');
        
        try {
            let wrongSound = document.getElementById('wrongSound');
            wrongSound.play();
        } catch (e) {
            // Audio play failed silently
        }
        
        if (navigator.vibrate) {
            navigator.vibrate(300);
        }
        
        setTimeout(() => {
            wrongOverlay.classList.add('hidden');
        }, 3000);
    }
}

function showFinal() {
    let finalOverlay = document.getElementById('finalOverlay');
    finalOverlay.classList.remove('hidden');
}

// Event listeners
document.getElementById('submitAnswerButton').onclick = check;
document.getElementById('closeClueButton').onclick = closeSheet;
document.getElementById('hintButton').onclick = showHintTask;
document.getElementById('completedTaskButton').onclick = () => {
    closeHintTask();
    showHint();
};
document.getElementById('closeHintButton').onclick = closeHint;
document.getElementById('showFinalButton').onclick = () => {
    alert('🎉 FINAL CLUE PLACEHOLDER - Add your final message here!');
};

// Load saved progress
let s = localStorage.getItem('hunt');
if (s) {
    let d = JSON.parse(s);
    d.forEach((x, i) => {
        if (i < clues.length) {
            clues[i].state = x.state;
        }
    });
}

// Initialize
unlock();
render();
