document.addEventListener('DOMContentLoaded', function() {
  let elems = document.querySelectorAll('.fixed-action-btn');
  let instances = M.FloatingActionButton.init(elems, {
    direction: 'left'
  });
});
