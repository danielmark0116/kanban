const board = {
  name: 'Kanban Board',
  addColumn: function(column) {
    this.element.appendChild(column.element);
    initSortable(column.id);
  },
  element: document.querySelector('#board .column-container')
};

function initSortable(id) {
  const el = document.getElementById(id);
  // el => all columns present atm

  const sortable = Sortable.create(el, {
    group: 'kanban',
    sort: true,

    onAdd: function(evt) {
      let cardId = evt.clone.children[0].id;
      let newParentId = evt.to.getAttribute('id');

      cardId = parseInt(cardId);
      newParentId = parseInt(newParentId);
      // console.log(typeof cardId);
      // console.log(typeof newParentId);

      let payload = new FormData();
      payload.append('name', 'kdaosdko');
      payload.append('bootcamp_kanban_column_id', parseInt(newParentId));

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

      fetch(`${cors}${kanbanApi}/card/${parseInt(cardId)}`, {
        method: 'PUT',
        headers: headers,
        body: payload
      }).catch(err => console.log(err));
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
