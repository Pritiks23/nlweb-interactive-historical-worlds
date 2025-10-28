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
    const [isPlaying, setIsPlaying] = useState<string | null>(null);
    const [voicesLoaded, setVoicesLoaded] = useState(false);
    
    // Initialize Microsoft NLWEB processor
    const [nlwebProcessor] = useState(() => new NLWEBProcessor({
        semanticEnrichment: true,
        contextualLinking: true,
        naturalLanguageProcessing: true
    }));

    // Load voices for better cinematic narration
    React.useEffect(() => {
        if ('speechSynthesis' in window) {
            const loadVoices = () => {
                const voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    setVoicesLoaded(true);
                    console.log('🎬 Available cinematic voices:', voices.filter(v => v.lang.includes('en')).map(v => v.name));
                }
            };
            
            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const handleWorldSelect = (world: World) => {
        // Stop any playing narration
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsPlaying(null);
        
        setSelectedWorld(world);
        setExpandedRegion(null);
        setShowNLWEBAnalysis(null);
    };

    const handleRegionClick = (regionId: string) => {
        // Stop any playing narration when switching regions
        if (expandedRegion !== regionId && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsPlaying(null);
        }
        
        if (expandedRegion === regionId) {
            setExpandedRegion(null);
            setShowNLWEBAnalysis(null);
        } else {
            setExpandedRegion(regionId);
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

    // Immersive Experience Generator - Cinematic narrator-style content
    const createImmersiveExperience = (region: Region) => {
        const experiences = {
            atmosphere: [
                "✨ Through the mists of time, you emerge into a world long forgotten... The portal's energy fades behind you as ancient history comes alive...",
                "🌅 The veil between past and present dissolves... You find yourself standing where legends once walked and empires rose and fell...", 
                "🔮 Time itself bends to your will as you step across the threshold... The echoes of civilizations past whisper their secrets to you...",
                "⚡ Lightning flashes across dimensions as you cross into the heart of history... The very ground beneath your feet trembles with the weight of ages..."
            ],
            sensory: [
                "👂 Listen... Do you hear it? The distant echoes of voices that once shaped the world... The sounds of an age that time forgot",
                "👃 Breathe deeply... The air itself tells a story... Ancient fires, exotic spices, and the unmistakable scent of human ambition", 
                "👁️ Look around you... Witness the grandeur that once was... Architecture that defied the limits of its time, now stands before you in all its glory",
                "🤚 Reach out and touch the past... Feel the weathered stones that witnessed history, the silk that adorned emperors, the tools that built civilizations"
            ],
            transitions: [
                "As our journey through time continues, the tapestry of history unfolds before us...",
                "Deeper into the shadows of the past we venture, where truth and legend intertwine...", 
                "The chronicles of ages past reveal themselves as we walk among the ghosts of greatness...",
                "Through the corridors of time, we discover the magnificent truth that..."
            ]
        };

        const randomAtmosphere = experiences.atmosphere[Math.floor(Math.random() * experiences.atmosphere.length)];
        const randomSensory = experiences.sensory[Math.floor(Math.random() * experiences.sensory.length)];
        const randomTransition = experiences.transitions[Math.floor(Math.random() * experiences.transitions.length)];
        
        // Transform the existing description into cinematic storytelling
        const originalText = region.description;
        const sentences = originalText.split('. ');
        
        return `${randomAtmosphere}

🌍 **Chapter One: The Realm of ${region.name}**

${randomSensory}... Here, in this sacred place, ${sentences[0].toLowerCase()}...

${randomTransition} ${sentences.slice(1, 4).join('. ')}.

And so the legend continues... ${sentences.slice(4).join('. ')}

*Press play to hear this tale narrated in the voice of a master storyteller... Let the chronicles of ${region.name} unfold before you...*`;
    };

    // Text-to-Speech Narration Function - Cinematic Narrator Voice
    const speakExperience = (region: Region) => {
        if ('speechSynthesis' in window) {
            // If already playing this region, stop it
            if (isPlaying === region.id) {
                window.speechSynthesis.cancel();
                setIsPlaying(null);
                return;
            }
            
            // Stop any ongoing speech
            window.speechSynthesis.cancel();
            setIsPlaying(region.id);
            
            // Create the narrative text with dramatic pauses
            const narrative = createImmersiveExperience(region)
                .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold
                .replace(/[✨🌅🔮⚡👂👃👁️🤚🌍]/g, '') // Remove emojis
                .replace(/\*/g, '') // Remove remaining markdown
                .replace(/\.\.\./g, '... ') // Add pauses for dramatic effect
                .replace(/:/g, ': ') // Pause after colons
                .replace(/;/g, '; '); // Pause after semicolons
            
            const utterance = new SpeechSynthesisUtterance(narrative);
            
            // Cinematic narrator settings
            utterance.rate = 0.75; // Slower, more dramatic pace
            utterance.pitch = 0.85; // Slightly deeper, more authoritative
            utterance.volume = 0.9; // Higher volume for impact
            
            // Find the most cinematic voice available
            const voices = window.speechSynthesis.getVoices();
            
            // Priority order for cinematic voices
            const cinematicVoiceNames = [
                'Alex', // macOS premium voice
                'Daniel (Enhanced)', // Windows premium
                'Google UK English Male', // Deep, authoritative
                'Microsoft David', // Clear, dramatic
                'Karen', // Professional narrator
                'Moira', // Irish dramatic
                'Rishi', // Indian English with gravitas
                'Tessa', // South African dramatic
                'Arthur', // British dramatic
                'Bruce', // Australian dramatic
            ];
            
            // Try to find the best cinematic voice
            let cinematicVoice = null;
            
            for (const voiceName of cinematicVoiceNames) {
                cinematicVoice = voices.find(voice => 
                    voice.name.includes(voiceName) ||
                    voice.name.toLowerCase().includes(voiceName.toLowerCase())
                );
                if (cinematicVoice) break;
            }
            
            // If no specific cinematic voice found, look for characteristics
            if (!cinematicVoice) {
                cinematicVoice = voices.find(voice => 
                    (voice.name.includes('Male') && voice.lang.includes('en')) ||
                    (voice.name.includes('Enhanced') && voice.lang.includes('en')) ||
                    (voice.name.includes('Premium') && voice.lang.includes('en')) ||
                    (voice.name.includes('Natural') && voice.lang.includes('en'))
                ) || voices.find(voice => voice.lang.includes('en') && voice.default);
            }
            
            if (cinematicVoice) {
                utterance.voice = cinematicVoice;
                console.log(`🎬 Using cinematic narrator voice: ${cinematicVoice.name}`);
            }
            
            // Handle speech end
            utterance.onend = () => {
                setIsPlaying(null);
            };
            
            utterance.onerror = () => {
                setIsPlaying(null);
            };
            
            window.speechSynthesis.speak(utterance);
        }
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
                                        <div className="region-preview portal-entrance">
                                            🌟 Click to enter the portal to {region.name}...
                                        </div>
                                        
                                        {expandedRegion === region.id && (
                                            <div className="region-details immersive-world">
                                                <div className="immersive-experience">
                                                    <div 
                                                        dangerouslySetInnerHTML={{ 
                                                            __html: createImmersiveExperience(region).replace(
                                                                /\*\*(.*?)\*\*/g, 
                                                                '<strong class="story-highlight">$1</strong>').replace(
                                                                /<\/nlweb:[^>]*>/g, 
                                                                '</span>'
                                                            )
                                                        }} 
                                                    />
                                                    
                                                    <div className="experience-controls">
                                                        <button 
                                                            className={`play-narration-btn ${isPlaying === region.id ? 'playing' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                speakExperience(region);
                                                            }}
                                                            title={isPlaying === region.id ? "Stop cinematic narration" : "Listen with cinematic narrator voice"}
                                                        >
                                                            {isPlaying === region.id ? '⏹️ Stop Cinematic Narration' : '� Play Cinematic Narration'}
                                                        </button>
                                                    </div>
                                                    
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