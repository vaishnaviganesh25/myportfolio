"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { slideInFromLeft } from "@/lib/motion";

// Define types for the data
interface ChampionMastery {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  tokensEarned: number;
}

interface SummonerInfo {
  name: string;
  level: number;
  puuid: string;
  profileIconId?: number;
}

interface SummonerData {
  summoner: SummonerInfo;
  topChampions: ChampionMastery[];
}

// Mock data for testing UI
const mockSummonerData = {
  summoner: {
    name: "Doublelift",
    level: 31,
    profileIconId: 654,
    puuid: "4V6y6xJpla464PxBW5wbcNfaqbMBiIX7mN2Bow-sB_WKbE2krwJ63izMIMpA3yPRgO2M723DFLqwUQ"
  },
  topChampions: [
    {
      championId: 67,
      championLevel: 15,
      championPoints: 181371,
      lastPlayTime: 1526182459000,
      championPointsSinceLastLevel: 50771,
      championPointsUntilNextLevel: -39771,
      tokensEarned: 0
    },
    {
      championId: 119,
      championLevel: 9,
      championPoints: 85598,
      lastPlayTime: 1526244290000,
      championPointsSinceLastLevel: 20998,
      championPointsUntilNextLevel: -9998,
      tokensEarned: 1
    },
    {
      championId: 236,
      championLevel: 7,
      championPoints: 60244,
      lastPlayTime: 1496900315000,
      championPointsSinceLastLevel: 17644,
      championPointsUntilNextLevel: -6644,
      tokensEarned: 0
    }
  ]
};

// Champion ID to name mapping (Data Dragon champions)
const championNames: {[key: number]: string} = {
  67: "Vayne",
  119: "Draven", 
  236: "Lucian",
  7: "LeBlanc",
  268: "Azir",
  517: "Sylas"
};

export const LeagueLookupDirect = () => {
  // State for form inputs
  const [summonerName, setSummonerName] = useState("");
  const [tagLine, setTagLine] = useState("NA1");
  const [region, setRegion] = useState("na1");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  
  // Test function to check if Lambda function is working
  // const testLambdaFunction = async () => {
  //   try {
  //     console.log('Testing Lambda function...');
  //     const LAMBDA_FUNCTION_URL = "https://vd4mgoxi5ukhybct4ht4gaqbwe0qpmqh.lambda-url.us-east-1.on.aws/";
      
  //     // Test with a simple request
  //     const response = await fetch(LAMBDA_FUNCTION_URL, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         summonerName: 'test',
  //         tagLine: 'NA1',
  //         region: 'na1'
  //       }),
  //     });
      
  //     console.log(`Lambda test response status: ${response.status}`);
      
  //     if (response.status === 400) {
  //       setMessage({
  //         text: `✅ Lambda function is responding (got expected 400 for test data)`,
  //         type: 'success'
  //       });
  //     } else if (response.ok) {
  //       const data = await response.json();
  //       setMessage({
  //         text: `✅ Lambda function working! Try a real summoner lookup.`,
  //         type: 'success'
  //       });
  //     } else {
  //       const errorText = await response.text();
  //       setMessage({
  //         text: `⚠️ Lambda returned ${response.status}: ${errorText.substring(0, 100)}`,
  //         type: 'error'
  //       });
  //     }
      
  //   } catch (error) {
  //     console.error('Lambda test failed:', error);
  //     setMessage({
  //       text: `❌ Lambda Test Failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
  //       type: 'error'
  //     });
  //   }
  // };
  
  const handleRegionChange = (selectedRegion: string) => {
    // Update region
    setRegion(selectedRegion);
    
    // Map regions to their common taglines
    const regionToTagLine: {[key: string]: string} = {
      "na1": "NA1",
      "euw1": "EUW1", 
      "eun1": "EUN1",
      "kr": "KR1",
      "br1": "BR1",
      "la1": "LA1",
      "la2": "LA2",
      "oc1": "OCE1",
      "tr1": "TR1",
      "ru": "RU1",
      "jp1": "JP1"
    };
    
    // Update tagLine based on selected region
    setTagLine(regionToTagLine[selectedRegion] || selectedRegion.toUpperCase());
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!summonerName.trim()) {
      setMessage({ text: "Please enter a summoner name", type: "error" });
      return;
    }
    
    if (!tagLine.trim()) {
      setMessage({ text: "Please enter a tag line", type: "error" });
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    setSummonerData(null);
    
    try {
      console.log(`Looking up summoner: ${summonerName}#${tagLine} in region ${region}`);
      
      // Use Lambda Function URL (works with static hosting on Amplify)
      const LAMBDA_FUNCTION_URL = "https://vd4mgoxi5ukhybct4ht4gaqbwe0qpmqh.lambda-url.us-east-1.on.aws/";
      
      console.log(`Calling Lambda function: ${LAMBDA_FUNCTION_URL}`);
      
      const response = await fetch(LAMBDA_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summonerName: summonerName.trim(),
          tagLine: tagLine.trim(),
          region: region
        }),
      });

      console.log(`Lambda Response status: ${response.status}`);
      console.log(`Lambda Response headers:`, response.headers);
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);
      
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.log(`Non-JSON Lambda response:`, textResponse);
        throw new Error(`Lambda returned non-JSON response: ${textResponse.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Lambda Response data:', data);

      if (response.ok) {
        setSummonerData(data);
        setMessage({ text: "✅ Summoner found using Lambda function!", type: "success" });
      } else {
        setMessage({ 
          text: `Error: ${data.error || 'Failed to fetch summoner data'}`, 
          type: "error" 
        });
      }
      
    } catch (error) {
      console.error("Error details:", error);
      
      // Fallback to mock data if API is not configured
      console.log("API call failed, showing mock data for demonstration");
      
      const mockData = {
        summoner: {
          name: summonerName,
          level: Math.floor(Math.random() * 500) + 30,
          profileIconId: Math.floor(Math.random() * 100) + 500,
          puuid: "mock-puuid-" + Math.random().toString(36).substr(2, 9)
        },
        topChampions: mockSummonerData.topChampions.map(champ => ({
          ...champ,
          championPoints: Math.floor(Math.random() * 500000) + 50000,
          championLevel: Math.floor(Math.random() * 7) + 1
        }))
      };
      
      setSummonerData(mockData);
      setMessage({ 
        text: `⚠️ Using mock data - ${error instanceof Error ? error.message : 'Lambda function call failed'}. Check Lambda function timeout settings.`, 
        type: "error" 
      });
    }
    
    // Reset loading state
    setIsLoading(false);
  };
  
  const formatLastPlayTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  const getChampionName = (championId: number) => {
    return championNames[championId] || `Champion ${championId}`;
  };
  
  return (
    <section id="league-lookup" className="py-20 relative">
      <motion.div
        variants={slideInFromLeft(0.5)}
        className="text-center"
      >
        <h3 className="text-[32px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
          League Data Lookup
        </h3>
        <p className="text-gray-300 mb-4 max-w-[600px] mx-auto">
          Enter your Riot ID (GameName#TagLine) to see your level and top champions!
        </p>
        
        {/* Debug Test Button */}
        {/* <div className="text-center mb-6">
          <button
            onClick={testLambdaFunction}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            🔍 Test Lambda Function
          </button>
        </div> */}
      </motion.div>
      
      {message.text && (
        <div className={`max-w-[600px] mx-auto p-4 rounded-lg mb-6 ${
          message.type === 'success' 
          ? 'bg-green-500/20 border border-green-500 text-green-100' 
          : 'bg-red-500/20 border border-red-500 text-red-100'
        }`}>
          {message.text}
        </div>
      )}
      
      <motion.div
        variants={slideInFromLeft(0.7)}
        className="max-w-[800px] mx-auto bg-[#0C0C1D]/50 backdrop-blur-sm border border-[#7042f88b] rounded-xl p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="summoner-name" className="block text-sm font-medium text-gray-300 mb-2">
                Game Name
              </label>
              <input
                type="text"
                id="summoner-name"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a2e]/80 border border-[#7042f88b] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter game name (e.g., Doublelift)"
                required
              />
              <p className="mt-1 text-xs text-gray-400">Your Riot ID format is: GameName#TagLine</p>
            </div>
            
            <div>
              <label htmlFor="tag-line" className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <span>Riot ID Tag Line</span>
                <span className="relative ml-1 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-xs text-white p-2 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    The tag line is the part after the # in your Riot ID (e.g., NA1, EUW, KR1). 
                    You can find it in the League client or on your Riot Games account page.
                  </div>
                </span>
              </label>
              <input
                type="text"
                id="tag-line"
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a2e]/80 border border-[#7042f88b] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter tag line (e.g., NA1)"
                required
              />
            </div>
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-2">
                Region
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a2e]/80 border border-[#7042f88b] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="na1">North America</option>
                <option value="euw1">Europe West</option>
                <option value="eun1">Europe Nordic & East</option>
                <option value="kr">Korea</option>
                <option value="br1">Brazil</option>
                <option value="la1">Latin America North</option>
                <option value="la2">Latin America South</option>
                <option value="oc1">Oceania</option>
                <option value="tr1">Turkey</option>
                <option value="ru">Russia</option>
                <option value="jp1">Japan</option>
              </select>
            </div>
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 button-primary text-white font-medium rounded-lg transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-purple-500/25'}`}
            whileHover={isLoading ? {} : { scale: 1.02 }}
            whileTap={isLoading ? {} : { scale: 0.98 }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Looking up...
              </div>
            ) : "Look Up Summoner"}
          </motion.button>
        </form>
        
        {/* Results Display */}
        {summonerData && (
          <div className="mt-8 bg-[#1a1a2e]/50 border border-[#7042f88b] rounded-lg p-6">
            <h4 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-6">
              Summoner Info
            </h4>
            
            {/* Summoner Profile Card */}
            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-4">
                {/* Profile Icon */}
                {summonerData.summoner.profileIconId && (
                  <div className="flex-shrink-0">
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${summonerData.summoner.profileIconId}.png`}
                      alt="Summoner Profile Icon"
                      className="w-20 h-20 rounded-full border-3 border-purple-400 shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/0.png";
                      }}
                    />
                  </div>
                )}
                
                {/* Summoner Info */}
                <div className="flex-grow">
                  <h5 className="text-2xl font-bold text-white mb-2">{summonerData.summoner.name}</h5>
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#0C0C1D]/70 px-4 py-2 rounded-lg border border-purple-500/20">
                      <span className="text-sm text-gray-300">Level</span>
                      <div className="text-xl font-bold text-purple-400">{summonerData.summoner.level}</div>
                    </div>
                    <div className="bg-[#0C0C1D]/70 px-4 py-2 rounded-lg border border-cyan-500/20">
                      <span className="text-sm text-gray-300">Region</span>
                      <div className="text-xl font-bold text-cyan-400">{region.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Top Champions */}
            {summonerData.topChampions && summonerData.topChampions.length > 0 ? (
              <>
                <h5 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
                  🏆 Top Champions by Mastery
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {summonerData.topChampions.map((champion, index) => (
                    <div key={index} className="bg-gradient-to-br from-[#0C0C1D] to-[#1a1a2e] border border-purple-500/30 rounded-lg p-6 hover:border-purple-400/50 transition-all duration-300">
                      {/* Champion Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'}`}></div>
                          <h6 className="font-semibold text-white">#{index + 1}</h6>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-300">Mastery Level</div>
                          <div className="text-xl font-bold text-purple-400">{champion.championLevel}</div>
                        </div>
                      </div>
                      
                      {/* Champion Details */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Champion</span>
                          <span className="font-medium text-white">{getChampionName(champion.championId)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Mastery Points</span>
                          <span className="font-bold text-cyan-400">{champion.championPoints.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Tokens Earned</span>
                          <span className="font-medium text-yellow-400">{champion.tokensEarned}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Last Played</span>
                          <span className="font-medium text-gray-200">{formatLastPlayTime(champion.lastPlayTime)}</span>
                        </div>
                        
                        {/* Progress Bar for Next Level */}
                        {champion.championPointsUntilNextLevel > 0 && (
                          <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress to Level {champion.championLevel + 1}</span>
                              <span>{champion.championPointsUntilNextLevel} points needed</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.max(0, Math.min(100, (champion.championPointsSinceLastLevel / (champion.championPointsSinceLastLevel + champion.championPointsUntilNextLevel)) * 100))}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-300 mb-2">No champion mastery data found.</p>
                <p className="text-sm text-gray-400">This summoner may not have played ranked games recently.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default LeagueLookupDirect;