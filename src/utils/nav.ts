import { router } from 'expo-router';

/**
 * Navigate back safely. When a screen is opened via a deep link it may have no
 * navigation history; in that case fall back to the home tab instead of emitting
 * a "GO_BACK was not handled" warning.
 */
export function goBack() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}
