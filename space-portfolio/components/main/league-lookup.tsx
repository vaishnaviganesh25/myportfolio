"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { slideInFromLeft } from "@/lib/motion";

// Define types for the data
interface ChampionMastery {
  championId: number;
  championLevel: number;
  championPoints: number;
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

export const LeagueLookup = () => {
  // State for form inputs
  const [summonerName, setSummonerName] = useState("");
  const [tagLine, setTagLine] = useState("NA1");
  const [region, setRegion] = useState("na1");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  
  // Hardcoded Lambda Function URL
  const RIOT_API_URL = "https://vd4mgoxi5ukhybct4ht4gaqbwe0qpmqh.lambda-url.us-east-1.on.aws/";
  
  // Add a test function to the window object for debugging in browser console
  if (typeof window !== 'undefined') {
    (window as any).testRiotAPI = async () => {
      try {
        // Better test summoner - try a more well-known NA player
        const testResponse = await fetch(RIOT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summonerName: 'Doublelift',
            tagLine: 'NA1',
            region: 'na1'
          })
        });
        
        console.log('Test Response Status:', testResponse.status);
        
        try {
          const testData = await testResponse.json();
          console.log('Test Response Data:', testData);
          return testData;
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          if (testResponse.status === 502 || testResponse.status === 504) {
            console.error('Lambda function likely timed out. Increase the function timeout in AWS.');
          }
          return { error: 'Failed to parse response', status: testResponse.status };
        }
      } catch (error) {
        console.error('Test API Error:', error);
        return error;
      }
    };
    console.log('🎮 You can test the Riot API by running window.testRiotAPI() in the browser console');
  }
  
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
      console.log(`Sending request to: ${RIOT_API_URL}`);
      console.log(`Request data:`, { summonerName, tagLine, region });
      
      const response = await fetch(RIOT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summonerName: summonerName,
          tagLine: tagLine,
          region: region
        }),
        mode: 'cors' // Explicitly requesting CORS mode
      });
      
      console.log(`Response status:`, response.status);
      console.log(`Response headers:`, response.headers);
      
      let data;
      try {
        data = await response.json();
        console.log(`Response data:`, data);
        
        if (response.ok) {
          setSummonerData(data);
          setMessage({ text: "Summoner found!", type: "success" });
        } else {
          setMessage({ 
            text: `Error: ${data.error || 'Failed to fetch summoner data'} (Status: ${response.status})`, 
            type: "error" 
          });
        }
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        if (response.status === 502 || response.status === 504) {
          setMessage({ 
            text: `Lambda function timed out. The Riot API might be slow or unavailable. Try a different summoner or region.`, 
            type: "error" 
          });
        } else {
          setMessage({ 
            text: `Error parsing response: ${response.status} ${response.statusText}`, 
            type: "error" 
          });
        }
      }
    } catch (error) {
      console.error("Error details:", error);
      setMessage({ 
        text: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check console for details.`, 
        type: "error" 
      });
    }
    
    // Reset loading state
    setIsLoading(false);
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
        <p className="text-gray-300 mb-8 max-w-[600px] mx-auto">
          Enter your Riot ID (GameName#TagLine) to see your level and top champions!
        </p>
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
        className="max-w-[600px] mx-auto bg-[#0C0C1D]/50 backdrop-blur-sm border border-[#7042f88b] rounded-xl p-8"
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
            <h4 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
              Summoner Info
            </h4>
            
            <div className="bg-[#0C0C1D]/70 rounded-lg p-4 mb-6 text-center">
              {/* Get profile icon URL from Data Dragon */}
              {summonerData.summoner.profileIconId && (
                <div className="flex justify-center mb-3">
                  <img 
                    src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${summonerData.summoner.profileIconId}.png`}
                    alt="Summoner Profile Icon"
                    className="w-24 h-24 rounded-full border-2 border-purple-500"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/0.png";
                    }}
                  />
                </div>
              )}
              <h5 className="text-xl font-semibold text-white">{summonerData.summoner.name}</h5>
              <p className="text-gray-300">Level: {summonerData.summoner.level}</p>
            </div>
            
            {summonerData.topChampions && summonerData.topChampions.length > 0 ? (
              <>
                <h5 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
                  Top Champions
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {summonerData.topChampions.map((champion, index) => (
                    <div key={index} className="bg-[#0C0C1D]/70 border-l-4 border-purple-500 rounded-lg p-4">
                      <p className="text-white"><strong>Champion ID:</strong> {champion.championId}</p>
                      <p className="text-white"><strong>Mastery Level:</strong> {champion.championLevel}</p>
                      <p className="text-white"><strong>Mastery Points:</strong> {champion.championPoints.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-300">No champion mastery data found.</p>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default LeagueLookup;