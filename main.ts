import { Plugin, ItemView } from 'obsidian';
import { CanvasData, CanvasNodeData } from './types/canvas';
import { PluginSettings, DEFAULT_SETTINGS } from './plugin_settings';
import CanvasColor from './canvas_color';
import CanvasEvent from './events/canvas_event';
import CanvasEventPatcher from './events/canvas_event_patcher';


export default class CanvasColorBlenderPlugin extends Plugin {
    settings: PluginSettings;

    async onload() {
        this.settings = await this.loadPluginSettings();
        this.addSettingTab(new CanvasColorBlenderSettingTab(this.app, this));

        CanvasEventPatcher.init(this);

        this.registerEvent(this.app.workspace.on(
            // @ts-ignore
            CanvasEvent.CanvasSaved.Before, (...args: any) => {
                this.updateAllNodeColorsBasedOnEdges();
                this.saveCanvas();
            }
        ));

        console.log("%cCanvas color blender plugin loaded.", "color:#4000FF;");
    }


    /**
     * Iterate through all edges and update the node colors based on each. Then save the original colors.
     */
    async updateAllNodeColorsBasedOnEdges() {
        const canvasView = this.app.workspace.getActiveViewOfType(ItemView);
        // @ts-ignore
        const canvas: CanvasData = canvasView?.canvas;

        // Get all nodes with connections
        const connections = new Map<CanvasNodeData, CanvasNodeData[]>();
        for (const edge of canvas.edges) {
            const toNode = edge[1].to.node;
            const fromNode = edge[1].from.node;
            if (!connections.has(toNode)) {
                connections.set(toNode, []);
            }
            connections.get(toNode)?.push(fromNode);
        }

        connections.forEach((fromNodes: CanvasNodeData[], toNode: CanvasNodeData) => {
            if (fromNodes.length == 1) {
                let fromNode: CanvasNodeData = fromNodes[0];
                switch (this.settings.edgeColorOption) {
                    case 'source':
                        toNode.color = fromNode.color;
                        break;
                    case 'black':
                        toNode.color = CanvasColor.avg([fromNode.color as string, "#000000"]);
                        break;
                    case 'white':
                        toNode.color = CanvasColor.avg([fromNode.color as string, "#FFFFFF"]);
                        break;
                    case 'custom':
                        console.log(this.settings.customColor);
                        toNode.color = CanvasColor.avg([fromNode.color as string, this.settings.customColor as string]);
                        break;
                }
            } else if (fromNodes.length > 1) {
                toNode.color = CanvasColor.avg(fromNodes);
            }
        });

        this.saveCanvas();
    }

    /**
     * Re-renders the canvas and saves the original color data of each color in a plugin file.
     */
    async saveCanvas() {
        const canvasView = this.app.workspace.getActiveViewOfType(ItemView);
        // @ts-ignore
        const canvas: CanvasData = canvasView?.canvas;
        canvas.rerenderViewport();
        this.savePluginSettings();
    }

    async savePluginSettings() {
        await this.saveData(this.settings);
        // console.log("%cPlugin data saved.", "color:#FF00FF");
    }

    async loadPluginSettings(): Promise<PluginSettings> {
        return Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        // console.log("%cPlugin data loaded.", "color:#FF00FF");
    }

    async onunload() {
        console.log("%cCanvas color blender plugin unloaded.", "color:#4000FF;");
    }
}


import { PluginSettingTab, App, Setting } from 'obsidian';


class CanvasColorBlenderSettingTab extends PluginSettingTab {
    constructor(app: App, private plugin: CanvasColorBlenderPlugin) {
        super(app, plugin);
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('Treat Uncolored Node As Color')
            .setDesc('When making an edge to an uncolored node, treat the uncolored node\'s color as:')
            .addDropdown(dropdown => dropdown
                .addOption('source', 'The source node\'s color')
                .addOption('black', 'Plain black (#000000)')
                .addOption('white', 'Plain white (#FFFFFF)')
                .addOption('custom', 'A custom color')
                .setValue(this.plugin.settings.edgeColorOption)
                .onChange(async (value) => {
                    this.plugin.settings.edgeColorOption = value as 'source' | 'black' | 'white' | 'custom';
                    await this.plugin.savePluginSettings();
                    this.updateVisibility(colorPickerSetting);
                })
            );

        const colorPickerSetting = new Setting(containerEl)
            .setName('Custom Blend Color')
            .setDesc('Choose a custom color to treat uncolored nodes as.')
            .addText(text => text
                .setValue(this.plugin.settings.customColor ?? '#888888')
                .onChange(async (value) => {
                    this.plugin.settings.customColor = value;
                    await this.plugin.savePluginSettings();
                })
            );

        this.updateVisibility(colorPickerSetting);
    }

    private updateVisibility(colorPickerSetting: Setting) {
        const isCustomColor = this.plugin.settings.edgeColorOption === 'custom';
        colorPickerSetting.settingEl.style.display = isCustomColor ? 'block' : 'none';
    }
}