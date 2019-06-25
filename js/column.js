function Column(id, name) {
  const self = this;

  this.id = id;
  this.name = name;
  this.element = generateTemplate('column-template', {
    name: this.name,
    id: this.id
  });

  this.element
    .querySelector('.column')
    .addEventListener('click', function(event) {
      if (event.target.classList.contains('btn-delete')) {
        self.removeColumn();
        M.toast({ html: 'Column deleted', classes: 'red accent-4' });
      }

      if (event.target.classList.contains('add-card')) {
        const cardName = prompt('Enter the name of the card');

        let payload = new FormData();

        payload.append('name', cardName);
        payload.append('bootcamp_kanban_column_id', self.id);

        fetch(`${cors}${kanbanApi}/card`, {
          method: 'POST',
          headers: headers,
          body: payload
        })
          .then(res => res.json())
          .then(data => {
            self.addCard(new Card(data.id, cardName));

            M.toast({
              html: 'New card has been added',
              classes: 'teal lighten-2'
            });
          });
      }
    });
}

Column.prototype = {
  addCard: function(card) {
    this.element.querySelector('ul').appendChild(card.element);
  },
  removeColumn: function() {
    const self = this;
    fetch(`${cors}${kanbanApi}/column/${self.id}`, {
      method: 'DELETE',
      headers: headers
    })
      .then(res => res.json())
      .then(data => {
        self.element.parentNode.removeChild(self.element);
      });
  }
};
