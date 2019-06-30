function fetchBoard() {
  return fetch(`${cors}${kanbanApi}/board`, { headers: headers })
    .then(res => res.json())
    .catch(err => {
      console.error(err);
    });
}

function generateCards(cards, column) {
  return cards.forEach(card => {
    column.addCard(new Card(card.id, card.name));
  });
}

function generateColumns() {
  fetchBoard().then(x => {
    x.columns.forEach(x => {
      const column = new Column(x.id, x.name);
      board.addColumn(column);
      generateCards(x.cards, column);
      // x.cards.forEach(y => {
      //   column.addCard(new Card(y.id, y.name));
      // });
    });
  });
}

function generateTemplate(name, data, basicElement) {
  const template = document.getElementById(name).innerHTML;
  const element = document.createElement(basicElement || 'div');

  Mustache.parse(template);
  element.innerHTML = Mustache.render(template, data);

  return element;
}
