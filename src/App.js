import React, { lazy, Suspense } from 'react'
import './css/App.scss'
import './css/Footer.scss'
import './css/qr.scss'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import Navbar from './Navbar';
import Home from './Home/Home';
import Restaurant from './Restaurant/Restaurants';
import Menus from './Menu/Menus';
import NotFound from './notFound/NotFound';
import ScrollToTop from './ScrollToTop';
import PageHead from './seo/PageHead';
import Qr from './qr/Qr';
import QrNew from './qrNew/QrNew'
import { basename } from './language';

const Pedidos = lazy(() => import('./pedidos/Pedidos'))
const Reservar = lazy(() => import('./reservar/Reservar'))

function App() {
  console.log('Made by Lukasz Maraj')
  return (
    <BrowserRouter basename={basename}>
      <div className="App">
        <ScrollToTop />
        <PageHead />
        <Routes>
          <Route element={<><Navbar /><Suspense fallback={null}><Outlet /></Suspense></>}>
            <Route path='/' element={<Home />} />
            <Route path='/restaurant' element={<Restaurant />} />
            <Route path='/menu' element={<Menus />} />
            <Route path='/pedidos' element={<Pedidos />} />
            <Route path='/reservar' element={<Reservar />} />
            <Route path='*' element={<NotFound />} />
          </Route>
          {/* The QR codes on the tables open these, without the navbar */}
          <Route path='/qr' element={<Qr />} />
          <Route path='/qr-new' element={<QrNew />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
