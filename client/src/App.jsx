import { Suspense } from 'react';
import { EthProvider } from "./contexts/EthContext";
import { Outlet } from 'react-router-dom';
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import styles from "./App.module.scss";

// Imports des CSS
import 'primeicons/primeicons.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/themes/luna-pink/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import './../../client/src/asset/styles/primefaces/button.scss';


function App() {

  return (
    <EthProvider>
      <div className={`d-flex flex-column ${styles.appContainer}`}>
        <Header />
        <div className="flex-fill d-flex flex-column">
          <Suspense>
            <Outlet />
          </Suspense>
        </div>
        <Footer />
      </div>
    </EthProvider>
  );
}

export default App;