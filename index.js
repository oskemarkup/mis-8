const formElement = document.getElementById('form');
const tableElement = document.getElementById('table');
const listElement = document.getElementById('list');
const resultElement = document.getElementById('result');
const countField = document.getElementById('count');
const itemTemplate = document.getElementById('item');

let data = [];

function getAlphabet() {
  const alphabet = [];

  for (let i = 65; i <= 90; i++) {
    alphabet.push(String.fromCharCode(i));
  }

  return alphabet;
}

function getChar(n) {
  const alphabet = getAlphabet();
  const char = alphabet[n % alphabet.length];
  const digit = n / alphabet.length ^ 0;
  return char + (digit ? digit : '');
}

function renderTable() {
  const count = Number(countField.value);
  data = new Array(count).fill(null).map(() => new Array(count).fill(false));
  tableElement.classList.toggle('d-none', !count);
  resultElement.classList.add('d-none');

  const tableHeader = tableElement.querySelector('thead tr');
  const tableBody = tableElement.querySelector('tbody');

  tableHeader.innerHTML = '<th>&nbsp;</th>';
  tableBody.innerHTML = '';

  for (let i = 0; i < count; i++) {
    const tableCol = document.createElement('th');
    tableCol.textContent = getChar(i);
    tableHeader.appendChild(tableCol);

    const tableRow = document.createElement('tr');
    tableRow.appendChild(tableCol.cloneNode(true));
    for (let j = 0; j < count; j++) {
      const tableCol = document.createElement('td');
      tableCol.innerHTML = `<input type="checkbox" data-row="${i}" data-col="${j}" />`;
      tableRow.appendChild(tableCol);
    }
    tableBody.appendChild(tableRow);
  }
}

function updateLink(event) {
  if (event.target.type !== 'checkbox') {
    return;
  }

  const { row, col } = event.target.dataset;
  data[row][col] = event.target.checked;
}

function process(event) {
  event.preventDefault();

  const count = data.length;
  const M = data.map(row => row.slice());
  const v = Array(count).fill([1/count].slice());

  for (let i = 0; i < count; i++) {
    const linksCount = getCol(data, i).filter(Boolean).length;
    for (let j = 0; j < count; j++) {
      M[j][i] = data[j][i] ? 1 / linksCount : 0;
    }
  }

  const result = pageRank(M, v);
  const max = result.reduce((max, el) => Math.max(max, el), 0);

  listElement.innerHTML = '';
  result.forEach((item, i) => {
    const isMax = item === max;
    const element = document.importNode(itemTemplate.content, true);
    const badgeClass = isMax ? 'badge-light' : 'badge-primary';

    element.querySelector('.word').textContent = getChar(i);
    element.querySelector('.badge').classList.add(badgeClass);
    element.querySelector('.badge').textContent = item.toString();
    element.firstElementChild.classList.toggle('active', isMax);

    listElement.appendChild(element);
  });
  resultElement.classList.remove('d-none');
}

countField.addEventListener('input', renderTable);
formElement.addEventListener('input', updateLink);
formElement.addEventListener('submit', process);
