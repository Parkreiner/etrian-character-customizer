import useSwr from "swr";
import { mockFetchCharacters } from "./editorStateMocks";
import { ApiResponse } from "./localTypes";

const CHARACTERS_ENDPOINT = "/api/characters";

async function fetchCharacters(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Server responded with error");
  }

  return response.json() as Promise<ApiResponse>;
}

type OnSuccessCallback = (data: ApiResponse) => void;

export default function useCharacterFetch(onSuccess: OnSuccessCallback) {
  return useSwr<ApiResponse, Error>(
    CHARACTERS_ENDPOINT,
    mockFetchCharacters ?? fetchCharacters,
    { onSuccess, errorRetryCount: 3 }
  );
}
