import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { useT } from '@/i18n';

export default function AddMenuScreen() {
  const theme = useTheme();
  const t = useT();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedText style={styles.subtitle} themeColor="textSecondary">
        {t('addmenu.how')}
      </ThemedText>

      <View style={styles.cards}>
        <TouchableOpacity
          onPress={() => router.push('/add/manual')}
          style={[styles.card, { backgroundColor: theme.backgroundElement }]}
          activeOpacity={0.8}
        >
          <View style={[styles.iconWrap, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="create-outline" size={36} color={theme.primary} />
          </View>
          <ThemedText style={styles.cardTitle}>{t('addmenu.manual')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.cardDesc}>
            {t('addmenu.manual.desc')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/add/scan')}
          style={[styles.card, { backgroundColor: theme.backgroundElement }]}
          activeOpacity={0.8}
        >
          <View style={[styles.iconWrap, { backgroundColor: '#2EAD5B20' }]}>
            <Ionicons name="scan-outline" size={36} color="#2EAD5B" />
          </View>
          <ThemedText style={styles.cardTitle}>{t('addmenu.scan')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.cardDesc}>
            {t('addmenu.scan.desc')}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
    alignItems: 'center',
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: Spacing.four,
    marginTop: Spacing.two,
  },
  cards: {
    gap: Spacing.three,
    width: '100%',
    maxWidth: 480,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardDesc: {
    textAlign: 'center',
  },
});
