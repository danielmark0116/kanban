'use strict';

document.addEventListener('DOMContentLoaded', function() {
  function randomString() {
    const chars =
      '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
    let str = '';
    for (let i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }

  function generateTemplate(name, data, basicElement) {
    let template = document.getElementById(name).innerHTML;
    let element = document.createElement(basicElement || 'div');

    Mustache.parse(template);
    element.innerHTML = Mustache.render(template, data);

    return element;
  }

  function Column(name) {
    let self = this;

    this.id = randomString();
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
          self.addCard(new Card(prompt('Enter the name of the card')));
          M.toast({
            html: 'New card has been added',
            classes: 'teal lighten-2'
          });
        }
      });
  }

  Column.prototype = {
    addCard: function(card) {
      this.element.querySelector('ul').appendChild(card.element);
    },
    removeColumn: function() {
      this.element.parentNode.removeChild(this.element);
    }
  };

  function Card(description) {
    let self = this;

    this.id = randomString();
    this.description = description;
    this.element = generateTemplate(
      'card-template',
      { description: this.description },
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
    },
    element: document.querySelector('#board .column-container')
  };

  function initSortable(id) {
    let el = document.getElementById(id);
    let sortable = Sortable.create(el, {
      group: 'kanban',
      sort: true
    });
  }

  document
    .querySelector('#board .create-column')
    .addEventListener('click', function() {
      let name = prompt('Enter a column name');
      let column = new Column(name);
      board.addColumn(column);
      M.toast({ html: 'New column has been added', classes: 'teal lighten-2' });
    });

  // DUMMY INIT DATA

  // CREATING COLUMNS
  let todoColumn = new Column('To do');
  let doingColumn = new Column('Doing');
  let doneColumn = new Column('Done');

  // ADDING COLUMNS TO THE BOARD
  board.addColumn(todoColumn);
  board.addColumn(doingColumn);
  board.addColumn(doneColumn);

  // CREATING CARDS
  let card1 = new Card('New task');
  let card2 = new Card('Create kanban boards');
  let card3 = new Card(
    'Create kanban boards. Take into consideration also that factor we spoke about on the phone. This is crucial. This is vital!'
  );

  // ADDING CARDS TO COLUMNS
  todoColumn.addCard(card1);
  doingColumn.addCard(card2);
  doingColumn.addCard(card3);
});
