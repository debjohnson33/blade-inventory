const { forwardToRenderer, triggerAlias, replayActionMain } = require(electron-redux);

const bladeApp = combineReducers(reducers);

const store = createStore(
  bladeApp,
  initialState, // optional
  applyMiddleware(
    triggerAlias, // optional, see below
    ...otherMiddleware,
    forwardToRenderer, // IMPORTANT! This goes last
  ),
);

replayActionMain(store);