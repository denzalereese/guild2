import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import players from "./pages/players";
import { GlobalState } from "./context/Context";
import { useState } from "react";
import MatchedPlayers from "./pages/MatchedPlayers";

function App() {
  const [matchedPlayers, setMatchedPlayers] = useState([]);

  return (
    <GlobalState.Provider value={{ matchedPlayers, setMatchedPlayers }}>
      <Router>
        <Switch>
          <Route exact path="/" component={players} />
          <Route exact path="/guild" component={MatchedPlayers} />
        </Switch>
      </Router>
    </GlobalState.Provider>
  );
}

export default App;
