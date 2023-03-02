import useSwr from "swr";

const endpoint = "/api/character";

async function fetchCharacters(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Server responded with error");
  }

  return response.json() as Promise<unknown>;
}

export default function useCharacterFetcher() {
  return useSwr(endpoint, fetchCharacters);
}
