let current;
let active = [];

// Hint tasks list
const hintTasks = [
    'Bring Anna a cockle shell',
    'Put a limpet shell on another player\'s head then tell Anna',
    'Build a sandcastle and take a photo to show Anna',
    'Pick a soldier for yourself and for Anna, then beat Anna\'s soldier',
    'Stick a peg to another player\'s clothes then tell Anna',
    'Find something with 11 letters, and sing the Mickey Mouse Clubhouse song, replacing M I C K E Y M O U S E with the 11 letters, to Anna',
    'Draw a picture of an animal in the sand, take a photo to show Anna, and have her correctly identify the animal first try with no hints',
    'Start chanting another player\'s name and chase them until you catch them, then tell Anna',
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
    hintTaskText.textContent = 'Task: ' + randomTask
    
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
    alert('The treasure hunt trophy is behind Bigster 🦞');
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
