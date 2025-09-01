const notifier = require("node-notifier");
const fsSync = require("fs");
const fs = require("fs").promises;
const path = require("path");

const dir = "C:\\Users\\print\\Downloads";
const tempExtensions = [".crdownload", ".part", ".tmp"];
fsSync.watch(dir, (eventType, filename) => {
    if (tempExtensions.includes(path.extname(filename))) {
        console.log(`⏳ Ignoring temp file: ${filename}`);
        return;
    }
    if (eventType === "rename" && filename) {
        const filePath = path.join(dir, filename);

        if (fsSync.existsSync(filePath)) {
            notifier.notify({
                title: "Downloads Folder",
                message: `📄 New file added: ${filename}\nTransfer initiated.`,
                sound: true,
            });

            const ext = path.extname(filename).replace(".", ""); // e.g. "pdf"
            const targetDir = path.join("C:\\Users\\print\\Downloads", ext); // change base path

            moveFile(filePath, targetDir, filename)
                .then(() => {
                    notifier.notify({
                        title: "Downloads Folder",
                        message: `✅ New file added to ${ext} directory: ${filename}`,
                        sound: true,
                    });
                })
                .catch((err) => {
                    notifier.notify({
                        title: "Downloads Folder",
                        message: `❌ New file transfer failed to ${ext} directory: ${filename}`,
                        sound: true,
                    });
                });
        }
    }
});

console.log(`Watching for new files in ${dir}...`);

async function moveFile(sourceFile, targetDir, fileName) {
    const targetFile = path.join(targetDir, fileName);

    try {
        await fs.mkdir(targetDir, { recursive: true });
        await fs.rename(sourceFile, targetFile);

        console.log("File moved successfully");
    } catch (err) {
        if (err.code === "ENOENT") {
            console.log("Source file does not exist");
        } else {
            console.error("Error moving file:", err);
        }
        throw err;
    }
}
