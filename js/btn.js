document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.fixed-action-btn');
  const instances = M.FloatingActionButton.init(elems, {
    direction: 'left'
  });
});
