'use strict';

const kanbanApi = 'https://kodilla.com/pl/bootcamp-api';
const headers = {
  'X-Client-Id': '4192',
  'X-Auth-Token': '03cf1e159f14886f6f72cfde7595c7f9'
};
const cors = 'https://cors-anywhere.herokuapp.com/';

document.addEventListener('DOMContentLoaded', function() {
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

  function Card(id, name) {
    const self = this;

    this.id = id;
    this.name = name;
    this.element = generateTemplate(
      'card-template',
      { description: this.name, id: this.id },
      'li'
    );

    this.element
      .querySelector('.card')
      .addEventListener('click', function(event) {
        event.stopPropagation();

        if (event.target.classList.contains('btn-check')) {
          this.classList.toggle('done');
        }

        if (event.target.classList.contains('btn-delete')) {
          this.querySelector('p').classList.add('fadeOut');
          this.querySelector('.btn-check').classList.add('fadeOut');
          fetch(`${cors}${kanbanApi}/card/${self.id}`, {
            method: 'DELETE',
            headers: headers
          });
          setTimeout(function() {
            self.removeCard();
            M.toast({ html: 'Card deleted', classes: 'red accent-4' });
          }, 500);
        }
      });
  }
  Card.prototype = {
    removeCard: function() {
      this.element.parentNode.removeChild(this.element);
    }
  };

  const board = {
    name: 'Kanban Board',
    addColumn: function(column) {
      this.element.appendChild(column.element);
      initSortable(column.id); //About this feature we will tell later
      // console.log(column.element);
    },
    element: document.querySelector('#board .column-container')
  };

  function initSortable(id) {
    const el = document.getElementById(id);
    // el to wszyscie kolumny obecne atm
    // console.log(el);
    // console.log(el.id);

    const sortable = Sortable.create(el, {
      group: 'kanban',
      sort: true,

      onAdd: function(/**Event*/ evt) {
        // same properties as onEnd

        let cardId = evt.clone.children[0].id;
        let newParentId = evt.to.getAttribute('id');

        cardId = parseInt(cardId);
        newParentId = parseInt(newParentId);
        // console.log(typeof cardId);
        // console.log(typeof newParentId);

        let payload = new FormData();
        payload.append('name', 'kdaosdko');
        payload.append('bootcamp_kanban_column_id', parseInt(newParentId));

        fetch(`${cors}${kanbanApi}/card/${parseInt(cardId)}`, {
          method: 'PUT',
          headers: headers,
          body: payload
        }).catch(err => console.log(err));
      },

      onEnd: function(/**Event*/ evt) {
        var itemEl = evt.item; // dragged HTMLElement

        // przy kadej zmianie kolumny, loguje sie id of a given CARD
        // console.log(`ID Karty: ${evt.clone.children[0].id}`);
        // console.log(evt.clone.parentElement);

        //         PUT /card/{id}
        // ------------------------------
        // Request:
        // {id}: int - id card we want to edit
        // name: string - new name card
        // bootcamp_kanban_column_id: int - the column id to which we want to move the post
        // ------------------------------
        // Response:
        // {
        //    id: int
        // }

        evt.to; // target list
        evt.from; // previous list
        // console.log(evt.to);
        evt.oldIndex; // element's old index within old parent
        evt.newIndex; // element's new index within new parent
        // console.log(evt.oldIndex);
        evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
        evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
        evt.clone; // the clone element
        // przesuniety element
        evt.pullMode; // when item is in another sortable: `"clone"` if cloning, `true` if moving
      }
    });
  }

  document
    .querySelector('#board .create-column')
    .addEventListener('click', function() {
      const name = prompt('Enter a column name');
      let payload = new FormData();
      payload.append('name', name);
      const self = this;
      fetch(`${cors}${kanbanApi}/column`, {
        method: 'POST',
        headers: headers,
        body: payload
      })
        .then(res => res.json())
        .then(data => {
          const column = new Column(data.id, payload.get('name'));
          board.addColumn(column);
          M.toast({
            html: 'New column has been added',
            classes: 'teal lighten-2'
          });
        });
    });

  generateColumns();
});
