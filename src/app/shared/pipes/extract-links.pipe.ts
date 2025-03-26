import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe for extracting URLs from a given text
 * 
 * @remarks
 * Uses a regular expression to find and extract HTTP/HTTPS URLs
 * 
 * @public
 */
@Pipe({
  name: 'extractLinks',
  standalone: true
})
export class ExtractLinksPipe implements PipeTransform {
  /**
   * Extracts URLs from the input text
   * 
   * @param text - Input text to extract URLs from
   * @returns Array of URLs found in the text
   * @public
   */
  transform(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  }
}
