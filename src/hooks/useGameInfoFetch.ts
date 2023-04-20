import useSwr from "swr";
import { mockFetchCharacters } from "../components/Editor/editorStateMocks";
import { Character, ClassOrderings } from "@/typesConstants/gameData";

/**
 * The main API response received by the server.
 */
export type ApiResponse = {
  characters: Character[];
  classOrderings: ClassOrderings;
};

const CHARACTERS_ENDPOINT = "/api/characters";

async function fetchCharacters(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Server responded with error");
  }

  return response.json() as Promise<ApiResponse>;
}

export default function useCharacterFetch() {
  return useSwr<ApiResponse, Error>(
    CHARACTERS_ENDPOINT,
    mockFetchCharacters ?? fetchCharacters,
    { errorRetryCount: 3 }
  );
}
