
var filter = require('unmutable/lib/filter').default;
var flatMap = require('unmutable/lib/flatMap').default;
var has = require('unmutable/lib/has').default;
var identity = require('unmutable/lib/identity').default;
var last = require('unmutable/lib/last').default;
var isEmpty = require('unmutable/lib/isEmpty').default;
var map = require('unmutable/lib/map').default;
var reduce = require('unmutable/lib/reduce').default;
var set = require('unmutable/lib/set').default;
var update = require('unmutable/lib/update').default;
var updateInto = require('unmutable/lib/updateInto').default;
var pipe = require('unmutable/lib/util/pipe').default;
var pipeWith = require('unmutable/lib/util/pipeWith').default;

let file = `
# Time

## 07-08-2018 Tuesday

- 8:15 SRM
- 9:00 rocio catchup + resumes
- 11:30 SRM
- 11:50 SRM
- 12:50 SRM (entities and loaders)
- 1:50 SRM (styles)
- 2:50 SRM (header, footer and navigation)
- 3:50 SRM (front page)

## 08-08-2018 Wednesday

- 9:30 start
- 10:30 SRM
- 11:00 interview pre-interview
- 12:00 interview
- 12:45 interview debrief
- 1:00 jordan
- 1:15 SRM
- 2:00 interview post-interview chat
- 2:30 lunch
- 2:50 SRM
- 4:00 SRM
- 5:00 interview
- 6:00 interview post-interview chat

## 09-08-2018 Thursday

- 8:00 start
- 8:20 SRM document search
- 8:40 interview discussion
- 9:15 SRM document search
- 9:45 mitsubishi mocks
- 10:15 standup
- 12:00 mitsubishi mocks 
- 12:15 mitsubishi mocks
- 1:00 lunch
- 1:30 interview candidates chat with paul
- 2:00 towing-guide and computer problems
- 2:50 towing-guide content
- 3:50 mitsubishi mocks / PR reviews / SRM

## 10-08-2018 Friday

- 7:30 start
- 8:00 mitsubishi tweaks and deploy prep
- 8:30 parcels
- 8:50 SRM
- 9:30 SRM
- 10:30 standup + project discussions
- 11:00 mitsubishi tweaks and deploy prep, interview discussion
- 12:00 mitsubishi deploy prep, SRM
- 12:20 interview post-interview chat
- 12:50 SRM
- 1:45 lunch and service discovery chat
- 2:50 SRM
- 3:50 SRM

----------------------------

## 13-08-2018 Monday

- 8:00 start
- 8:30 SRM
- 9:30 SRM
- 10:00 frontend docs
- 10:15 standup
- 10:45 frontend docs discussion
- 11:15 mitsubishi admin fix and learning records pagination
- 11:50 mitsubishi admin fix and learning records pagination
- 12:30 mitsubishi admin fix and learning records pagination
- 1:15 lunch
- 1:40 mitsubishi admin fix
- 2:00 parcels help
- 2:30 mitsubishi admin fix and learning records pagination
- 3:00 SRM
- 3:30 mitsubishi deploy prep
- 3:45 devchat and PDP chat
- 4:00 mitsubishi deploy prep
- 4:20 mitsubishi deploy prep

-------------------

## 14-08-2018 Tuesday

- 7:50 start
- 8:00 mitsubishi screenshots
- 9:15 devcatchup with allan
- 9:50 ?
- 10:50 frontend with paul
- 11:20 frontend discussion
- 11:50 mitsubishi PDP + style
- 12:40 lunch
- 1:10 mitsubishi style
- 1:50 mitsubishi style
- 2:50 mitsubishi PDP + style
- 2:50 mitsubishi PDP + style
- 3:50 mitsubishi PDP + style

## 15-08-2018 Wednesday

- 9:30 start
- 9:50 mitsubishi
- 10:20 standup
- 10:40 mitsubishi testing after style upgraades
- 11:20 frontend discussion
- 12:30 SRM
- 1:10 lunch
- 1:50 SRM
- 2:15 SRM
- 3:05 trc fix and reinstall
- 3:20 interview chat
- 3:35 chekt script
- 3:50 trc fix and reinstall
- 4:30 trc fix

## 16-08-2018 Thursday

- 7:45 start
- 8:20 SRM
- 9:40 SRM
- 10:50 mitsubishi elearning
- 11:30 mitsubishi elearning
- 1:00 mitsubishi pdp chat
- 1:40 lunch
- 2:30 SRM
- 2:45 interview chat
- 3:00 SRM 
- 3:20 cake
- 4:20 SRM

## 17-08-2018 Friday

- 9:00 start
- 9:30 parcels
- 10:30 SRM
- 11:00 frontend discussion
- 11:20 SRM 
- 11:40 SRM
- 1:20 performance review
- 1:30 stand up
- 1:45 frontend discussion
- 2:40 mike lunch pizza
- 3:40 trc + mitsubishi completion + parcels
- 4:40 SRM
- 4:50 tasket

------------------------

## 20-08-2018

- 9:30 start
- 9:45 talking
- 10:00 trc

`;

let tasksByDay = pipeWith(
    file.split("##"),
    map(pipe(
        day => day.split("\n"),
        filter(line => line.slice(0, 2) === "- "),
        map(line => {
            let [time, ...words] = line.slice(2).split(" ");
            let comment = words.join(" ");
            let [hour, minute] = time.split(":");
            hour = parseInt(hour);
            minute = parseInt(minute);

            if(hour < 7) {
                hour += 12;
            }
            let onlyMinutes = (hour * 60) + minute;

            return {
                time,
                hour,
                minute,
                onlyMinutes,
                comment
            };
        }),
        reduce((soFar, item) => {
            let lastItem = last()(soFar);
            soFar.push(item);
            if(lastItem) {
                soFar = pipeWith(
                    soFar,
                    update(
                        -1,
                        pipe(
                            set('from', lastItem.time),
                            set('to', item.time),
                            updateInto('duration', item => item.onlyMinutes - lastItem.onlyMinutes)
                        )
                    )
                );
            }
            return soFar;
        }, []),
        filter(task => task.duration > 0),
    ))
);


let tasks = pipeWith(
    tasksByDay,
    flatMap(identity())
);

console.log("TASKS", tasks);

let find = 'srm';

let total = pipeWith(
    tasks,
    filter(task => task.comment.toLowerCase().indexOf(find) !== -1),
    reduce((total, {duration}) => total + duration, 0)
);

console.log(`Duration of "${find}"`, total / 60);
