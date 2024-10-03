function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
function shiftRight(A) {
  // Save the last element
  let lastElement = A[A.length - 1];

  // Shift elements to the right
  for (let i = A.length - 1; i > 0; i--) {
    A[i] = A[i - 1];
  }

  // Set the first element to the saved last element
  A[0] = lastElement;

  return A; // Optionally return the shifted array
}

const POMODORO_STATES = {
  WORK: "work",
  REST: "rest",
};
const TIMER_STATES = {
  STARTED: "started",
  PAUSED: "paused",
  STOPPED: "stopped",
};

const POMODORO_WORK_LENGTH_IN_MINUTES = 25;
const POMODORO_REST_LENGTH_IN_MINUTES = 5;
var data = {
  pomodoroState: POMODORO_STATES.WORK,
  timerState: TIMER_STATES.STOPPED,
  pomodoroTimer: { minutes: 0, seconds: 0 },
  speedupRatio: 1.0,
  catImageUrl: [], // Add this to store the cat image URL
};

new Vue({
  el: "#app",
  data: data,
  methods: {
    //
    _tick: function () {
      // //shift imageURL
      // if (this.pomodoroState === POMODORO_STATES.REST) {
      //   now = Date.now();
      //   if (!this.catImageShiftTimeLast || (now - this.catImageShiftTimeLast > 2000) ){
      //     this.catImageUrl = shiftRight(this.catImageUrl);
      //     this.catImageShiftTimeLast = now;
      //   }
      // }

      if (this.pomodoroTimer.seconds != 0) {
        this.pomodoroTimer.seconds--;
        return;
      }

      if (this.pomodoroTimer.minutes != 0) {
        this.pomodoroTimer.minutes--;
        this.pomodoroTimer.seconds = 59;
        return;
      }

      //both are zero,toggle state
      this.pomodoroState =
        this.pomodoroState === POMODORO_STATES.WORK
          ? POMODORO_STATES.REST
          : POMODORO_STATES.WORK;
      if (this.pomodoroState === POMODORO_STATES.WORK) {
        this.pomodoroTimer.minutes = POMODORO_WORK_LENGTH_IN_MINUTES;
      } else {
        this.pomodoroTimer.minutes = POMODORO_REST_LENGTH_IN_MINUTES;
        this.fetchCatImage(); // Fetch cat image when switching to rest
      }
    },

    //
    startTimer: function () {
      this.timerState = TIMER_STATES.STARTED;
      this._tick();
      this.intervalID = setInterval(this._tick, 1000 / this.speedupRatio); // call _tick every 1 second
    },

    stopTimer: function () {
      this.timerState = TIMER_STATES.STOPPED;
      clearInterval(this.intervalID);
      this.intervalID = NaN;
      if (this.pomodoroState == POMODORO_STATES.WORK) {
        this.pomodoroTimer.minutes = POMODORO_WORK_LENGTH_IN_MINUTES;
      } else {
        this.pomodoroTimer.minutes = POMODORO_REST_LENGTH_IN_MINUTES;
      }
      this.pomodoroTimer.seconds = 0;
    },

    pauseTimer: function () {
      this.timerState = TIMER_STATES.PAUSED;
      clearInterval(this.intervalID);
      this.intervalID = NaN;
    },

    //
    speedUp: function () {
      console.log("speed up x2...");
      this.speedupRatio *= 2;
      if (this.timerState === TIMER_STATES.STARTED) {
        clearInterval(this.intervalID);
        this.intervalID = setInterval(this._tick, 1000 / this.speedupRatio); // call _tick every 1 second
      }
    },
    //
    speedDown: function () {
      this.speedupRatio /= 2;
      if (this.timerState === TIMER_STATES.STARTED) {
        clearInterval(this.intervalID);
        this.intervalID = setInterval(this._tick, 1000 / this.speedupRatio); // call _tick every 1 second
      }
    },

    async fetchCatImage() {
      // Fetch cat image from the API
      const catapi =
        "https://api.thecatapi.com/v1/images/search?limit=10&api_key=live_JuBnmOCT5wHG9rAdvIJ0CqGhiHQ2C5mRUUtqXTGBln7IvWxWPhQIpuzODjegJ2UD";
      try {
        const response = await fetch(catapi);
        const data = await response.json();
        this.catImageUrl = [];
        for (var i in data) {
          this.catImageUrl.push(data[i].url);
        }
        // this.catImageUrl = data[0].url; // Store cat image URL in reactive data
      } catch (error) {
        console.error("Failed to fetch cat image:", error);
      }
    },
  },

  computed: {
    title: function () {
      return "Pomodoro";
    },

    timer_status: function () {
      var title =
        this.pomodoroState === POMODORO_STATES.WORK ? "Work " : "Rest ";
      if (this.timerState === TIMER_STATES.STARTED) {
        title += " Started";
      } else if (this.timerState === TIMER_STATES.PAUSED) {
        title += " Paused";
      } else if (this.timerState === TIMER_STATES.STOPPED) {
        title += "Stopped";
      }
      return title;
    },

    timerMinutes: function () {
      return pad(this.pomodoroTimer.minutes, 2);
    },
    timerSeconds: function () {
      return pad(this.pomodoroTimer.seconds, 2);
    },
    timerPercent: function () {
      var total =
        60 *
        (this.pomodoroState === POMODORO_STATES.WORK
          ? POMODORO_WORK_LENGTH_IN_MINUTES
          : POMODORO_REST_LENGTH_IN_MINUTES);
      return (
        (100 * (this.pomodoroTimer.minutes * 60 + this.pomodoroTimer.seconds)) /
        total
      ).toFixed(1);
    },
    timerStartEnabled: function () {
      return this.timerState != TIMER_STATES.STARTED;
    },
    timerPauseEnabled: function () {
      return this.timerState === TIMER_STATES.STARTED;
    },
    timerStopEnabled: function () {
      return (
        this.timerState === TIMER_STATES.STARTED ||
        this.timerState === TIMER_STATES.PAUSED
      );
    },
  },
});
