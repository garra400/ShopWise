import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface ScreenContainerProps extends ViewProps {
  scrollable?: boolean;
  padBottom?: boolean;
}

export function ScreenContainer({
  children,
  style,
  scrollable = true,
  padBottom = true,
  ...rest
}: ScreenContainerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const content = (
    <View
      style={[
        styles.inner,
        { paddingBottom: padBottom ? insets.bottom + Spacing.four : 0 },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.scroll, { backgroundColor: theme.background }]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    padding: Spacing.three,
    alignSelf: 'center',
  },
});
