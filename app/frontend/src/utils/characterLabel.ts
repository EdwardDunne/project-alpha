import { Character } from "../types"

// Character names are only unique per-publisher (the same name can exist at
// two different publishers), so every display of a character needs the
// publisher alongside it to disambiguate - e.g. "Batman (DC)". Strips a
// trailing "Comics" since publisher names are stored as "DC Comics"/"Marvel
// Comics" but the shorter form reads better next to a character name.
export function characterLabel(character: Character): string {
    const publisher = character.publisher_name.replace(/\s*Comics$/, "")
    return `${character.name} (${publisher})`
}
