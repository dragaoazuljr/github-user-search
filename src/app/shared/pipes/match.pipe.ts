import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe for testing if a text matches a given regular expression pattern
 * 
 * @remarks
 * Allows testing text against a regex pattern in templates
 * 
 * @public
 */
@Pipe({
  name: 'match',
  standalone: true
})
export class MatchPipe implements PipeTransform {
  /**
   * Tests if the input text matches the given regex pattern
   * 
   * @param text - Input text to test
   * @param pattern - Regular expression pattern to match against
   * @returns Boolean indicating whether the text matches the pattern
   * @public
   */
  transform(text: string, pattern: string): boolean {
    const regex = new RegExp(pattern);
    return regex.test(text);
  }
}
