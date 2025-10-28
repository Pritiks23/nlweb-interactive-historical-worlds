import { WorldManager } from './worlds';
import { RegionManager } from './regions';
import { TIME_PERIODS } from './data/time-periods';
import React from 'react';
import ReactDOM from 'react-dom';
import WorldViewer from './components/WorldViewer';

const worldManager = new WorldManager();
const regionManager = new RegionManager();

const initializeApp = async () => {
    try {
        console.log('Initializing NLWEB Historical Worlds App...');
        
        // Load worlds from time periods data
        await worldManager.loadWorld(TIME_PERIODS);
        const worlds = worldManager.getWorlds();
        
        // Load regions from the worlds
        const regions = regionManager.loadRegions(worlds);
        
        console.log(`Loaded ${worlds.length} worlds and ${regions.length} regions`);

        // Render the React application
        ReactDOM.render(
            <WorldViewer worlds={worlds} regions={regions} />,
            document.getElementById('root')
        );
        
        console.log('App initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        
        // Show error message to user
        const rootElement = document.getElementById('root');
        if (rootElement) {
            rootElement.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #d32f2f;">
                    <h2>Failed to load the application</h2>
                    <p>Please check the console for more details.</p>
                    <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
                </div>
            `;
        }
    }
};

// Initialize the app when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}