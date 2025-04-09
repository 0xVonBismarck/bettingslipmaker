import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { toPng } from 'html-to-image';

export interface BettingSlipProps {
  market: string;
  betType: string;
  league?: string;
  date?: string;
  odds: string;
  betAmount: number;
  toWinAmount: number;
  autoCapture?: boolean;
}

// Sport-specific colors
const leagueColors = {
  MLB: { bg: '#EBF5FF', text: '#1E40AF' },  // blue
  NFL: { bg: '#ECFDF5', text: '#065F46' },  // green
  NBA: { bg: '#FEF2F2', text: '#B91C1C' },  // red
  NHL: { bg: '#F5F3FF', text: '#5B21B6' }   // purple
};

// Helper function to get team nickname only
const getTeamNickname = (fullTeamName: string): string => {
  // Special cases for multi-word nicknames
  if (fullTeamName === "Boston Red Sox") return "Red Sox";
  if (fullTeamName === "Chicago White Sox") return "White Sox";
  if (fullTeamName === "Toronto Blue Jays") return "Blue Jays";
  if (fullTeamName === "Tampa Bay Rays") return "Rays";
  if (fullTeamName === "San Francisco Giants") return "Giants";
  if (fullTeamName === "San Diego Padres") return "Padres";
  if (fullTeamName === "New York Yankees") return "Yankees";
  if (fullTeamName === "New York Mets") return "Mets";
  if (fullTeamName === "Los Angeles Dodgers") return "Dodgers";
  if (fullTeamName === "Los Angeles Angels") return "Angels";
  if (fullTeamName === "Kansas City Royals") return "Royals";
  
  // Default behavior: get the last word
  const parts = fullTeamName.split(' ');
  return parts.length > 1 ? parts[parts.length - 1] : fullTeamName;
};

// Get team initials (3-letter codes like HOU, DEN, LAL)
const getTeamInitials = (teamName: string): string => {
  // Try to find the team code from our mapping
  const normalized = teamName.trim();
  
  // Check if there's a direct match in teamCodes
  for (const [league, teams] of Object.entries(teamCodes)) {
    if (teams[normalized]) {
      return teams[normalized];
    }
    
    // Check if the nickname matches
    const nickname = getTeamNickname(normalized);
    for (const [fullName, code] of Object.entries(teams)) {
      if (fullName.endsWith(nickname)) {
        return code;
      }
    }
  }
  
  // If no match found, create a generic 3-letter code from the first 3 letters
  return normalized.substring(0, 3).toUpperCase();
};

// Team codes mapping
const teamCodes: Record<string, Record<string, string>> = {
  MLB: {
    'Atlanta Braves': 'ATL',
    'Arizona Diamondbacks': 'ARI',
    'Baltimore Orioles': 'BAL',
    'Boston Red Sox': 'BOS',
    'Chicago Cubs': 'CHC',
    'Chicago White Sox': 'CWS',
    'Cincinnati Reds': 'CIN',
    'Cleveland Guardians': 'CLE',
    'Colorado Rockies': 'COL',
    'Detroit Tigers': 'DET',
    'Houston Astros': 'HOU',
    'Kansas City Royals': 'KC',
    'Los Angeles Angels': 'LAA',
    'Los Angeles Dodgers': 'LAD',
    'Miami Marlins': 'MIA',
    'Milwaukee Brewers': 'MIL',
    'Minnesota Twins': 'MIN',
    'New York Mets': 'NYM',
    'New York Yankees': 'NYY',
    'Oakland Athletics': 'OAK',
    'Philadelphia Phillies': 'PHI',
    'Pittsburgh Pirates': 'PIT',
    'San Diego Padres': 'SD',
    'San Francisco Giants': 'SF',
    'Seattle Mariners': 'SEA',
    'St. Louis Cardinals': 'STL',
    'Tampa Bay Rays': 'TB',
    'Texas Rangers': 'TEX',
    'Toronto Blue Jays': 'TOR',
    'Washington Nationals': 'WSH'
  },
  NFL: {
    'Arizona Cardinals': 'ARI',
    'Atlanta Falcons': 'ATL',
    'Baltimore Ravens': 'BAL',
    'Buffalo Bills': 'BUF',
    'Carolina Panthers': 'CAR',
    'Chicago Bears': 'CHI',
    'Cincinnati Bengals': 'CIN',
    'Cleveland Browns': 'CLE',
    'Dallas Cowboys': 'DAL',
    'Denver Broncos': 'DEN',
    'Detroit Lions': 'DET',
    'Green Bay Packers': 'GB',
    'Houston Texans': 'HOU',
    'Indianapolis Colts': 'IND',
    'Jacksonville Jaguars': 'JAX',
    'Kansas City Chiefs': 'KC',
    'Las Vegas Raiders': 'LV',
    'Los Angeles Chargers': 'LAC',
    'Los Angeles Rams': 'LA',
    'Miami Dolphins': 'MIA',
    'Minnesota Vikings': 'MIN',
    'New England Patriots': 'NE',
    'New Orleans Saints': 'NO',
    'New York Giants': 'NYG',
    'New York Jets': 'NYJ',
    'Philadelphia Eagles': 'PHI',
    'Pittsburgh Steelers': 'PIT',
    'San Francisco 49ers': 'SF',
    'Seattle Seahawks': 'SEA',
    'Tampa Bay Buccaneers': 'TB',
    'Tennessee Titans': 'TEN',
    'Washington Commanders': 'WAS'
  },
  NBA: {
    'Atlanta Hawks': 'ATL',
    'Boston Celtics': 'BOS',
    'Brooklyn Nets': 'BKN',
    'Charlotte Hornets': 'CHA',
    'Chicago Bulls': 'CHI',
    'Cleveland Cavaliers': 'CLE',
    'Dallas Mavericks': 'DAL',
    'Denver Nuggets': 'DEN',
    'Detroit Pistons': 'DET',
    'Golden State Warriors': 'GSW',
    'Houston Rockets': 'HOU',
    'Indiana Pacers': 'IND',
    'Los Angeles Clippers': 'LAC',
    'Los Angeles Lakers': 'LAL',
    'Memphis Grizzlies': 'MEM',
    'Miami Heat': 'MIA',
    'Milwaukee Bucks': 'MIL',
    'Minnesota Timberwolves': 'MIN',
    'New Orleans Pelicans': 'NOP',
    'New York Knicks': 'NYK',
    'Oklahoma City Thunder': 'OKC',
    'Orlando Magic': 'ORL',
    'Philadelphia 76ers': 'PHI',
    'Phoenix Suns': 'PHX',
    'Portland Trail Blazers': 'POR',
    'Sacramento Kings': 'SAC',
    'San Antonio Spurs': 'SAS',
    'Toronto Raptors': 'TOR',
    'Utah Jazz': 'UTA',
    'Washington Wizards': 'WAS'
  },
  NHL: {
    'Anaheim Ducks': 'ANA',
    'Arizona Coyotes': 'ARI',
    'Boston Bruins': 'BOS',
    'Buffalo Sabres': 'BUF',
    'Calgary Flames': 'CGY',
    'Carolina Hurricanes': 'CAR',
    'Chicago Blackhawks': 'CHI',
    'Colorado Avalanche': 'COL',
    'Columbus Blue Jackets': 'CBJ',
    'Dallas Stars': 'DAL',
    'Detroit Red Wings': 'DET',
    'Edmonton Oilers': 'EDM',
    'Florida Panthers': 'FLA',
    'Los Angeles Kings': 'LAK',
    'Minnesota Wild': 'MIN',
    'Montreal Canadiens': 'MTL',
    'Nashville Predators': 'NSH',
    'New Jersey Devils': 'NJD',
    'New York Islanders': 'NYI',
    'New York Rangers': 'NYR',
    'Ottawa Senators': 'OTT',
    'Philadelphia Flyers': 'PHI',
    'Pittsburgh Penguins': 'PIT',
    'San Jose Sharks': 'SJS',
    'Seattle Kraken': 'SEA',
    'St. Louis Blues': 'STL',
    'Tampa Bay Lightning': 'TBL',
    'Toronto Maple Leafs': 'TOR',
    'Vancouver Canucks': 'VAN',
    'Vegas Golden Knights': 'VGK',
    'Washington Capitals': 'WSH',
    'Winnipeg Jets': 'WPG'
  }
};

// Stat name abbreviations
const statAbbreviations: Record<string, string> = {
  // MLB
  "HITS": "H",
  "HOME RUNS": "HR",
  "STRIKEOUTS": "K",
  "RBIS": "RBI",
  "STOLEN BASES": "SB",
  // NFL
  "PASSING YARDS": "PASS YDS",
  "RUSHING YARDS": "RUSH YDS",
  "RECEIVING YARDS": "REC YDS",
  "TOUCHDOWNS": "TD",
  "COMPLETIONS": "COMP",
  // NBA
  "POINTS": "PTS",
  "REBOUNDS": "REB",
  "ASSISTS": "AST",
  "STEALS": "STL",
  "BLOCKS": "BLK",
  // NHL
  "GOALS": "G",
  "NHL ASSISTS": "A",
  "SHOTS": "SOG",
  "SAVES": "SV",
  "NHL POINTS": "PTS"
};

// Helper function to get stat abbreviation
const getStatAbbreviation = (statName: string): string => {
  const upperStatName = statName.toUpperCase();
  return statAbbreviations[upperStatName] || statName;
};

// Format market text based on bet type
const formatMarketText = (market: string, betType: string): string => {
  console.log('Format Market Input:', { market, betType });
  
  // If market is empty or undefined, return empty string
  if (!market || market.trim() === '') {
    console.log('Empty market, returning empty string');
    return '';
  }
  
  // Handle Money Line bets
  if (betType === "MONEY LINE" || betType === "Money Line") {
    const nickname = getTeamNickname(market);
    console.log('Money line formatting:', { market, nickname });
    return nickname;
  }
  
  // Handle Spread bets
  if (betType === "SPREAD" || betType === "Spread") {
    const parts = market.split(' ');
    if (parts.length >= 2) {
      const teamName = parts.slice(0, -1).join(' ');
      const spreadValue = parts[parts.length - 1];
      const nickname = getTeamNickname(teamName);
      console.log('Spread formatting:', { teamName, nickname, spreadValue });
      return `${nickname} ${spreadValue}`;
    }
    return market;
  }
  
  // Handle Total Points bets
  if (betType === "TOTAL POINTS") {
    console.log('Processing Total Points bet:', market);
    
    // Direct processing for Total Points bets to ensure team initials are used
    if (market.includes('@')) {
      try {
        // Try to explicitly parse the expected format: "Team1@Team2 OVER/UNDER X.X"
        const parts = market.split(' ');
        if (parts.length >= 2) {
          // The first part should be "Team1@Team2"
          const teamsPart = parts[0];
          const teams = teamsPart.split('@');
          
          if (teams.length === 2) {
            const team1 = teams[0].trim();
            const team2 = teams[1].trim();
            
            // Use the rest as is but replace OVER/UNDER with O/U and remove space
            const overUnderPart = parts[1].toUpperCase().includes('OVER') ? 'O' : 'U';
            const numberValue = parts.length > 2 ? parts[2] : '';
            
            // Get initials
            const team1Initials = getTeamInitials(team1);
            const team2Initials = getTeamInitials(team2);
            
            // Format as "ARI@ATL O8.5" - no space between O/U and number
            return `${team1Initials}@${team2Initials} ${overUnderPart}${numberValue}`;
          }
        }
      } catch (error) {
        console.error('Error processing Total Points bet:', error);
      }
    }
    return market;
  }
  
  // Handle Player Props
  if (betType === "PLAYER PROP" || betType.includes("HITS") || betType.includes("RUNS") || 
      betType.includes("YARDS") || betType.includes("POINTS") || betType.includes("GOALS") ||
      statAbbreviations[betType.toUpperCase()]) {
    try {
      const marketParts = market.split(' ');
      if (marketParts.length >= 3) {
        let overUnderIndex = -1;
        for (let i = 0; i < marketParts.length; i++) {
          if (marketParts[i].toUpperCase() === 'OVER' || marketParts[i].toUpperCase() === 'UNDER') {
            overUnderIndex = i;
            break;
          }
        }
        
        if (overUnderIndex !== -1) {
          const playerName = marketParts.slice(0, overUnderIndex).join(' ');
          const overUnderValue = marketParts[overUnderIndex];
          const numberValue = marketParts[overUnderIndex + 1];
          const shortOverUnder = overUnderValue.toUpperCase().includes('OVER') ? 'O' : 'U';
          
          return `${playerName} ${shortOverUnder}${numberValue}`;
        }
      }
    } catch (error) {
      console.error('Error processing Player Prop bet:', error);
    }
    return market;
  }
  
  return market;
};

export default function BettingSlip(props: BettingSlipProps) {
  // Initialize with props or defaults
  const [market, setMarket] = useState(props.market);
  const [betType, setBetType] = useState(props.betType);
  const [league, setLeague] = useState(props.league || 'MLB');
  const [date, setDate] = useState(props.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
  const [odds, setOdds] = useState(props.odds);
  const [betAmount, setBetAmount] = useState(props.betAmount);
  const [toWinAmount, setToWinAmount] = useState(props.toWinAmount);
  const [autoCapture, setAutoCapture] = useState(props.autoCapture || false);
  
  const [isHovered, setIsHovered] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const slipRef = useRef<HTMLDivElement>(null);
  
  // Update state when props change
  useEffect(() => {
    console.log('Props changed:', props);
    setMarket(props.market);
    setBetType(props.betType);
    setLeague(props.league || 'MLB');
    setDate(props.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
    setOdds(props.odds);
    setBetAmount(props.betAmount);
    setToWinAmount(props.toWinAmount);
  }, [props.market, props.betType, props.league, props.date, props.odds, props.betAmount, props.toWinAmount]);
  
  // Check for URL parameters on component mount
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to parse parameters from URL for API requests
      try {
        const urlParams = new URLSearchParams(window.location.search);
        
        // If URL has parameters, use them to configure the slip
        if (urlParams.has('betType') || urlParams.has('market')) {
          // Update state with URL parameters if present
          if (urlParams.has('market')) setMarket(urlParams.get('market')!);
          if (urlParams.has('betType')) setBetType(urlParams.get('betType')!);
          if (urlParams.has('league')) setLeague(urlParams.get('league')!);
          if (urlParams.has('date')) setDate(urlParams.get('date')!);
          if (urlParams.has('odds')) setOdds(urlParams.get('odds')!);
          if (urlParams.has('betAmount')) setBetAmount(parseFloat(urlParams.get('betAmount')!));
          if (urlParams.has('toWinAmount')) setToWinAmount(parseFloat(urlParams.get('toWinAmount')!));
          if (urlParams.has('autoCapture')) setAutoCapture(urlParams.get('autoCapture') === 'true');
          
          console.log('Applied URL parameters from query string');
        }
      } catch (error) {
        console.error('Error parsing URL parameters:', error);
      }
    }
    
    // Mark component as ready for API screenshot
    setIsReady(true);
  }, []);
  
  // Auto-trigger image capture if in API mode
  useEffect(() => {
    // If autoCapture is enabled and component is ready, prepare for screenshot
    if (autoCapture && isReady && slipRef.current) {
      // Add a data attribute to signal readiness for screenshots
      slipRef.current.setAttribute('data-ready', 'true');
    }
  }, [autoCapture, isReady]);
  
  // Format the market text
  console.log('Before formatMarketText:', { market, betType });
  const formattedMarket = formatMarketText(market, betType);
  console.log('After formatMarketText:', { formattedMarket });
  
  // Get bet display type - for player props, properly extract the stat type
  const displayBetType = betType === "PLAYER PROP" ? 
    (() => {
      // For player props, find the stat type that comes after the OVER/UNDER and the number
      const parts = market.split(' ');
      let overUnderIndex = -1;
      
      // Find the OVER/UNDER keyword position
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].toUpperCase() === 'OVER' || parts[i].toUpperCase() === 'UNDER') {
          overUnderIndex = i;
          break;
        }
      }
      
      // If we found OVER/UNDER, extract the stat type that comes after the number
      if (overUnderIndex !== -1 && overUnderIndex + 2 < parts.length) {
        // The stat type starts after the OVER/UNDER and the number
        return parts.slice(overUnderIndex + 2).join(' ');
      }
      
      // Fallback: just return the last part
      return parts[parts.length - 1];
    })() : 
    betType;
  console.log('Display bet type:', displayBetType);
  
  // Get league-specific colors
  const leagueStyle = leagueColors[league as keyof typeof leagueColors] || leagueColors.MLB;
  
  // Reset isCopying state after component unmounts or if there's an error
  useEffect(() => {
    return () => {
      setIsCopying(false);
    };
  }, []);

  const copyAsImage = async () => {
    if (!slipRef.current) return;
    
    try {
      setIsCopying(true);
      
      // Direct capture with specific settings
      const dataUrl = await toPng(slipRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#FFFFFF',
        width: slipRef.current.offsetWidth,
        height: slipRef.current.offsetHeight,
        style: {
          transform: 'none'
        },
        // Explicitly filter out any buttons from the image
        filter: (node) => {
          // Skip data-buttons element completely
          if (node.hasAttribute && node.hasAttribute('data-buttons')) {
            return false;
          }
          return true;
        }
      });
      
      // Create a visible confirmation by appending a temporary image to verify
      const img = new Image();
      img.onload = async () => {
        // Only attempt clipboard write if we have a valid image
        if (img.width > 0 && img.height > 0) {
          try {
            const blob = await fetch(dataUrl).then(res => res.blob());
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            
            // Set copying state to false after 1 second
            setTimeout(() => {
              setIsCopying(false);
            }, 1000);
          } catch (clipErr) {
            console.error('Failed to copy to clipboard:', clipErr);
            setIsCopying(false);
          }
        } else {
          console.error('Generated image is invalid');
          setIsCopying(false);
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load generated image');
        setIsCopying(false);
      };
      
      img.src = dataUrl;
      
    } catch (err) {
      console.error('Failed to create or copy image:', err);
      setIsCopying(false);
    }
  };

  // Calculate text sizes based on content length
  const getPrimaryTextSize = (): string => {
    const length = formattedMarket.length;
    if (length > 25) return 'text-4xl';
    if (length > 15) return 'text-[2.75rem]';
    return 'text-5xl';
  };
  
  const getSecondaryTextSize = (): string => {
    return '';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-[800px] aspect-square">
        <div 
          ref={slipRef}
          id="betting-slip"
          className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 relative transition-transform duration-300 hover:scale-[1.02] h-full flex flex-col"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-ready={isReady.toString()}
        >
          {/* Header Section */}
          <div className="bg-[#2BF75E] p-12">
            <h1 className="text-[5rem] font-black italic text-black leading-none">
              BILLY BETS
            </h1>
          </div>

          {/* Main Content */}
          <div className="p-12 space-y-10 flex-1 bg-white">
            <div className="space-y-2">
              <div className="flex items-center gap-6">
                <span className="text-2xl text-gray-600 leading-none">{date}</span>
                <div className="h-10 inline-flex items-center" data-league-badge>
                  <div 
                    className={`h-full text-lg px-8 rounded-full leading-none flex items-center justify-center min-w-[80px]`}
                    style={{ 
                      backgroundColor: leagueStyle.bg, 
                      color: leagueStyle.text 
                    }}
                  >
                    <span className="inline-block text-center font-bold">{league}</span>
                  </div>
                </div>
              </div>
              
              {/* Market Title with Dynamic Sizing */}
              <div className="leading-tight mt-2">
                <h2 className={`${getPrimaryTextSize()} font-bold text-black`}>
                  {formattedMarket || "Select a team"}
                </h2>
                
                <div className="text-3xl font-normal text-black mt-2">
                  {displayBetType}
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-gray-600 mb-3 leading-none text-xl">BET AMOUNT</div>
                  <div className="text-[3.1rem] font-bold text-black leading-none">
                    ${betAmount.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-gray-600 mb-3 leading-none text-xl">ODDS</div>
                  <div className="text-3xl font-bold text-black leading-none">
                    {odds}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-gray-600 mb-4 leading-none text-2xl">POTENTIAL WIN</div>
                <div className="text-[5rem] font-bold text-[#2BF75E] leading-none">
                  ${toWinAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-8 flex justify-between items-center w-full mt-auto relative">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-800 leading-none">@AskBillyBets</span>
            </div>
            
            {/* Share Buttons */}
            <div 
              data-buttons
              className="absolute right-8 flex gap-3"
              style={{ opacity: isHovered && !isCopying ? 1 : 0, transition: 'opacity 0.3s' }}
            >
              <button 
                onClick={copyAsImage}
                className="bg-gray-900 text-white px-6 py-3 rounded-full text-base font-medium hover:bg-gray-800 transition-colors"
                disabled={isCopying}
              >
                {isCopying ? 'Copying...' : 'Copy'}
              </button>
              <button className="bg-[#1DA1F2] text-white px-6 py-3 rounded-full text-base font-medium hover:bg-[#1a8cd8] transition-colors">
                Share on X
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 