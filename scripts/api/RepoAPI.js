import { fetchRepo, fetchRepoArray } from '../utils/APIUtils';

export function getRepo(fullName, url = `repos/${fullName}`) {
  return fetchRepo(url);
}

export function getStarredReposPage(login, url = `users/${login}/starred`) {
  return fetchRepoArray(url);
}
