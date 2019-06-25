function fetchBoard() {
  return fetch(`${cors}${kanbanApi}/board`, { headers: headers })
    .then(res => res.json())
    .catch(err => {
      console.error(err);
    });
}

function generateColumns() {
  fetchBoard().then(x => {
    x.columns.forEach(x => {
      // console.log(x);
      const column = new Column(x.id, x.name);
      board.addColumn(column);
      x.cards.forEach(x => {
        column.addCard(new Card(x.id, x.name));
        // console.log(x.id);
      });
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
