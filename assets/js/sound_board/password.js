let correctCode = '';
let onSuccessCallback = null;
let onCloseCallback = null;

function showSyncCodeModal(code='', onSuccess, onClose) {
  correctCode = code.toLowerCase();
  onSuccessCallback = onSuccess;
  onCloseCallback = onClose;
  
  const modal = document.getElementById('sync-modal-overlay');
  modal.classList.add('active');
  
  // Reset inputs and error
  document.querySelectorAll('.code-input').forEach(input => {
    input.value = '';
  });
  document.getElementById('sync-error-message').classList.remove('show');
  document.getElementById('sync-error-message').textContent = '';
  
  // Focus first input
  document.querySelector('.code-input[data-index="0"]').focus();
}

function closeSyncCodeModal() {
  const modal = document.getElementById('sync-modal-overlay');
  modal.classList.remove('active');
  if (onCloseCallback) onCloseCallback();
}

function setupSyncCodeModal() {
  const modal = document.getElementById('sync-modal-overlay');
  const closeBtn = document.getElementById('sync-close-btn');
  const confirmBtn = document.getElementById('sync-confirm-btn');
  const codeInputs = document.querySelectorAll('.code-input');
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeSyncCodeModal();
    }
  });
  
  // Close button
  closeBtn.addEventListener('click', closeSyncCodeModal);
  
  // Confirm button
  confirmBtn.addEventListener('click', verifyCode);
  
  // Handle code inputs
  codeInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      const index = parseInt(e.target.dataset.index);
      
      // Auto-focus next input
      if (value && index < 4) {
        codeInputs[index + 1].focus();
      }
      
      // Clear error when typing
      document.getElementById('sync-error-message').classList.remove('show');
    });
    
    // Handle backspace
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value) {
        const index = parseInt(e.target.dataset.index);
        if (index > 0) {
          codeInputs[index - 1].focus();
        }
      }
    });
  });
  
  // Also verify when pressing Enter
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && modal.classList.contains('active')) {
      verifyCode();
    }
  });
}

function verifyCode() {
  const codeInputs = document.querySelectorAll('.code-input');
  let enteredCode = '';
  
  codeInputs.forEach(input => {
    enteredCode += input.value;
  });
  
  if (enteredCode.length !== 5) {
    showError('Por favor, preencha todos os dígitos');
    return;
  }
  
  if (enteredCode.toLowerCase() === correctCode.toLowerCase()) {
    closeSyncCodeModal();
    if (onSuccessCallback) onSuccessCallback();
  } else {
    showError('Código incorreto. Tente novamente.');
    // Clear inputs
    codeInputs.forEach(input => {
      input.value = '';
    });
    // Focus first input
    codeInputs[0].focus();
  }
}

function showError(message) {
  const errorElement = document.getElementById('sync-error-message');
  errorElement.textContent = message;
  errorElement.classList.add('show');
}

// Initialize the modal when DOM is loaded
document.addEventListener('DOMContentLoaded', setupSyncCodeModal);