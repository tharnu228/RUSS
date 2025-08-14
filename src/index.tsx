import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { ErrorBoundary } from 'react-error-boundary';
import { Provider } from 'react-redux';
import '@/app/styles/reset.scss';
import '@/app/styles/index.scss';
import { ErrorComponent } from '@/shared/ui/ErrorComponent';
import { store } from '@/shared/lib/store';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');

const getBasename = () => {
  if (__IS_DEV__) return '/';

  // 1) из атрибута в index.html
  const ds = document.body?.dataset || {};
  const fromDataset = (ds.publicurl || '').trim(); // <body data-publicurl="RUSS">
  if (fromDataset) return `/${fromDataset}`;

  // 2) запасной вариант — первый сегмент пути (GitHub Pages: /<repo>/...)
  const firstSeg = window.location.pathname.split('/').filter(Boolean)[0] || '';
  return firstSeg ? `/${firstSeg}` : '/';
};

if (!container) {
  throw new Error(
    'Контейнер root не найден. НЕ удалось вмонтировать реакт приложение',
  );
}

const root = createRoot(container);

root.render(
  <BrowserRouter basename={getBasename()}>
    <Provider store={store}>
      <ErrorBoundary fallback={<ErrorComponent />}>
        <App />
      </ErrorBoundary>
    </Provider>
  </BrowserRouter>,
);
