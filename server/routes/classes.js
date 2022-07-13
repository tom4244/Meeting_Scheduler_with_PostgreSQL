import express from 'express';

var knex = require('../db.js');

let router = express.Router();


function getDayNumber(weekday) {
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  for (let dayNumber in dayNames) {
		if (weekday === dayNames[dayNumber]) {
			return dayNumber;
		}
	}
}

function calcDayInterval(weekday, lastWeekday) {
  let diff = getDayNumber(weekday) - getDayNumber(lastWeekday);
	return(diff > 0 ? diff : diff + 7)
}

router.post('/', (req, res) => {
	let { mtg_types, number_of_weeks, selected_weekdays, weekdaysString, classDate, classMonth, classWeekday, classYear, classHour, classMinutes, classAMPM, classEndHour, classEndMinutes, classEndAMPM, students_string, first_names_string, user, timezoneOffset, classFirstDay, classEndTime } = req.body;
	// Dates and times will be saved in the database in UTC timezone regardless of their origin, 
	//   then later converted to the proper local timezone in the client
  let addPMHours = (classAMPM == 'p.m.') ? 12 : 0;	
  let classHourAMPM = ((classHour === 12) ? 0 : classHour) + addPMHours;
  // time is part of the 'date' column in timestamptz format
  let firstDay = new Date(classFirstDay);	
	let endTime = new Date(classEndTime);
	let thisClassDay = new Date(classFirstDay);
	let lastDate = thisClassDay.getDate();
	let hoursInterval = endTime.getHours() - firstDay.getHours();
  if (hoursInterval < 0) {
		hoursInterval = hoursInterval + 24;
	}
	let saveArray = [];
	let week_number = 0;
	let date = "";
  // Subsequent meetings are calculated based on selected weekdays and number of weeks
	// Rotate the list of weekdays as needed so that dates start with the correct first weekday
  let dayOrder = selected_weekdays;
	  if (dayOrder[0] !== classWeekday) {
      do {
        dayOrder.push(dayOrder.shift());
		  } while (dayOrder[0] !== classWeekday)
		}
  let lastWeekday = dayOrder[0];
	const numberOfMtgs = number_of_weeks * selected_weekdays.length;
  // Make an entry line for each meeting date
	do {
		week_number += 1;
    for (let weekday of dayOrder)  {
			const dayInterval = calcDayInterval(weekday, lastWeekday);
	    let thisClassDay = new Date(classFirstDay);
			if ((week_number !== 1)||(weekday !== dayOrder[0])) {
        thisClassDay.setDate(lastDate + dayInterval);
			}
			let weekday_endtime = new Date(thisClassDay);
	    weekday_endtime.setHours(thisClassDay.getHours() + hoursInterval);
	    weekday_endtime.setMinutes(classEndMinutes);
			// make a unique Date object so that each one doesn't equal the newest since it's call by reference
      lastWeekday = weekday;
			let lastDate = thisClassDay.getDate();
      saveArray.push({ 
				mtg_types: mtg_types, students_string: students_string, first_names_string: first_names_string, weekday: weekday, class_datetime: thisClassDay, endtime: weekday_endtime, week_number: week_number, number_of_weeks: number_of_weeks, selected_weekdays: weekdaysString, mtg_requester: user 
  		});

    }
  } while (week_number < number_of_weeks);
      knex('session')
		 .insert(saveArray)
	   .then(msg => res.json({success: true, msg: msg }))
	   .catch (errors => res.status(500).json({ error: errors}));
});

router.get('/:user', (req, res) => {
	  const now = new Date();
  knex('session')
	  .where('mtg_requester', req.params.user)
		.andWhere('endtime', '>', now)
	  .orWhere('students_string', 'like', '%' + req.params.user + '%')
		.andWhere('endtime', '>', now)
	  .orderBy('class_datetime', 'asc')

	.then( sessions => {
		res.json({ sessions });
	})
	.catch (errors => res.status(500).json({ error: errors}));

});

export default router;

