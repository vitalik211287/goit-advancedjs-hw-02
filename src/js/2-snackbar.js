import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formEl = document.querySelector('.form');

formEl.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  const delay = Number(formEl.elements.delay.value);
  const state = formEl.elements.state.value;

  const shouldResolve = state === 'fulfilled';

  createPromise(delay, shouldResolve)
    .then(delay => {
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
      });
    });

  e.target.reset();

  function createPromise(delay, shouldResolve) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldResolve) {
          resolve(delay); 
        } else {
          reject(delay); 
        }
      }, delay);
    });
  }
}
