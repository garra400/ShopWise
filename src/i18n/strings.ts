export type Lang = 'pt' | 'en';

/**
 * UI string dictionary. Keys are dot-namespaced by screen/area.
 * Recipe CONTENT (titles/instructions) is translated separately in the recipe data.
 */
export const STRINGS: Record<Lang, Record<string, string>> = {
  pt: {
    // Tabs
    'tab.pantry': 'Despensa',
    'tab.expiring': 'Para vencer',
    'tab.recipes': 'Receitas',
    'tab.settings': 'Config',

    // Common
    'common.edit': 'Editar',
    'common.back': 'Voltar',
    'common.cancel': 'Cancelar',
    'common.loading': 'Carregando...',
    'common.add': 'Adicionar',

    // Settings
    'settings.appearance': 'Aparência',
    'settings.theme': 'Tema',
    'settings.theme.system': 'Sistema',
    'settings.theme.light': 'Claro',
    'settings.theme.dark': 'Escuro',
    'settings.preferences': 'Preferências',
    'settings.notifications': 'Notificações',
    'settings.language': 'Idioma',
    'settings.units': 'Unidades',
    'settings.units.metric': 'Métrico',
    'settings.units.imperial': 'Imperial',
    'settings.defaultUnit': 'Unidade padrão',
    'settings.dietAllergies': 'Dieta e Alergias',
    'settings.dietPrefs': 'Preferências de dieta',
    'settings.dietPrefs.hint': 'Selecione as dietas que deseja seguir. As receitas serão filtradas de acordo.',
    'settings.allergens': 'Alérgenos a evitar',
    'settings.allergens.hint': 'Receitas com os alérgenos selecionados serão removidas da lista.',
    'settings.avoid': 'Ingredientes que você evita',
    'settings.avoid.hint': 'Receitas que usam estes ingredientes não vão aparecer (ex: coentro, cebola).',
    'settings.cuisines': 'Cozinhas favoritas',
    'settings.cuisines.label': 'Nacionalidades das receitas',
    'settings.cuisines.hint': 'Suas cozinhas favoritas aparecem primeiro nas sugestões (não escondem as outras).',
    'settings.account': 'Conta e Sincronização',
    'settings.data': 'Dados',
    'settings.data.reseed': 'Restaurar dados de exemplo',
    'settings.data.clear': 'Limpar todos os produtos',
  },
  en: {
    // Tabs
    'tab.pantry': 'Pantry',
    'tab.expiring': 'Expiring',
    'tab.recipes': 'Recipes',
    'tab.settings': 'Settings',

    // Common
    'common.edit': 'Edit',
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.loading': 'Loading...',
    'common.add': 'Add',

    // Settings
    'settings.appearance': 'Appearance',
    'settings.theme': 'Theme',
    'settings.theme.system': 'System',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.preferences': 'Preferences',
    'settings.notifications': 'Notifications',
    'settings.language': 'Language',
    'settings.units': 'Units',
    'settings.units.metric': 'Metric',
    'settings.units.imperial': 'Imperial',
    'settings.defaultUnit': 'Default unit',
    'settings.dietAllergies': 'Diet & Allergies',
    'settings.dietPrefs': 'Diet preferences',
    'settings.dietPrefs.hint': 'Select the diets you follow. Recipes will be filtered accordingly.',
    'settings.allergens': 'Allergens to avoid',
    'settings.allergens.hint': 'Recipes containing the selected allergens will be removed from the list.',
    'settings.avoid': 'Ingredients you avoid',
    'settings.avoid.hint': 'Recipes using these ingredients will not appear (e.g. cilantro, onion).',
    'settings.cuisines': 'Favorite cuisines',
    'settings.cuisines.label': 'Recipe nationalities',
    'settings.cuisines.hint': 'Your favorite cuisines appear first in suggestions (others are not hidden).',
    'settings.account': 'Account & Sync',
    'settings.data': 'Data',
    'settings.data.reseed': 'Restore sample data',
    'settings.data.clear': 'Clear all products',
  },
};
