const win = window as any;
export const languages = {
    "Common": {},
    "Baccarat": {}
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh_cn = languages;