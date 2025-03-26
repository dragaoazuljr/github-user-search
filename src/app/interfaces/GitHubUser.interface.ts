/**
 * Interface representing a GitHub user's profile
 *
 * @public
 */
export interface GitHubUser {
  /** GitHub username */
  login: string;
  /** Full name of the user */
  name: string;
  /** User's bio/description */
  bio: string;
  /** Number of followers */
  followers: number;
  /** Number of users the user is following */
  following: number;
  /** URL of the user's avatar */
  avatar_url: string;
  /** User's location */
  location: string;
  /** User's blog or website URL (optional) */
  blog?: string;
  /** User's Twitter username (optional) */
  twitter_username?: string;
  /** Account creation date */
  created_at: string;
}
