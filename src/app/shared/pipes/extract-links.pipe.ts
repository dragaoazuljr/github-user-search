import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractLinks',
  standalone: true
})
export class ExtractLinksPipe implements PipeTransform {
  transform(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  }
}
