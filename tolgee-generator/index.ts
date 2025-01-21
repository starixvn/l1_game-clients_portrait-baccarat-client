import { DevTools, Tolgee } from "@tolgee/web";
import fs from "fs";

// Configuration constants
const CONFIG = {
    files: {
        languageFolder: "./src/assets/resources/i18n/",
        remoteLocalizationPath: "./src/remote/localization",
    },
    languages: ["en", "id", "th", "vi", "zh_cn", "zh_tw"],
    namespaces: {
        list: ["Common", "BaccaratX", "blockchainBaccarat", "ui"],
        specificKeys: {
            ui: ["choice_big", "choice_small"],
            blockchainBaccarat: ["banker_win"],
        },
        shouldFilterKeys: (ns: string) => Object.keys(CONFIG.namespaces.specificKeys).includes(ns),
        getSpecificKeys: (ns: string) => CONFIG.namespaces.specificKeys[ns as keyof typeof CONFIG.namespaces.specificKeys] || []
    },
    remoteKeys: {
        game_name: "gameNames",
        game_icon_name: "lobbyNames"
    },
    tolgeeConfig: {
        defaultLanguage: "en",
        apiKey: "tgpak_gvpw45brha2xg3btoztxeytunvudc5dbn5twqodtonztc",
        apiUrl: "https://tolgee.sabagame.com/",
        projectId: "5",
        defaultNs: "messages",
    }
};

function writeFile(fileName: string, content: string, extension = "ts") {
    fs.writeFileSync(`${fileName}.${extension}`, content, {
        encoding: "utf8",
        flag: "w",
    });
}

// Initialize Tolgee with configuration
const tg = Tolgee().use(DevTools()).init({
    ...CONFIG.tolgeeConfig,
    availableLanguages: CONFIG.languages,
    ns: CONFIG.namespaces.list,
});

tg.run();

tg.on("initialLoad", async () => {
    const languages: {
        [languageId: string]: {
            [ns: string]: {
                [key: string]: string;
            };
        };
    } = {};

    let remoteNames: {
        [propertyName: string]: {
            [languageId: string]: string;
        };
    } = Object.values(CONFIG.remoteKeys).reduce((acc, key) => ({ ...acc, [key]: {} }), {});

    for (const languageId of CONFIG.languages) {
        await tg.changeLanguage(languageId);
        languages[languageId] = {};

        // First process namespaces with specific keys
        const namespacesWithSpecificKeys = CONFIG.namespaces.list.filter(ns => CONFIG.namespaces.shouldFilterKeys(ns));
        const namespacesWithFullKeys = CONFIG.namespaces.list.filter(ns => !CONFIG.namespaces.shouldFilterKeys(ns));

        // Process namespaces with specific keys first
        namespacesWithSpecificKeys.forEach((ns) => {
            tg.getAllRecords().forEach((record) => {
                if (record.namespace == ns) {
                    languages[languageId][ns] = {};
                    record.data.forEach((value, key) => {
                        if (CONFIG.namespaces.getSpecificKeys(ns).includes(key)) {
                            languages[languageId][ns][key] = value as string;
                        }

                        // Handle remote names
                        Object.entries(CONFIG.remoteKeys).forEach(([remoteKey, propertyName]) => {
                            if (key === remoteKey) {
                                remoteNames[propertyName][languageId] = value as string;
                            }
                        });
                    });
                }
            });
        });

        // Then process namespaces with full keys
        namespacesWithFullKeys.forEach((ns) => {
            tg.getAllRecords().forEach((record) => {
                if (record.namespace == ns) {
                    languages[languageId][ns] = {};
                    record.data.forEach((value, key) => {
                        languages[languageId][ns][key] = value as string;

                        // Handle remote names
                        Object.entries(CONFIG.remoteKeys).forEach(([remoteKey, propertyName]) => {
                            if (key === remoteKey) {
                                remoteNames[propertyName][languageId] = value as string;
                            }
                        });
                    });
                }
            });
        });

        // Generate language file content
        const languageScript = `const win = window as any;
export const languages = {0};

if (!win.languages) {
    win.languages = {};
}

win.languages.${languageId} = languages;`;

        writeFile(
            CONFIG.files.languageFolder + languageId,
            languageScript.replace("{0}", JSON.stringify(languages[languageId], null, 4))
        );
    }

    // Generate index file
    const indexContent = CONFIG.languages
        .map(lang => `export * as ${lang} from "./${lang}";`)
        .join('\n');
    writeFile(CONFIG.files.languageFolder + "index", indexContent);

    // Generate remote localization file
    writeFile(CONFIG.files.remoteLocalizationPath, JSON.stringify(remoteNames, null, 4), "json");

    console.log("Generated done!");
});
