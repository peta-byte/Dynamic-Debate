import { Component, OnInit } from '@angular/core';
import { Subscription, timer, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/Operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
    title = 'dynamic-debate';
    start = "Start";
    pause = "Pause";
    startTimerBtn: string;
    timeCounter: number;
    opsSubs: Subscription[] = [];
    playSubs: Subscription[] = [];
    source: Observable<number>;
    pausedOn: number;
    max_secs = 180;
    valFromSub = 0;
    oppositionStand: string;
    propositionStand: string;
    motionDescription: string;
    motionForm: FormGroup;
    tallyPanels: {title: string, value: number} [];
    time = { value: 3, text: "minutes" };
    duration = moment.duration((this.max_secs * 1000), 'milliseconds');
    interval = 1000;
    timeStr = this.duration.seconds() === 0 ? 
        this.duration.minutes() + ":" + this.duration.seconds() + '0' : 
        this.duration.minutes() + ":" + this.duration.seconds();

    constructor(private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.startTimerBtn = this.start;
        this.source = timer(this.interval, this.interval);
        this.pausedOn = 0;
        this.motionForm = new FormGroup({
            proposition: new FormControl('Coffee', [Validators.required, Validators.minLength(3), Validators.pattern(/[a-zA-Z]/)]),
            opposition: new FormControl('Tea', [Validators.required, Validators.minLength(3), Validators.pattern(/[a-zA-Z]/)]),
            motionDesc: new FormControl('Which is better for breakfast?', [Validators.required, Validators.minLength(3), Validators.pattern(/[a-zA-Z]/)])
        });
        this.tallyPanels = [
            {title: 'Proposition Tally', value: 0}, 
            {title: 'Opposition Tally', value: 0 }
        ];
    }

    subscribeToStartTimer(): void {
        this.playSubs.push(
            this.source.pipe(takeUntil(timer(180000))).subscribe((val) => {        
                this.duration = moment.duration((this.duration.asMilliseconds() - this.interval), 'milliseconds');
                this.timeStr = this.duration.seconds() === 0 ? 
                    this.duration.minutes() + ":" + this.duration.seconds() + '0' : 
                    this.duration.minutes() + ":" + this.duration.seconds();
                let valPlusOffset = val + 1;
                this.valFromSub = valPlusOffset;
            })
        );
    }

    subscribeAfterPause(): void {
        let differenceInTimeToEnd = this.max_secs - this.pausedOn;
        let untilMilliSecs = differenceInTimeToEnd * this.interval;
        this.source = timer(undefined, this.interval);
        this.playSubs.push(
            this.source.pipe(takeUntil(timer(untilMilliSecs))).subscribe((val) => {
                this.duration = moment.duration((this.duration.asMilliseconds() - this.interval), 'milliseconds');
                this.timeStr = this.duration.seconds() === 0 ? 
                    this.duration.minutes() + ":" + this.duration.seconds() + '0' : 
                    this.duration.minutes() + ":" + this.duration.seconds();
                ++this.pausedOn;
                this.valFromSub = this.pausedOn;
            })
        );
    }

    onStartTimer(): void {
        if (this.startTimerBtn === "Start") {
            this.startTimerBtn = this.pause;
            if (this.pausedOn === 0 && this.valFromSub === 0) {
                this.snackBar.open('Go!! Watch your minutes.', undefined, {
                    duration: 2000
                });
                this.subscribeToStartTimer();
            } else {
                if (!(this.pausedOn >= this.max_secs) && !(this.valFromSub >= this.max_secs)) {
                    this.subscribeAfterPause();
                } else {
                    let snackBarRef = this.snackBar.open('This turn is over. New Turn?', 'Ok', {
                        duration: 10000,
                    });
                    snackBarRef.onAction().subscribe(() => {
                        this.startTimerBtn = this.start;
                        this.pausedOn = 0;
                        this.valFromSub = 0;
                    });
                }
            }
        } else {
            if (!(this.pausedOn >= this.max_secs) && !(this.valFromSub >= this.max_secs)) {
                this.onPauseTimer();
            } else {
                let snackBarRef = this.snackBar.open('This turn is over. New Turn?', 'Ok', {
                    duration: 10000,
                });
                snackBarRef.onAction().subscribe(() => {
                    this.startTimerBtn = this.start;
                    this.pausedOn = 0;
                    this.valFromSub = 0; 
                });
            }            
        }
    }

    onPauseTimer(): void {
        this.startTimerBtn = this.start;
        this.pausedOn = this.valFromSub;
        if (this.playSubs.length > 0) {
            this.playSubs[0].unsubscribe();
            this.playSubs.shift();
        }
    }

    onStopTimer(): void {
        if (this.playSubs.length > 0) {
            this.playSubs[0].unsubscribe();
            this.playSubs.shift();
        }
        this.pausedOn = 0;
        this.valFromSub = 0;
        this.startTimerBtn = this.start;
        this.time = { value: 3, text: "minutes" };
        this.duration = moment.duration((this.max_secs * 1000), 'milliseconds');
        this.timeStr = this.duration.seconds() === 0 ? 
            this.duration.minutes() + ":" + this.duration.seconds() + '0' : 
            this.duration.minutes() + ":" + this.duration.seconds();
    }

    onSubmit(formValue): void {
        if (formValue) {
            this.oppositionStand = formValue.opposition;
            this.propositionStand = formValue.proposition;
            this.motionDescription = formValue.motionDesc;
        }
    }

    onReset(): void {
        if (this.playSubs.length > 0) {
            this.playSubs.forEach((val) => val.unsubscribe());
            this.playSubs = [];
        }
        if (this.opsSubs.length > 0) {
            this.opsSubs.forEach((val) => val.unsubscribe());
            this.opsSubs = [];
        }
    }

    add(tally: { title: string, value: number}): void {
        if (tally.value !== 100 && tally.value < 100 ) {
            tally.value = tally.value + 10;
        }
    }

    deduct(tally: { title: string, value: number}): void {
        if (tally.value !== 0 && !(tally.value < 0 )) {
            tally.value = tally.value - 10;
        }
    }
}