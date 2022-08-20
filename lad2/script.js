let formElement = document.forms['formElement'];

formElement.addEventListener('focusin', function(evt) {
    let activeElement = formElement.querySelector('.focused');
    if (activeElement) {
        activeElement.classList.remove('focused');
    }
    evt.target.classList.add('focused');
});

formElement.addEventListener('focusout', function(evt) {
    let activeElement = formElement.querySelector('.focused');
    if (activeElement) {
        activeElement.classList.remove('focused');
    }
});

console.log('hello')