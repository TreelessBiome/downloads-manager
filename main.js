const notifier = require("node-notifier");
const fs = require("fs");
const path = require("path");

const dir = "C:\\Users\\print\\Downloads"

fs.watch(dir, (eventType, filename) => {
    if (eventType === "rename" && filename) {


        const filePath = dir + "\\" + `${filename}`;
        const fileName = `${filename}`


        if (fs.existsSync(filePath)) {
            notifier.notify({
                title: "Downloads Folder",
                message: `📄 New file added: ${filename}`,
                sound: true
            });
        } else {
            notifier.notify({
                title: "Downloads Folder",
                message: `❌ File removed: ${filename}`,
                sound: true
            });
        }
    }
});

console.log(`Watching for new files in ${path}...`);


