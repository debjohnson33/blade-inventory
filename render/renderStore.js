const { forwardToMain, replayActionRenderer, getInitialStateRenderer } = require(electron-redux);

const bladeApp = combineReducers(reducers);
const initialState = getInitialStateRenderer();

const store = createStore(
  bladeApp,
  initialState,
  applyMiddleware(
    forwardToMain, // IMPORTANT! This goes first
    ...otherMiddleware,
  ),
);

replayActionRenderer(store);