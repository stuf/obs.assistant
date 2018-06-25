import * as React from 'karet';
import * as U from 'karet.util';

import { Store } from './context';

const App = ({ store }) =>
  <div>
    <Store.Provider value={store}>
      App with store:
      <pre><code>{U.stringify(store, null, 2)}</code></pre>
    </Store.Provider>
  </div>;

export default App;
