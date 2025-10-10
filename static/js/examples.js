function showSelectedContainer() {
  const selected = document.getElementById("example-menu").value;

  // Hide all module containers
  document.querySelectorAll('.module-container').forEach(container => {
    container.style.display = 'none';
  });

  // Hide or show default message
  const defaultMsg = document.getElementById('default-container');
  if (defaultMsg) {
    defaultMsg.style.display = selected ? 'none' : 'block';
  }

  // Show selected container
  if (selected) {
    const container = document.getElementById(`${selected}-container`);
    if (container) {
      container.style.display = 'block';
    }
  }
}