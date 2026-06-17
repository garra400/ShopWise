import { useEffect, useState } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { hasPexels } from '@/config/integrations';
import { fetchRecipeImage, recipeImageQuery } from '@/services/images';

interface Props {
  /** Recipe's own image URL, if any (e.g. from Spoonacular/Supabase). */
  image?: string;
  /** Recipe title — used to fetch a stock photo when `image` is absent. */
  title: string;
  style?: StyleProp<ViewStyle>;
  /** Icon size for the placeholder. */
  iconSize?: number;
}

/**
 * Renders a recipe photo. Priority: explicit `image` → Pexels lookup by title
 * (when a key is configured) → themed placeholder. Never throws; broken/missing
 * images degrade to the placeholder.
 */
export function RecipeImage({ image, title, style, iconSize = 32 }: Props) {
  const theme = useTheme();
  const [uri, setUri] = useState<string | null>(image ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (image) {
      setUri(image);
      setFailed(false);
      return;
    }
    setUri(null);
    if (!hasPexels) return;
    fetchRecipeImage(recipeImageQuery(title)).then((found) => {
      if (!cancelled && found) setUri(found);
    });
    return () => {
      cancelled = true;
    };
  }, [image, title]);

  const showImage = uri && !failed;

  return (
    <View style={[styles.base, { backgroundColor: theme.backgroundSelected }, style]}>
      {showImage ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          onError={() => setFailed(true)}
        />
      ) : (
        <Ionicons name="restaurant" size={iconSize} color={theme.textSecondary} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
