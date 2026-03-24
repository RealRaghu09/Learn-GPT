import { AppShell } from './components/layout/AppShell'
import { DataProvider } from './components/context/dataContext';
function App() {
  return (
    <div>
      <DataProvider>
            <AppShell/>
      </DataProvider>
    </div>
  );
}

export default App
