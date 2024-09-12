const POMODORO_STATES = {
  WORK: "work",
  REST: "rest",
};
const STATES = {
  STARTED: "started",
  STOPPED: "stopped",
  PAUSED: "paused",
};
const WORKING_TIME_LENGTH_IN_MINUTES = 5;
const RESTING_TIME_LENGTH_IN_MINUTES = 5;

new Vue({
  el: "#app",
  data: {
    state: STATES.STOPPED,
    minute: WORKING_TIME_LENGTH_IN_MINUTES,
    second: 0,
    pomodoroState: POMODORO_STATES.WORK,
    timestamp: 0,
    catImageUrl: null, // Add this to store the cat image URL
  },
  methods: {
    start: function () {
      this.state = STATES.STARTED;
      this._tick();
      this.interval = setInterval(this._tick, 50);
    },
    pause: function () {
      this.state = STATES.PAUSED;
      clearInterval(this.interval);
    },
    stop: function () {
      this.state = STATES.STOPPED;
      clearInterval(this.interval);
      this.pomodoroState = POMODORO_STATES.WORK;
      this.minute = WORKING_TIME_LENGTH_IN_MINUTES;
      this.second = 0;
    },

    _tick: function () {
      if (this.second != 0) {
        this.second--;
        return;
      }
      if (this.minute != 0) {
        this.minute--;
        this.second = 59;
        return;
      }
      // minute==0 & second==0
      this.pomodoroState =
        this.pomodoroState === POMODORO_STATES.WORK
          ? POMODORO_STATES.REST
          : POMODORO_STATES.WORK;
      if (this.pomodoroState === POMODORO_STATES.WORK) {
        this.minute = WORKING_TIME_LENGTH_IN_MINUTES;
      } else {
        this.minute = RESTING_TIME_LENGTH_IN_MINUTES;
        this.fetchCatImage(); // Fetch cat image when switching to rest
      }
    },

    async fetchCatImage() {
      // Fetch cat image from the API
      const catapi =
        "https://api.thecatapi.com/v1/images/search?api_key=live_JuBnmOCT5wHG9rAdvIJ0CqGhiHQ2C5mRUUtqXTGBln7IvWxWPhQIpuzODjegJ2UD";
      try {
        const response = await fetch(catapi);
        const data = await response.json();
        this.catImageUrl = data[0].url; // Store cat image URL in reactive data
      } catch (error) {
        console.error("Failed to fetch cat image:", error);
      }
    },
  },

  computed: {
    title: function () {
      return this.pomodoroState === POMODORO_STATES.WORK
        ? "Work!!! "
        : "Rest...";
    },
    mins: function () {
      if (this.minute < 10) {
        return "0" + this.minute;
      } else {
        return this.minute;
      }
    },
    secs: function () {
      if (this.second < 10) {
        return "0" + this.second;
      } else {
        return this.second;
      }
    },
  },
});
