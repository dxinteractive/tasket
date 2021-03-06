// @flow

import get from 'unmutable/lib/get';
import filter from 'unmutable/lib/filter';
import flatMap from 'unmutable/lib/flatMap';
import groupBy from 'unmutable/lib/groupBy';
import has from 'unmutable/lib/has';
import identity from 'unmutable/lib/identity';
import isEmpty from 'unmutable/lib/isEmpty';
import last from 'unmutable/lib/last';
import log from 'unmutable/lib/log';
import map from 'unmutable/lib/map';
import reduce from 'unmutable/lib/reduce';
import reverse from 'unmutable/lib/reverse';
import set from 'unmutable/lib/set';
import sortBy from 'unmutable/lib/sortBy';
import toArray from 'unmutable/lib/toArray';
import update from 'unmutable/lib/update';
import updateInto from 'unmutable/lib/updateInto';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default class Taskfile {

    _tasks: Array<*>;

    constructor(input: string|Arrasy<*>) {

        if(Array.isArray(input)) {
            this._tasks = input;
            return;
        }

        this._tasks = pipeWith(
            input.split("##"),
            map(day => {
                let split = day.split("\n");
                let date = split[0];
                let dateNumber = Taskfile.numberifyDate(date);

                return pipeWith(
                    split,
                    filter(line => line.slice(0, 2) === "- "),
                    map(line => {
                        let [time, category, ...words] = line.slice(2).split(" ");
                        let comment = words.join(" ");
                        let [hour, minute] = time.split(":");
                        hour = parseInt(hour);
                        minute = parseInt(minute);

                        if(hour < 7) {
                            hour += 12;
                        }
                        let onlyMinutes = (hour * 60) + minute;

                        return {
                            date,
                            dateNumber,
                            time,
                            hour,
                            minute,
                            onlyMinutes,
                            category,
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
                    (tasks) => {
                        let arr = [];
                        for(let i = 1; i < tasks.length; i++) {
                            let a = tasks[i-1];
                            let b = tasks[i];

                            if(`${a.category} ${a.comment}` !== `${b.category} ${b.comment}`) {
                                arr.push(tasks[i]);
                            }
                        }
                        return arr;
                    },
                    (tasks) => {
                        let grouped = pipeWith(
                            tasks,
                            groupBy(get('category'))
                        );
                        return tasks.map(task => {
                            task.chunks = grouped[task.category].length;
                            return task;
                        })
                    }
                );
            }),
            flatMap(identity())
        );
    }

    static numberifyDate(date: string): number {
        return parseInt(date.replace(/[^\d]/g, ""));
    }

    static nonWorkCategories = ['start', 'lunch', 'coffee'];

    get tasks() {
        return this._tasks;
    }

    get workTasks() {
        return this._tasks.filter(_ => {
            return Taskfile.nonWorkCategories.indexOf(_.category) === -1
        });
    }

    from(fromDate: ?string) {
        if(!fromDate) {
            return this;
        }
        return new Taskfile(
            this._tasks.filter(task => task.dateNumber >= Taskfile.numberifyDate(fromDate))
        );
    }

    to(toDate: ?string) {
        if(!toDate) {
            return this;
        }
        return new Taskfile(
            this._tasks.filter(task => task.dateNumber < Taskfile.numberifyDate(toDate))
        );
    }

    groupByCategory() {
        return pipeWith(
            this._tasks,
            groupBy(get('category')),
            toArray()
        );
    }

    sumByCategory() {

        let total = pipeWith(
            this._tasks,
            reduce((total, task) => total + task.duration, 0)
        );

        return pipeWith(
            this.groupByCategory(),
            map(tasks => pipeWith(
                tasks,
                reduce((obj, task) => {
                    obj.duration += task.duration;
                    obj.category = task.category;
                    obj.chunks = task.chunks;
                    return obj;
                }, {
                    duration: 0
                }),
                updateInto('durationHours', ({duration}) => duration / 60),
                updateInto('proportion', ({duration}) => duration / total)
            )),
            sortBy(get('duration')),
            reverse()
        );
    }
}