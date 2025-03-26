/**
 * Interface representing a GitHub repository
 *
 * @public
 */
export interface GitHubRepo {
  /** Repository name */
  name: string;
  /** Repository description (optional) */
  description?: string;
  /** Number of stargazers */
  stargazers_count: number;
  /** URL to the repository */
  html_url: string;
  /** Primary programming language */
  language: string;
  /** Last update timestamp */
  updated_at: string;
}
