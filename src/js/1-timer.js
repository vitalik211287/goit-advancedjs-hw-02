import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;

const refs = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  startBtnEl: document.querySelector('[data-start]'),
  inputContainerEl: document.querySelector('#datetime-picker'),
};

const timer = {
  intervalId: null,

  start() {
    // валідація перед стартом
    if (!userSelectedDate || userSelectedDate.getTime() <= Date.now()) {
      iziToast.warning({
        title: 'Caution',
        message: 'Please choose a date in the future',
      });
      return;
    }

    // блокуємо керування на час відліку
    refs.startBtnEl.disabled = true;
    refs.inputContainerEl.disabled = true;

    // щоб не було кількох інтервалів
    if (this.intervalId) clearInterval(this.intervalId);

    const tick = () => {
      const diff = userSelectedDate.getTime() - Date.now();
      if (diff <= 0) {
        // фінальний кадр — показуємо нулі і стоп
        this.render(0);
        this.stop();
        return;
      }

      this.render(diff);
    };

    // перший кадр одразу, щоб не чекати 1 секунду
    tick();
    this.intervalId = setInterval(tick, 1000);
  },

  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    refs.startBtnEl.disabled = true;
    refs.inputContainerEl.disabled = false;
  },

  pad(value) {
    return String(value).padStart(2, '0');
  },

  render(ms) {
    const { days, hours, minutes, seconds } = convertMs(ms);
    refs.days.textContent = this.pad(days);
    refs.hours.textContent = this.pad(hours);
    refs.minutes.textContent = this.pad(minutes);
    refs.seconds.textContent = this.pad(seconds);
  },
};

refs.startBtnEl.addEventListener('click', () => timer.start());

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    // Перевіряємо, чи дата майбутня
    if (userSelectedDate <= new Date()) {
      refs.startBtnEl.disabled = true;
      iziToast.warning({
        title: 'Caution',
        message: 'Please choose a date in the future',
      });
      return;
    }
    refs.startBtnEl.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
