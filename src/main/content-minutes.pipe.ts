import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'minutesPipe'})
export class ContentMinutesPipe implements PipeTransform {
  transform(time: { value: number, text: string }): string {
    if (time && time.value === 1) {
      time.text = 'minute';
    }
    return time.text;
  }
}