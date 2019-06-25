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
