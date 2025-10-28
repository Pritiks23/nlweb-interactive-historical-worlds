import React, { useState, useEffect } from 'react';
import { World, Region } from '../types';
import { NLWEBProcessor } from '../nlweb';
import './WorldViewer.css';

interface WorldViewerProps {
    worlds: World[];
    regions: Region[];
}

// Fun historical facts for each period
const PERIOD_FACTS: { [key: string]: string[] } = {
    "prehistoric-era": [
        "🔥 Humans controlled fire over 1 million years ago!",
        "🎨 The oldest known cave paintings are 65,000 years old",
        "🏹 The bow and arrow was invented 64,000 years ago"
    ],
    "ancient-civilizations": [
        "📜 The first writing system was created in 3200 BCE",
        "🏗️ The Great Pyramid was the world's tallest building for 3,800 years",
        "🌾 Agriculture began independently in 7 different regions"
    ],
    "classical-antiquity": [
        "🏛️ The Parthenon was built without any mortar",
        "🗺️ Romans built 50,000 miles of roads",
        "📚 The Library of Alexandria had 700,000 scrolls"
    ],
    "post-classical": [
        "🧮 The number zero was invented in India",
        "📖 The first university was founded in Morocco in 859 CE",
        "🗡️ Viking longships could travel at 17 knots"
    ],
    "high-middle-ages": [
        "🏰 Gothic cathedrals took 100+ years to build",
        "🛡️ A suit of armor weighed only 45-55 pounds",
        "🌍 The Mongol Empire was 4x larger than Alexander's"
    ],
    "late-middle-ages": [
        "🎨 The Mona Lisa was painted on a poplar wood panel",
        "🌍 Columbus thought he had reached Asia",
        "⚒️ Gutenberg's printing press used 25,000 pieces of type"
    ],
    "early-modern": [
        "🔭 Galileo's telescope magnified objects 20x",
        "💰 Spanish silver from the Americas caused global inflation",
        "🦃 Turkeys were first domesticated by the Aztecs"
    ],
    "industrial-age": [
        "🚂 The first steam locomotive reached 5 mph",
        "💡 Edison tested 3,000 materials for light bulb filaments",
        "🏭 Factory workers worked 14-16 hours per day"
    ],
    "modern-world": [
        "✈️ The Wright brothers' first flight lasted 12 seconds",
        "📻 Radio waves travel at the speed of light",
        "🚀 The Space Race put 12 humans on the Moon"
    ],
    "contemporary-era": [
        "💻 The first computer weighed 30 tons",
        "🌐 The World Wide Web has over 1.7 billion websites",
        "📱 Smartphones are more powerful than 1960s supercomputers"
    ]
};

const WorldViewer: React.FC<WorldViewerProps> = ({ worlds, regions }) => {
    const [selectedWorld, setSelectedWorld] = useState<World | null>(worlds[0] || null);
    const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
    const [showNLWEBAnalysis, setShowNLWEBAnalysis] = useState<string | null>(null);
    
    // Initialize Microsoft NLWEB processor
    const [nlwebProcessor] = useState(() => new NLWEBProcessor({
        semanticEnrichment: true,
        contextualLinking: true,
        naturalLanguageProcessing: true
    }));

    const handleWorldSelect = (world: World) => {
        setSelectedWorld(world);
        setExpandedRegion(null);
        setShowNLWEBAnalysis(null);
    };

    const handleRegionClick = (regionId: string) => {
        setExpandedRegion(expandedRegion === regionId ? null : regionId);
        if (expandedRegion !== regionId) {
            setShowNLWEBAnalysis(null);
        }
    };

    const handleNLWEBAnalysisClick = (regionId: string) => {
        setShowNLWEBAnalysis(showNLWEBAnalysis === regionId ? null : regionId);
    };

    // Get NLWEB analysis for a region
    const getNLWEBAnalysis = (region: Region) => {
        if (!selectedWorld) return null;
        
        return nlwebProcessor.optimizeForNLWEB(region.description, {
            era: selectedWorld.name,
            region: region.name,
            relatedRegions: selectedWorld.regions.map(r => r.name).filter(name => name !== region.name)
        });
    };

    // NLWEB enhancement function - enriches content while preserving original
    const enhanceWithNLWEB = (region: Region) => {
        if (!selectedWorld) return region.description;
        
        const nlwebData = getNLWEBAnalysis(region);
        return nlwebData?.enrichedContent || region.description;
    };

    return (
        <div className="world-viewer">
            <div className="header">
                <h1>🌍 Journey Through Time: Interactive Historical Worlds</h1>
                <p>Embark on an epic voyage through human civilization - from our earliest origins to the digital age. 
                   Discover the cultures, innovations, and stories that shaped our world.</p>
            </div>
            
            <div className="world-selector">
                <h2>🕰️ Choose Your Historical Era:</h2>
                <div className="world-buttons">
                    {worlds.map(world => (
                        <button 
                            key={world.id} 
                            className={`world-button ${selectedWorld?.id === world.id ? 'active' : ''}`}
                            onClick={() => handleWorldSelect(world)}
                        >
                            {world.name}
                        </button>
                    ))}
                </div>
            </div>

            {selectedWorld && (
                <div className="selected-world">
                    <div className="world-header">
                        <h2>📜 {selectedWorld.name}</h2>
                        <p className="world-description">{selectedWorld.description}</p>
                    </div>
                    
                    <div className="regions">
                        <h3>🗺️ Explore These Fascinating Regions:</h3>
                        
                        <div className="regions-grid">
                            {selectedWorld.regions.map(region => (
                                <div 
                                    key={region.id} 
                                    className={`region-card ${expandedRegion === region.id ? 'expanded' : ''}`}
                                    onClick={() => handleRegionClick(region.id)}
                                >
                                    <div className="region-header">
                                        <h4>{region.name}</h4>
                                        <button className="discover-btn">
                                            {expandedRegion === region.id ? 'Collapse' : 'Discover'}
                                        </button>
                                    </div>
                                    
                                    <div className="region-content">
                                        <div className="region-preview">
                                            {region.description.substring(0, 100)}...
                                        </div>
                                        
                                        {expandedRegion === region.id && (
                                            <div className="region-details">
                                                <div className="region-full-description">
                                                    <div 
                                                        dangerouslySetInnerHTML={{ 
                                                            __html: enhanceWithNLWEB(region).replace(
                                                                /<nlweb:([^>]+)>/g, 
                                                                '<span class="nlweb-enhanced">').replace(
                                                                /<\/nlweb:[^>]*>/g, 
                                                                '</span>'
                                                            )
                                                        }} 
                                                    />
                                                    <div 
                                                        className="nlweb-badge clickable"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNLWEBAnalysisClick(region.id);
                                                        }}
                                                        title="Click to see NLWEB Analysis"
                                                    >
                                                        <span>🧠 NLWEB Enhanced {showNLWEBAnalysis === region.id ? '▼' : '▶'}</span>
                                                    </div>
                                                    
                                                    {showNLWEBAnalysis === region.id && (() => {
                                                        const analysis = getNLWEBAnalysis(region);
                                                        return analysis && (
                                                            <div className="nlweb-analysis">
                                                                <h4>🔍 Microsoft NLWEB Analysis</h4>
                                                                
                                                                <div className="analysis-section">
                                                                    <h5>📊 Content Metrics</h5>
                                                                    <div className="metrics-grid">
                                                                        <div className="metric">
                                                                            <span className="metric-label">Readability Score:</span>
                                                                            <span className="metric-value">{analysis.nlpAnalysis.readabilityScore.toFixed(1)}/100</span>
                                                                        </div>
                                                                        <div className="metric">
                                                                            <span className="metric-label">Content Sentiment:</span>
                                                                            <span className="metric-value">{analysis.nlpAnalysis.sentiment}</span>
                                                                        </div>
                                                                        <div className="metric">
                                                                            <span className="metric-label">Word Count:</span>
                                                                            <span className="metric-value">{region.description.split(' ').length} words</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {analysis.nlpAnalysis.keyPhrases.length > 0 && (
                                                                    <div className="analysis-section">
                                                                        <h5>🏷️ Key Historical Terms</h5>
                                                                        <div className="key-phrases">
                                                                            {analysis.nlpAnalysis.keyPhrases.slice(0, 6).map((phrase: string, index: number) => (
                                                                                <span key={index} className="key-phrase">{phrase}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {analysis.contextualLinks.length > 0 && (
                                                                    <div className="analysis-section">
                                                                        <h5>🔗 Related Regions</h5>
                                                                        <div className="contextual-links">
                                                                            {analysis.contextualLinks.slice(0, 4).map((link: any, index: number) => (
                                                                                <div key={index} className="contextual-link">
                                                                                    <span className="link-text">{link.text}</span>
                                                                                    <span className="link-context">{link.context}</span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="analysis-footer">
                                                                    <small>✨ Powered by Microsoft NLWEB Technology</small>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="footer-info">
                <p>🎓 Educational content crafted to bring history to life. Each region contains detailed historical information, 
                   cultural insights, and fascinating stories from our shared human heritage.</p>
            </div>
        </div>
    );
};

export default WorldViewer;