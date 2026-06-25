import { View, TextInput, Switch, ScrollView, StyleSheet, Alert, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { useProducts } from '@/context/ProductsContext';
import { useSync } from '@/context/SyncContext';
import { Segmented } from '@/components/Segmented';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { ChipMultiSelect } from '@/components/ChipMultiSelect';
import { IngredientMultiSelect } from '@/components/IngredientMultiSelect';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';
import { DietTag, Allergen, CuisineTag } from '@/types';
import { dietTagEntries, allergenEntries, cuisineEntries } from '@/utils/diet';
import { unitOptions } from '@/utils/units';
import { useT } from '@/i18n';

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <View style={styles.rowControl}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const t = useT();
  const { settings, updateSettings } = useSettings();
  const lang = settings.language === 'en' ? 'en' : 'pt';
  const { reseedProducts, clearProducts } = useProducts();
  const {
    enabled, user, syncing, lastSyncAt, error,
    awaitingConfirmation, pendingEmail,
    signIn, signUp, verifyOtp, resendOtp, cancelConfirmation, signOut, syncNow, deleteAccount,
  } = useSync();

  const UNIT_OPTIONS = useMemo(() => unitOptions(settings.measurementSystem, lang), [settings.measurementSystem, lang]);
  const DIET_TAG_OPTIONS = useMemo(() => dietTagEntries(lang).map(([value, label]) => ({ value, label })), [lang]);
  const ALLERGEN_OPTIONS = useMemo(() => allergenEntries(lang).map(([value, label]) => ({ value, label })), [lang]);
  const CUISINE_OPTIONS = useMemo(() => cuisineEntries(lang).map(([value, label]) => ({ value, label })), [lang]);

  const [syncEmail, setSyncEmail] = useState('');
  const [syncPassword, setSyncPassword] = useState('');
  const [syncCode, setSyncCode] = useState('');
  const [consent, setConsent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  function handleClearProducts() {
    const message = t('settings.clear.confirm');
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(message)) {
        clearProducts();
      }
      return;
    }
    Alert.alert(
      t('settings.clear.title'),
      message,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.clear'), style: 'destructive', onPress: () => clearProducts() },
      ]
    );
  }

  async function handleSignIn() {
    if (!syncEmail.trim() || !syncPassword) return;
    setAuthLoading(true);
    await signIn(syncEmail.trim(), syncPassword);
    setAuthLoading(false);
  }

  async function handleSignUp() {
    if (!syncEmail.trim() || !syncPassword) return;
    if (!consent) {
      const msg = t('account.consentRequired');
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert(t('settings.createAccount'), msg);
      return;
    }
    setAuthLoading(true);
    await signUp(syncEmail.trim(), syncPassword);
    setAuthLoading(false);
  }

  async function handleVerifyOtp() {
    if (!syncCode.trim()) return;
    setAuthLoading(true);
    await verifyOtp(syncCode.trim());
    setAuthLoading(false);
    setSyncCode('');
  }

  async function handleResendOtp() {
    setAuthLoading(true);
    await resendOtp();
    setAuthLoading(false);
  }

  function handleDeleteAccount() {
    const msg = t('account.deleteConfirm');
    const apply = () => { void deleteAccount(); };
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm(msg)) apply();
      return;
    }
    Alert.alert(t('account.deleteTitle'), msg, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.delete'), style: 'destructive', onPress: apply },
    ]);
  }

  function formatLastSync(iso: string | null): string {
    if (!iso) return t('settings.never');
    try {
      const d = new Date(iso);
      return d.toLocaleString(lang === 'en' ? 'en-US' : 'pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Appearance */}
      <ThemedText style={styles.sectionTitle}>{t('settings.appearance')}</ThemedText>
      <ThemedView type="backgroundElement" style={styles.section}>
        <SettingRow label={t('settings.theme')}>
          <Segmented
            options={[
              { label: t('settings.theme.system'), value: 'system' },
              { label: t('settings.theme.light'), value: 'light' },
              { label: t('settings.theme.dark'), value: 'dark' },
            ]}
            value={settings.themePreference}
            onChange={(v) => updateSettings({ themePreference: v as 'system' | 'light' | 'dark' })}
          />
        </SettingRow>
      </ThemedView>

      {/* Preferences */}
      <ThemedText style={styles.sectionTitle}>{t('settings.preferences')}</ThemedText>
      <ThemedView type="backgroundElement" style={styles.section}>
        <SettingRow label={t('settings.notifications')}>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(v) => updateSettings({ notificationsEnabled: v })}
            trackColor={{ true: theme.primary }}
          />
        </SettingRow>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow label={t('settings.language')}>
          <Segmented
            options={[
              { label: 'Português', value: 'pt' },
              { label: 'English', value: 'en' },
            ]}
            value={settings.language}
            onChange={(v) => updateSettings({ language: v as 'pt' | 'en' })}
          />
        </SettingRow>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow label={t('settings.units')}>
          <Segmented
            options={[
              { label: t('settings.units.metric'), value: 'metric' },
              { label: t('settings.units.imperial'), value: 'imperial' },
            ]}
            value={settings.measurementSystem}
            onChange={(v) => {
              const sys = v as 'metric' | 'imperial';
              const valid = unitOptions(sys, lang).map((o) => o.value);
              updateSettings({
                measurementSystem: sys,
                ...(valid.includes(settings.defaultUnit) ? {} : { defaultUnit: 'un' }),
              });
            }}
          />
        </SettingRow>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow label={t('settings.defaultUnit')}>
          <Select
            options={UNIT_OPTIONS}
            value={settings.defaultUnit}
            onChange={(v) => updateSettings({ defaultUnit: v })}
          />
        </SettingRow>
      </ThemedView>

      {/* Diet & Allergies */}
      <ThemedText style={styles.sectionTitle}>{t('settings.dietAllergies')}</ThemedText>
      <ThemedView type="backgroundElement" style={styles.section}>
        {/* Diet tag chips */}
        <ThemedText style={styles.subLabel}>{t('settings.dietPrefs')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          {t('settings.dietPrefs.hint')}
        </ThemedText>
        <ChipMultiSelect<DietTag>
          options={DIET_TAG_OPTIONS}
          values={settings.dietTags}
          onChange={(v) => updateSettings({ dietTags: v })}
        />

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Allergen chips */}
        <ThemedText style={styles.subLabel}>{t('settings.allergens')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          {t('settings.allergens.hint')}
        </ThemedText>
        <ChipMultiSelect<Allergen>
          options={ALLERGEN_OPTIONS}
          values={settings.allergens}
          onChange={(v) => updateSettings({ allergens: v })}
        />

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Avoid ingredients */}
        <ThemedText style={styles.subLabel}>{t('settings.avoid')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          {t('settings.avoid.hint')}
        </ThemedText>
        <IngredientMultiSelect
          values={settings.avoidIngredients}
          onChange={(v) => updateSettings({ avoidIngredients: v })}
        />

      </ThemedView>

      {/* Cuisines */}
      <ThemedText style={styles.sectionTitle}>{t('settings.cuisines')}</ThemedText>
      <ThemedView type="backgroundElement" style={styles.section}>
        <ThemedText style={styles.subLabel}>{t('settings.cuisines.label')}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          {t('settings.cuisines.hint')}
        </ThemedText>
        <ChipMultiSelect<CuisineTag>
          options={CUISINE_OPTIONS}
          values={settings.cuisines}
          onChange={(v) => updateSettings({ cuisines: v })}
        />
      </ThemedView>

      {/* Cloud sync / account */}
      <ThemedText style={styles.sectionTitle}>{t('settings.account')}</ThemedText>

      {!enabled && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText style={styles.subLabel}>{t('settings.cloud')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
            {t('settings.cloud.intro')}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('settings.cloud.step1')}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('settings.cloud.step2')}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('settings.cloud.step3')}
          </ThemedText>
          <ThemedText type="small" style={[styles.codeBlock, { backgroundColor: theme.backgroundElement, color: theme.text }]}>
            {'EXPO_PUBLIC_SUPABASE_URL=...\nEXPO_PUBLIC_SUPABASE_ANON_KEY=...'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t('settings.cloud.note')}
          </ThemedText>
        </ThemedView>
      )}

      {/* Email confirmation (OTP) step */}
      {enabled && !user && awaitingConfirmation && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText style={styles.subLabel}>{t('account.otpTitle')}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
            {t('account.otpHint', { email: pendingEmail ?? '' })}
          </ThemedText>
          {!!error && (
            <ThemedText type="small" style={[styles.errorText, { color: '#D64545' }]}>
              {error}
            </ThemedText>
          )}
          <TextInput
            style={[
              styles.authInput,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border, letterSpacing: 4 },
            ]}
            placeholder={t('account.otpPlaceholder')}
            placeholderTextColor={theme.textSecondary}
            value={syncCode}
            onChangeText={setSyncCode}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            editable={!authLoading}
          />
          <Button
            title={t('account.otpConfirm')}
            onPress={handleVerifyOtp}
            loading={authLoading}
            disabled={!syncCode.trim()}
          />
          <View style={styles.authButtons}>
            <Button title={t('account.otpResend')} onPress={handleResendOtp} variant="secondary" disabled={authLoading} style={styles.authButton} />
            <Button title={t('common.cancel')} onPress={cancelConfirmation} variant="secondary" disabled={authLoading} style={styles.authButton} />
          </View>
        </ThemedView>
      )}

      {/* Sign in / create account */}
      {enabled && !user && !awaitingConfirmation && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <ThemedText style={styles.subLabel}>{t('settings.signin')}</ThemedText>
          {!!error && (
            <ThemedText type="small" style={[styles.errorText, { color: '#D64545' }]}>
              {error}
            </ThemedText>
          )}
          <TextInput
            style={[
              styles.authInput,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder={t('settings.email')}
            placeholderTextColor={theme.textSecondary}
            value={syncEmail}
            onChangeText={setSyncEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!authLoading}
          />
          <TextInput
            style={[
              styles.authInput,
              { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
            ]}
            placeholder={t('settings.password')}
            placeholderTextColor={theme.textSecondary}
            value={syncPassword}
            onChangeText={setSyncPassword}
            secureTextEntry
            autoComplete="password"
            editable={!authLoading}
          />

          {/* LGPD consent — required to create an account */}
          <TouchableOpacity style={styles.consentRow} onPress={() => setConsent((v) => !v)} activeOpacity={0.7}>
            <Ionicons
              name={consent ? 'checkbox' : 'square-outline'}
              size={22}
              color={consent ? theme.primary : theme.textSecondary}
            />
            <ThemedText type="small" themeColor="textSecondary" style={styles.consentText}>
              {t('account.consent')}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.authButtons}>
            <Button
              title={t('settings.enter')}
              onPress={handleSignIn}
              loading={authLoading}
              disabled={!syncEmail.trim() || !syncPassword}
              style={styles.authButton}
            />
            <Button
              title={t('settings.createAccount')}
              onPress={handleSignUp}
              variant="secondary"
              loading={authLoading}
              disabled={!syncEmail.trim() || !syncPassword || !consent}
              style={styles.authButton}
            />
          </View>

          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
            {t('account.privacyNote')}
          </ThemedText>
        </ThemedView>
      )}

      {enabled && !!user && (
        <ThemedView type="backgroundElement" style={styles.section}>
          <View style={styles.row}>
            <ThemedText style={styles.rowLabel}>{t('settings.accountLabel')}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
              {user.email ?? user.id}
            </ThemedText>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.row}>
            <ThemedText style={styles.rowLabel}>{t('settings.lastSync')}</ThemedText>
            <View style={styles.rowControl}>
              {syncing ? (
                <ActivityIndicator size="small" color={theme.primary} />
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  {formatLastSync(lastSyncAt)}
                </ThemedText>
              )}
            </View>
          </View>
          {!!error && (
            <ThemedText type="small" style={[styles.errorText, { color: '#D64545' }]}>
              {error}
            </ThemedText>
          )}
          <Button
            title={t('settings.syncNow')}
            onPress={syncNow}
            loading={syncing}
            disabled={syncing}
          />
          <Button
            title={t('settings.signout')}
            onPress={signOut}
            variant="secondary"
            disabled={syncing}
          />
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <Button
            title={t('account.delete')}
            onPress={handleDeleteAccount}
            variant="danger"
            disabled={syncing}
          />
        </ThemedView>
      )}

      {/* Data management */}
      <ThemedText style={styles.sectionTitle}>{t('settings.data')}</ThemedText>
      <View style={styles.dataButtons}>
        <Button
          title={t('settings.data.reseed')}
          onPress={reseedProducts}
          variant="secondary"
        />
        <Button
          title={t('settings.data.clear')}
          onPress={handleClearProducts}
          variant="danger"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.two,
    maxWidth: 800,
    width: '100%',
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
    opacity: 0.6,
  },
  subLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  hint: {
    marginBottom: Spacing.two,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  consentText: {
    flex: 1,
    lineHeight: 18,
  },
  section: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 0,
  },
  rowControl: {
    flex: 1,
    alignItems: 'flex-end',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.one,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    minHeight: 80,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  dataButtons: {
    gap: Spacing.two,
    marginBottom: Spacing.six,
  },
  codeBlock: {
    fontFamily: 'monospace',
    borderRadius: Spacing.one,
    padding: Spacing.two,
    marginVertical: Spacing.one,
    fontSize: 12,
  },
  errorText: {
    fontSize: 14,
  },
  authInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.two,
    fontSize: 16,
    height: 48,
  },
  authButtons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  authButton: {
    flex: 1,
  },
});
