import { useState, useEffect } from 'react';
import BettingSlip from './components/BettingSlip';

// Team lists for different leagues
const sportTeams = {
  MLB: [
    "Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox",
    "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians",
    "Colorado Rockies", "Detroit Tigers", "Houston Astros", "Kansas City Royals",
    "Los Angeles Angels", "Los Angeles Dodgers", "Miami Marlins", "Milwaukee Brewers",
    "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Athletics",
    "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants",
    "Seattle Mariners", "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers",
    "Toronto Blue Jays", "Washington Nationals"
  ],
  NFL: [
    "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
    "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
    "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
    "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
    "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
    "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
    "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
    "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
  ],
  NBA: [
    "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets",
    "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets",
    "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers",
    "LA Clippers", "Los Angeles Lakers", "Memphis Grizzlies", "Miami Heat",
    "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks",
    "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns",
    "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors",
    "Utah Jazz", "Washington Wizards"
  ],
  NHL: [
    "Anaheim Ducks", "Arizona Coyotes", "Boston Bruins", "Buffalo Sabres",
    "Calgary Flames", "Carolina Hurricanes", "Chicago Blackhawks", "Colorado Avalanche",
    "Columbus Blue Jackets", "Dallas Stars", "Detroit Red Wings", "Edmonton Oilers",
    "Florida Panthers", "Los Angeles Kings", "Minnesota Wild", "Montreal Canadiens",
    "Nashville Predators", "New Jersey Devils", "New York Islanders", "New York Rangers",
    "Ottawa Senators", "Philadelphia Flyers", "Pittsburgh Penguins", "San Jose Sharks",
    "Seattle Kraken", "St. Louis Blues", "Tampa Bay Lightning", "Toronto Maple Leafs",
    "Vancouver Canucks", "Vegas Golden Knights", "Washington Capitals", "Winnipeg Jets"
  ]
};

// Common player names for player props
const commonPlayers = {
  MLB: ["Aaron Judge", "Shohei Ohtani", "Juan Soto", "Bryce Harper", "Mike Trout", "Ronald Acuña Jr."],
  NFL: ["Patrick Mahomes", "Travis Kelce", "Lamar Jackson", "Justin Jefferson", "Christian McCaffrey", "CeeDee Lamb"],
  NBA: ["LeBron James", "Nikola Jokic", "Giannis Antetokounmpo", "Luka Doncic", "Stephen Curry", "Kevin Durant"],
  NHL: ["Connor McDavid", "Nathan MacKinnon", "Sidney Crosby", "Auston Matthews", "David Pastrnak", "Leon Draisaitl"]
};

// Stats for player props by sport
const statsByLeague = {
  MLB: ["HITS", "HOME RUNS", "STRIKEOUTS", "RBIs", "STOLEN BASES"],
  NFL: ["PASSING YARDS", "RUSHING YARDS", "RECEIVING YARDS", "TOUCHDOWNS", "COMPLETIONS"],
  NBA: ["POINTS", "REBOUNDS", "ASSISTS", "STEALS", "BLOCKS"],
  NHL: ["GOALS", "ASSISTS", "SHOTS", "SAVES", "POINTS"]
};

function App() {
  const [betType, setBetType] = useState<string>("MONEY LINE");
  const [league, setLeague] = useState<string>("MLB");
  const [team1, setTeam1] = useState<string>("");
  const [team2, setTeam2] = useState<string>("");
  const [playerName, setPlayerName] = useState<string>("");
  const [betAmount, setBetAmount] = useState<number>(5.00);
  const [odds, setOdds] = useState<string>("+163");
  const [spreadValue, setSpreadValue] = useState<string>("+1.5");
  const [overUnder, setOverUnder] = useState<string>("OVER");
  const [totalPoints, setTotalPoints] = useState<string>("8.5");
  const [statType, setStatType] = useState<string>("HITS");
  
  const [market, setMarket] = useState<string>("");
  const [toWinAmount, setToWinAmount] = useState<number>(13.16);

  // Set default values when form loads
  useEffect(() => {
    // Set initial team values
    if (sportTeams[league as keyof typeof sportTeams].length > 0) {
      const initialTeam = sportTeams[league as keyof typeof sportTeams][0];
      setTeam1(initialTeam);
      
      // Immediately update market when team1 changes
      if (betType === "MONEY LINE") {
        setMarket(initialTeam);
      } else if (betType === "SPREAD") {
        setMarket(`${initialTeam} ${spreadValue}`);
      }
    }
    
    if (sportTeams[league as keyof typeof sportTeams].length > 1) {
      setTeam2(sportTeams[league as keyof typeof sportTeams][1]);
    }
    
    // For player props, set a default player name based on league if empty
    if (betType === "PLAYER PROP" && (!playerName || playerName === '')) {
      // Set default player names by league
      const defaultPlayers = {
        MLB: "Aaron Judge",
        NFL: "Patrick Mahomes",
        NBA: "LeBron James", 
        NHL: "Connor McDavid"
      };
      setPlayerName(defaultPlayers[league as keyof typeof defaultPlayers] || "");
    }
    
    if (statsByLeague[league as keyof typeof statsByLeague].length > 0) {
      setStatType(statsByLeague[league as keyof typeof statsByLeague][0]);
    }
    
    // Update stat type if sport changes when in player prop mode
    if (betType === "PLAYER PROP") {
      setStatType(statsByLeague[league as keyof typeof statsByLeague][0]);
    }
  }, [league, betType, playerName]);

  // Update market value when bet type changes
  useEffect(() => {
    updateMarket();
  }, [betType, team1, team2, playerName, spreadValue, overUnder, totalPoints, statType]);

  const updateMarket = () => {
    let newMarket = "";
    switch (betType) {
      case "MONEY LINE":
        newMarket = team1;
        break;
      case "SPREAD":
        newMarket = `${team1} ${spreadValue}`;
        break;
      case "TOTAL POINTS":
        newMarket = `${team1}@${team2} ${overUnder} ${totalPoints}`;
        break;
      case "PLAYER PROP":
        newMarket = `${playerName} ${overUnder} ${totalPoints} ${statType}`;
        break;
      default:
        newMarket = team1;
    }
    console.log('Setting market:', { betType, newMarket });
    setMarket(newMarket);
  };

  // Calculate win amount based on bet amount and odds
  useEffect(() => {
    if (odds.startsWith("+")) {
      // Positive odds - calculate profit + original bet amount for total return
      const oddsValue = parseInt(odds.slice(1));
      const profit = (betAmount * oddsValue) / 100;
      setToWinAmount(parseFloat((profit + betAmount).toFixed(2)));
    } else if (odds.startsWith("-")) {
      // Negative odds - calculate profit + original bet amount for total return
      const oddsValue = parseInt(odds.slice(1));
      const profit = (betAmount * 100) / oddsValue;
      setToWinAmount(parseFloat((profit + betAmount).toFixed(2)));
    }
  }, [betAmount, odds]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Form controls - Fixed width and scrollable */}
      <div className="w-[300px] bg-white min-h-screen overflow-y-auto shadow-md flex-shrink-0 z-10 relative">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Customize Your Betting Slip</h2>
          
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-medium">League</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded"
              value={league}
              onChange={(e) => setLeague(e.target.value)}
            >
              <option value="MLB">MLB</option>
              <option value="NFL">NFL</option>
              <option value="NBA">NBA</option>
              <option value="NHL">NHL</option>
            </select>
          </div>
          
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-medium">Bet Type</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded"
              value={betType}
              onChange={(e) => setBetType(e.target.value)}
            >
              <option value="MONEY LINE">Money Line</option>
              <option value="SPREAD">Spread</option>
              <option value="TOTAL POINTS">Total Points</option>
              <option value="PLAYER PROP">Player Prop</option>
            </select>
          </div>
          
          {/* Conditional fields based on bet type */}
          {betType === "MONEY LINE" && (
            <div className="mb-5">
              <label className="block text-gray-700 mb-2 font-medium">Team</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
              >
                {sportTeams[league as keyof typeof sportTeams].map((team) => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </select>
            </div>
          )}
          
          {betType === "SPREAD" && (
            <>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Team</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                >
                  {sportTeams[league as keyof typeof sportTeams].map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Spread</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={spreadValue}
                  onChange={(e) => setSpreadValue(e.target.value)}
                  placeholder="+1.5"
                />
              </div>
            </>
          )}
          
          {betType === "TOTAL POINTS" && (
            <>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Away Team</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={team1}
                  onChange={(e) => setTeam1(e.target.value)}
                >
                  {sportTeams[league as keyof typeof sportTeams].map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Home Team</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={team2}
                  onChange={(e) => setTeam2(e.target.value)}
                >
                  {sportTeams[league as keyof typeof sportTeams].map((team) => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Over/Under</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={overUnder}
                  onChange={(e) => setOverUnder(e.target.value)}
                >
                  <option value="OVER">OVER</option>
                  <option value="UNDER">UNDER</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Total</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={totalPoints}
                  onChange={(e) => setTotalPoints(e.target.value)}
                  placeholder="8.5"
                />
              </div>
            </>
          )}
          
          {betType === "PLAYER PROP" && (
            <>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Player</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter player name"
                />
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Stat</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={statType}
                  onChange={(e) => setStatType(e.target.value)}
                >
                  {statsByLeague[league as keyof typeof statsByLeague].map((stat) => (
                    <option key={stat} value={stat}>{stat}</option>
                  ))}
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Over/Under</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={overUnder}
                  onChange={(e) => setOverUnder(e.target.value)}
                >
                  <option value="OVER">OVER</option>
                  <option value="UNDER">UNDER</option>
                </select>
              </div>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 font-medium">Number</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={totalPoints}
                  onChange={(e) => setTotalPoints(e.target.value)}
                  placeholder="1.5"
                />
              </div>
            </>
          )}
          
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-medium">Bet Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">$</span>
              <input 
                type="number" 
                className="w-full p-2 pl-7 border border-gray-300 rounded"
                value={betAmount}
                onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
                step="0.01"
                min="0.01"
              />
            </div>
          </div>
          
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-medium">Odds</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              placeholder="+163"
            />
            <p className="text-sm text-gray-500 mt-1">Format: +100 or -110</p>
          </div>
        </div>
      </div>
      
      {/* Preview section - Flexible width */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <BettingSlip 
          key={`${betType}-${market}-${league}-${odds}`}
          market={market}
          betType={betType}
          league={league}
          date={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          odds={odds}
          betAmount={betAmount}
          toWinAmount={toWinAmount}
        />
      </div>
    </div>
  );
}

export default App;
