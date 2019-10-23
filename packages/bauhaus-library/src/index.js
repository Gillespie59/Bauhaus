import { ApplicationContext } from 'js/context';
export { default as BackToTop } from './back-to-top';
export { default as Badge } from './badge';
export { default as Flag } from './flag';
export { default as Input } from './input';
export { default as PageTitle } from './page-title';
export { default as PageSubtitle } from './page-subtitle';

export { default as Pagination } from './pagination';
export { default as Panel } from './panel';
export { default as Radio } from './radio';
export { default as SearchRmes } from './search-rmes';
export { default as Select } from './select';
export { default as Spinner } from './spinner';
export { default as I18NContext } from './i18n-provider';

export function getApplicationContext() {
	return ApplicationContext;
}
