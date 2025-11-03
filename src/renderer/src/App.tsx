import Router from '@/routes/index';
import { useCommonStore } from '@/stores/useCommonStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookiesProvider } from 'react-cookie';

import OverlayLoading from '@/components/Common/OverlayLoading';

const App = (): React.JSX.Element => {
  const queryClient = new QueryClient();
  const { isVisibleOverlayLoading } = useCommonStore();

  return (
    <CookiesProvider>
      <QueryClientProvider client={queryClient}>
        <div className="App font-sans w-screen h-screen flex flex-col">
          <Router />
          <OverlayLoading visible={isVisibleOverlayLoading} />
        </div>
      </QueryClientProvider>
    </CookiesProvider>
  );
};

export default App;
