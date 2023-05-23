import { CharacterColors } from "@/typesConstants/colors";

export async function downloadCharacter(
  characterId: string,
  colors: CharacterColors
) {
  const inputPreview =
    `Character ID: ${characterId}\n\n` + JSON.stringify(colors, null, 2);

  window.alert(inputPreview);
}
