import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'match',
  standalone: true
})
export class MatchPipe implements PipeTransform {
  transform(text: string, pattern: string): boolean {
    const regex = new RegExp(pattern);
    return regex.test(text);
  }
}
