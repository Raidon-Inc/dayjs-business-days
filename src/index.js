export default (option = {}, dayjsClass) => {
  dayjsClass.prototype.isHoliday = function () {
    if (!option.holidays) return false;
    if (option.holidays.includes(this.format(option.holidayFormat))) return true;

    return false;
  };

  dayjsClass.prototype.isBusinessDay = function () {
    const workingWeekdays = [1, 2, 3, 4, 5];

    if (this.isHoliday()) return false;
    if (workingWeekdays.includes(this.day())) return true;

    return false;
  };

  dayjsClass.prototype.businessDaysAdd = function (number) {
    const numericDirection = number < 0 ? -1 : 1;
    let currentDay = this.clone();
    let daysRemaining = Math.abs(number);
    const day = numericDirection === 1 ? 1 : -1;
    const hr = day / 24;
    const min = hr / 60;
    const s = min / 60;
    const ms = s / 1000;
    while (daysRemaining != 0) {
      if (daysRemaining >= 1) {
        currentDay = currentDay.add(1, 'd');
        if (currentDay.isBusinessDay()) daysRemaining -= 1;
      } else if (daysRemaining < 1) {
        if (daysRemaining >= hr) {
          const numHours = Math.floor(daysRemaining / hr);
          const tempDay = currentDay.add(numHours, 'h');
          if (tempDay.isBusinessDay()) {
            currentDay = tempDay;
            daysRemaining -= numHours * hr;
          } else {
            currentDay = currentDay.add(day, 'd');
          }
        } else if (daysRemaining >= min) {
          const numMinutes = Math.floor(daysRemaining / min);
          const tempDay = currentDay.add(numMinutes, 'm');
          if (tempDay.isBusinessDay()) {
            currentDay = tempDay;
            daysRemaining -= numMinutes * min;
          } else {
            currentDay = currentDay.add(day, 'd');
          }
        } else if (daysRemaining >= s) {
          const numSeconds = Math.floor(daysRemaining / s);
          const tempDay = currentDay.add(numSeconds, 's');
          if (tempDay.isBusinessDay()) {
            currentDay = tempDay;
            daysRemaining -= numSeconds * s;
          } else {
            currentDay = currentDay.add(day, 'd');
          }
        } else if (daysRemaining >= ms) {
          const numMs = Math.floor(daysRemaining / ms);
          const tempDay = currentDay.add(numMs, 'ms');
          if (tempDay.isBusinessDay()) {
            currentDay = tempDay;
            daysRemaining -= numMs * ms;
          } else {
            currentDay = currentDay.add(day, 'd');
          }
        }
      }
    }
    return currentDay;
  };

  dayjsClass.prototype.addDay = function (number) {
    const numericDirection = number < 0 ? -1 : 1;
    let currentDay = this.clone();
    let daysRemaining = number;
    const day = numericDirection === 1 ? 1 : -1;
    const hr = day / 24;
    const min = hr / 60;
    const s = min / 60;
    const ms = s / 1000;
    while (daysRemaining != 0) {
      if (daysRemaining >= 1) {
        currentDay = currentDay.add(day, 'd');
        daysRemaining -= 1;
      } else if (daysRemaining < 1) {
        if (daysRemaining >= hr) {
          const numHours = Math.floor(daysRemaining / hr);
          currentDay = currentDay.add(numHours, 'h');
          daysRemaining -= numHours * hr;
        } else if (daysRemaining >= min) {
          const numMinutes = Math.floor(daysRemaining / min);
          currentDay = currentDay.add(numMinutes, 'm');
          daysRemaining -= numMinutes * min;
        } else if (daysRemaining >= s) {
          const numSeconds = Math.floor(daysRemaining / s);
          currentDay = currentDay.add(numSeconds, 's');
          daysRemaining -= numSeconds * s;
        } else if (daysRemaining >= ms) {
          const numMs = Math.floor(daysRemaining / ms);
          currentDay = currentDay.add(numMs, 'ms');
          daysRemaining -= numMs * ms;
        }
      }
    }
    return currentDay;
  };

  dayjsClass.prototype.businessDaysSubtract = function (number) {
    let currentDay = this.clone();

    currentDay = currentDay.businessDaysAdd(number * -1);

    return currentDay;
  };

  dayjsClass.prototype.businessDiff = function (input) {
    const day1 = this.clone();
    const day2 = input.clone();

    const isPositiveDiff = day1 >= day2;
    let start = isPositiveDiff ? day2 : day1;
    const end = isPositiveDiff ? day1 : day2;

    let daysBetween = 0;

    if (start.isSame(end)) return daysBetween;

    while (start < end) {
      if (start.add(1, 'd') < end) {
        if (start.isBusinessDay()) daysBetween += 1;
        start = start.add(1, 'd');
      } else if (start.add(1, 'h') < end) {
        if (start.isBusinessDay()) daysBetween += 1 / 24;
        start = start.add(1, 'h');
      } else if (start.add(1, 'm') < end) {
        if (start.isBusinessDay()) daysBetween += 1 / 24 / 60;
        start = start.add(1, 'm');
      } else if (start.add(1, 's') < end) {
        if (start.isBusinessDay()) daysBetween += 1 / 24 / 60 / 60;
        start = start.add(1, 's');
      }
    }

    return isPositiveDiff ? daysBetween : -daysBetween;
  };

  dayjsClass.prototype.nextBusinessDay = function () {
    const searchLimit = 7;
    let currentDay = this.clone();

    let loopIndex = 1;
    while (loopIndex < searchLimit) {
      currentDay = currentDay.add(1, 'day');

      if (currentDay.isBusinessDay()) break;
      loopIndex += 1;
    }

    return currentDay;
  };

  dayjsClass.prototype.prevBusinessDay = function () {
    const searchLimit = 7;
    let currentDay = this.clone();

    let loopIndex = 1;
    while (loopIndex < searchLimit) {
      currentDay = currentDay.subtract(1, 'day');

      if (currentDay.isBusinessDay()) break;
      loopIndex += 1;
    }

    return currentDay;
  };

  dayjsClass.prototype.businessDaysInMonth = function () {
    if (!this.isValid()) return [];

    let currentDay = this.clone().startOf('month');
    const monthEnd = this.clone().endOf('month');
    const businessDays = [];
    let monthComplete = false;

    while (!monthComplete) {
      if (currentDay.isBusinessDay()) businessDays.push(currentDay.clone());

      currentDay = currentDay.add(1, 'day');

      if (currentDay.isAfter(monthEnd)) monthComplete = true;
    }

    return businessDays;
  };

  dayjsClass.prototype.businessWeeksInMonth = function () {
    if (!this.isValid()) return [];

    let currentDay = this.clone().startOf('month');
    const monthEnd = this.clone().endOf('month');
    const businessWeeks = [];
    let businessDays = [];
    let monthComplete = false;

    while (!monthComplete) {
      if (currentDay.isBusinessDay()) businessDays.push(currentDay.clone());

      if (currentDay.day() === 5 || currentDay.isSame(monthEnd, 'day')) {
        businessWeeks.push(businessDays);
        businessDays = [];
      }

      currentDay = currentDay.add(1, 'day');

      if (currentDay.isAfter(monthEnd)) monthComplete = true;
    }

    return businessWeeks;
  };
};
