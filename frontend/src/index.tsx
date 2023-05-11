import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import ResultsContext from 'context';
import App from './App'

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <ResultsContext>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ResultsContext>
);