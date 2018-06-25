import * as React from 'karet';
import ReactDOM from 'react-dom';
import * as U from 'karet.util';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import createStore from './store';

const store = createStore();

window.store = store;

store.log('store');

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();
