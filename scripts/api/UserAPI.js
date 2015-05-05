import { fetchUser, fetchUserArray } from '../utils/APIUtils';

export function getUser(login, url = `users/${login}`) {
  return fetchUser(url);
}

export function getStargazerPage(
  fullName,
  url = `repos/${fullName}/stargazers`
) {
  return fetchUserArray(url);
}
