import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import store from './../src/store/store.js';
import { Toaster } from './components/ui/toaster'; // Import Toaster here

// Render the root component
createRoot(document.getElementById('root')).render(
  <Provider store={store}> {/* Wrap the app with Redux Provider */}
    <BrowserRouter> {/* Enable routing */}
      <App /> {/* Main application component */}
      <Toaster /> {/* Toaster for showing notifications */}
    </BrowserRouter>
  </Provider>
);
