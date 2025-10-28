// NLWEB Integration - Microsoft's Natural Language Web principles
// This implements NLWEB concepts while preserving the existing project structure

export interface NLWEBConfig {
    semanticEnrichment: boolean;
    contextualLinking: boolean;
    naturalLanguageProcessing: boolean;
}

export class NLWEBProcessor {
    private config: NLWEBConfig;

    constructor(config: NLWEBConfig = {
        semanticEnrichment: true,
        contextualLinking: true,
        naturalLanguageProcessing: true
    }) {
        this.config = config;
    }

    // NLWEB semantic enrichment for historical content
    enrichContent(content: string, context: { era: string, region: string }): string {
        if (!this.config.semanticEnrichment) return content;
        
        // Add semantic markers for NLWEB processing
        return content.replace(/(\d{4})\s*(BCE|CE)/g, '<nlweb:date>$1 $2</nlweb:date>')
                     .replace(/([A-Z][a-z]+\s+Empire|Kingdom|Dynasty)/g, '<nlweb:entity type="political">$1</nlweb:entity>')
                     .replace(/([A-Z][a-z]+\s+civilization)/gi, '<nlweb:entity type="civilization">$1</nlweb:entity>');
    }

    // NLWEB contextual linking between related concepts
    generateContextualLinks(content: string, relatedRegions: string[]): Array<{text: string, context: string}> {
        if (!this.config.contextualLinking) return [];
        
        const links: Array<{text: string, context: string}> = [];
        
        relatedRegions.forEach(region => {
            if (content.toLowerCase().includes(region.toLowerCase())) {
                links.push({
                    text: region,
                    context: `Related region in the same historical period`
                });
            }
        });
        
        return links;
    }

    // NLWEB natural language processing for better readability
    processNaturalLanguage(content: string): {
        readabilityScore: number;
        keyPhrases: string[];
        sentiment: 'educational' | 'engaging' | 'academic';
    } {
        if (!this.config.naturalLanguageProcessing) {
            return { readabilityScore: 0, keyPhrases: [], sentiment: 'academic' };
        }

        // Simple NLP analysis for educational content
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const avgWordsPerSentence = content.split(' ').length / sentences.length;
        const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 2)));
        
        // Extract key historical terms
        const keyPhrases = content.match(/[A-Z][a-z]+\s+(Empire|Kingdom|Dynasty|civilization|period|age)/gi) || [];
        
        // Determine content sentiment based on educational keywords
        const educationalWords = ['discover', 'explore', 'fascinating', 'remarkable', 'significant'];
        const sentiment = educationalWords.some(word => 
            content.toLowerCase().includes(word)
        ) ? 'engaging' : 'academic';

        return { readabilityScore, keyPhrases: [...new Set(keyPhrases)], sentiment };
    }

    // NLWEB content optimization for better user experience
    optimizeForNLWEB(content: string, metadata: any): {
        enrichedContent: string;
        contextualLinks: Array<{text: string, context: string}>;
        nlpAnalysis: any;
    } {
        const enrichedContent = this.enrichContent(content, metadata);
        const contextualLinks = this.generateContextualLinks(content, metadata.relatedRegions || []);
        const nlpAnalysis = this.processNaturalLanguage(content);

        return {
            enrichedContent,
            contextualLinks,
            nlpAnalysis
        };
    }
}