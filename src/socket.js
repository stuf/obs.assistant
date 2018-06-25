import * as U from 'karet.util';
import * as R from 'ramda';
import * as K from 'kefir';
import * as L from 'partial.lenses';

import * as S from './strings';

//

const _socket = U.variable();

const state = U.atom({
  request: {
    lastEvent: undefined,
  },
  response: {
    lastEvent: undefined,
  },
});

export const requestCount =
  U.thru(state,
         U.view(['request', 'lastEvent']),
         U.mapValue(R.always(1)),
         U.foldPast(R.add, 0));

//

export const createSocket = (url = 'ws://10.0.1.2:4444') =>
  K.stream(emitter => {
    const socket = new WebSocket(url);

    socket.onopen = () => emitter.emit(socket);
    socket.onerror = e => emitter.error(e);
    socket.onclose = () => emitter.end();
  });

export const listenTo = U.lift((type, socket) =>
  U.thru(type,
         U.flatMapLatest(R.curryN(2, K.fromEvents)(socket)),
         U.mapValue(L.get(['data', L.json()]))));

//

export const send = (type, args, socket) => {
};
