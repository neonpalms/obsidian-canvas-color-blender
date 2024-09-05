
export interface PluginSettings {
    edgeColorOption: 'source' | 'black' | 'white' | 'custom';
    customColor?: string; // Only applicable if edgeColorOption is 'custom'
}

export const DEFAULT_SETTINGS: Partial<PluginSettings> = {
    edgeColorOption: 'source',
    customColor: '#888888',
};
