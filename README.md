# Canvas Color Blender Plugin for ObsidianMD

This plugin automatically adjusts the color of "blank" nodes based on the colors of the nodes they are connected to. It simplifies managing node aesthetics by blending colors from edges, providing a more dynamic & visually intuitive graph.

## Features

- **Automatic Node Color Blending**: When you create an edge between two colored nodes & a blank node, the blank node's color is automatically updated to a blend of the connected node colors
- **Supports Multiple Nodes**: The plugin works seamlessly whether you're connecting two or more colored nodes to a blank node
- **Color Blending**: If a blank node is connected to a blue node & a red node, it will turn purple (or the equivalent color blend)

![Canvas Color Blender Example](example.png)

## Installation

1. Open **Options** >> **Community plugins** & click **"Turn on community plugins"**, leave this tab open
2. Download `main.js` & `manifest.json` from the [latest release](https://github.com/neonpalms/obsidian-canvas-color-blender/releases/latest)
3. Make a subdirectory in your vault's `.obsidian/plugins/` directory (name whatever you want, e.g. `obsidian-canvas-color-blender`)
    - If you don't have a `plugins/` directory, you can make that too
4. Move `main.js` & `manifest.json` into the directory you just made
5. Back to Obsidian, refresh the **Installed plugins** pane & activate the new plugin

## Usage

1. Create nodes & assign colors to them using the built-in color system or custom attributes
2. Add a blank node (one without a color)
3. Create edges between the colored nodes & the blank node
4. The blank node will automatically update to a blended color based on its connections

## Customization

- You can adjust the color blending behavior by modifying the plugin settings
- The plugin supports both default & custom colors

## Compatibility

This plugin was built for ObsidianMD version `1.6.7` but should work with all versions that support the Canvas core plugin.

## Feedback & Contributions

Feel free to open an issue or submit a pull request on GitHub if you'd like to suggest features or report bugs!
