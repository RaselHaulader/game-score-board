// Save data to localStorage
const saveData = (key, value) => {
  const prevData = JSON.parse(localStorage.getItem('score-board'));
  const data = {...prevData};
  data[key] = value;
  localStorage.setItem('score-board', JSON.stringify(data));
}

const getData = (key) => {
  const data = JSON.parse(localStorage.getItem('score-board'));
  if(!data) return;
  return data[key];
}

let teamA = getData('teamA') ? getData('teamA') : '';
let teamB = getData('teamB') ? getData('teamB') : '';
let winPoint = getData('winPoint') ? getData('winPoint') : 60;

const openScoreBoard = () => {
  teamA = getData('teamA');
  teamB = getData('teamB');
  winPoint = getData('winPoint');
  document.querySelector('.team-name-container').classList.add('none');
  document.querySelector('.score-board').classList.remove('none');
  document.querySelector('.score-container').classList.remove('none');
  document.querySelector('.score-board span.teamA').textContent = teamA;
  document.querySelector('.score-board .add-point-field .teamA h3').textContent = teamA;
  document.querySelector('.score-board .score-container .teamA h3').textContent = teamA;
  document.querySelector('.score-board span.teamB').textContent = teamB;
  document.querySelector('.score-board .add-point-field .teamB h3').textContent = teamB;
  document.querySelector('.score-board .score-container .teamB h3').textContent = teamB;
  document.querySelector('.score-board .score-container .teamB .total-point').textContent = " / " + getData('winPoint');
  document.querySelector('.score-board .score-container .teamA .total-point').textContent = " / " + getData('winPoint');
}

if (teamA && teamB) {
  openScoreBoard();
}

const setTeam = () => {
   saveData('teamA', document.querySelector('.team-names input.teamA').value);
   saveData('teamB', document.querySelector('.team-names input.teamB').value);
   saveData('winPoint', document.querySelector('input.winPoint').value);
   openScoreBoard();
}

const nameSubmit = (e) => {
  e.preventDefault();
  setTeam();
}

saveData('teamA', teamA);
saveData('teamB', teamB);

getData('teamA')
getData('teamB')

let fieldLock = false;

const toggleAddPointField = () => {
  if (fieldLock) return;
  document.querySelector('.add-point-field-container').classList.contains('open') ? document.querySelector('.add-point-field-container').classList.remove('open') : document.querySelector('.add-point-field-container').classList.add('open');
}

document.querySelector('.lock-field .lock-field-btn').addEventListener('click', () => {
  fieldLock ? (fieldLock = false) : (fieldLock = true);
  fieldLock ? document.querySelector('.lock-field .field-open').classList.add('none') : document.querySelector('.lock-field .field-open').classList.remove('none');
  fieldLock ? document.querySelector('.lock-field .field-close').classList.remove('none') : document.querySelector('.lock-field .field-close').classList.add('none');
  fieldLock ? document.querySelector('.add-point-btn').setAttribute('disabled', '') : document.querySelector('.add-point-btn').removeAttribute('disabled');
})

document.querySelector('.add-point-btn').addEventListener('click', () => {
  toggleAddPointField();
});

let teamAScore = getData('teamAScore') ? getData('teamAScore') : 0;
let teamBScore = getData('teamBScore') ? getData('teamBScore') : 0;
let teamAScorePart = getData('teamAScorePart') ? getData('teamAScorePart') : '➡';
let teamBScorePart = getData('teamBScorePart') ? getData('teamBScorePart') : '➡';

const saveHistory = (teamA, teamAScore, teamB,teamBScore, winner) => { 
  function getCurrentDate() {
    const now = new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    return formattedDate;
  }  
  const currentDate = getCurrentDate();
  const historyData = {
    teamA,
    teamAScore,
    teamB,
    teamBScore,
    winner,
    currentDate
  }
  const prevData = JSON.parse(localStorage.getItem('score-board-history') || '[]');
  let data = [...prevData];
  if (data.length > 100) {
    data.splice(0, data.length - 100);
  }
  data.push(historyData)
  localStorage.setItem('score-board-history', JSON.stringify(data));
}

const savePoint = () => {
  const teamAScoreValue = parseInt(document.querySelector('.add-point-field-container .teamA input').value ? document.querySelector('.add-point-field-container .teamA input').value : 0)
  const teamBScoreValue = parseInt(document.querySelector('.add-point-field-container .teamB input').value ? document.querySelector('.add-point-field-container .teamB input').value : 0);

  teamAScore += teamAScoreValue;
  teamBScore += teamBScoreValue;

  document.querySelector('.total-point-container .total-point-a').textContent = teamAScore;
  document.querySelector('.total-point-container .total-point-b').textContent = teamBScore;

  teamAScorePart = `${teamAScorePart} ${teamAScoreValue ? teamAScoreValue > 0 ? `+ ${teamAScoreValue}` : teamAScoreValue : ''}`;
  teamBScorePart = `${teamBScorePart} ${teamBScoreValue ? teamBScoreValue > 0 ? `+ ${teamBScoreValue}` : teamBScoreValue : ''}`

  document.querySelector('.score-container .teamA-score-part').textContent = teamAScorePart;
  document.querySelector('.score-container .teamB-score-part').textContent = teamBScorePart;
  
  saveData('teamAScore', teamAScore);
  saveData('teamBScore', teamBScore);

  saveData('teamAScorePart', teamAScorePart);
  saveData('teamBScorePart', teamBScorePart);
  
  if (teamAScore >= winPoint && teamBScore >= winPoint ) {
    document.querySelector('.score-board').classList.add('none');
    document.querySelector('.winner-show-container').classList.remove('none');
    document.querySelector('.winner-show-container h1').textContent = "Match Draw";
    document.querySelector('.winner-show-container .summery-teamA').textContent = teamA +": "+ teamAScorePart +"= " + teamAScore;
    document.querySelector('.winner-show-container .summery-teamB').textContent = teamB +": "+ teamBScorePart +"= " + teamBScore;
    saveHistory(teamA, teamAScore, teamB, teamBScore, 'draw');
  } else if(teamAScore >= winPoint) {
    document.querySelector('.score-board').classList.add('none');
    document.querySelector('.winner-show-container').classList.remove('none');
    document.querySelector('.winner-show-container .winner-team-name').textContent = teamA;
    document.querySelector('.winner-show-container .summery-teamA').textContent = teamA +": "+ teamAScorePart +"= " + teamAScore;
    document.querySelector('.winner-show-container .summery-teamB').textContent = teamB +": "+ teamBScorePart +"= " + teamBScore;
    saveHistory(teamA, teamAScore, teamB, teamBScore, teamA);
  } else if (teamBScore >= winPoint) {
    document.querySelector('.score-board').classList.add('none');
    document.querySelector('.winner-show-container').classList.remove('none');
    document.querySelector('.winner-show-container .winner-team-name').textContent = teamB;
    document.querySelector('.winner-show-container .summery-teamA').textContent = teamA +": "+ teamAScorePart +"= " + teamAScore;
    document.querySelector('.winner-show-container .summery-teamB').textContent = teamB +": "+ teamBScorePart +"= " + teamBScore;
    saveHistory(teamA, teamAScore, teamB, teamBScore, teamB);
  }
}
savePoint();

document.querySelector('.history-icon').addEventListener('click', () => {
  if (!document.querySelector('.history-container').classList.contains('open')) {
    const history = JSON.parse(localStorage.getItem('score-board-history') || '[]');
    const ul = document.querySelector('.history ul');
    ul.innerHTML = '';
    history.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="history-team-names">
          <span class="${item.teamA === item.winner ? 'winner-name' : 'looser-name'} ${item.winner === 'draw' && 'draw'} teamA">${item.teamA} (${item.teamAScore})</span> vs 
          <span class="${item.teamB === item.winner ? 'winner-name' : 'looser-name'} ${item.winner === 'draw' && 'draw'} teamB">${item.teamB} (${item.teamBScore})</span> 
        </span>
        <span class="time">${item.currentDate}</span>`
      ul.appendChild(li);
    })
    document.querySelector('.history-container').classList.add('open');
    document.querySelector('.team-name-set-container').classList.add('none');
  } else {
    document.querySelector('.history-container').classList.remove('open');
    document.querySelector('.team-name-set-container').classList.remove('none');
  }
})

const updatePoint = (e) => {
  e.preventDefault();
  savePoint();
  toggleAddPointField();
  e.target.reset();
}

const resetHistory = () => {
  localStorage.removeItem('score-board-history');
  window.location.reload();
}

const resetData = () => {
  localStorage.removeItem('score-board');
  window.location.reload();
}

document.querySelector('.clear-history').addEventListener('click', () => {
  if (window.confirm("Do you really want to Clear History?")) {
    resetHistory();
  }
})

document.querySelector('.reset-game-btn').addEventListener('click', () => {
  if (window.confirm("Do you really want to Reset?")) {
    resetData();
  }
})
document.querySelector('.reset-button').addEventListener('click', () => {
  resetData();
})
