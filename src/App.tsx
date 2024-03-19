import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/home'));
const DirectoryContents = lazy(() => import('./pages/contents'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading . . .</div>}>
        <Routes>
          <Route path='/' Component={Home} />
          <Route path='/app/*' Component={DirectoryContents} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
