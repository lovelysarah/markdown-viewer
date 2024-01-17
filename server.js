const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000; // You can change this to your desired port number

const distHandbookDir = path.join(__dirname, "dist", "handbook");

// Serve the index.html file

app.use("/assets", express.static(path.join(__dirname, "assets")));

// Serve dynamic JavaScript files
app.get("/assets/css/:fileName", (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(distHandbookDir, fileName);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send("File not found");
    }
});

app.get("/dist/handbook/:fileName", (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(distHandbookDir, fileName);

    if (fs.existsSync(filePath)) {
        if (fileName.endsWith(".js"))
            res.set("Content-Type", "application/javascript");
        res.sendFile(filePath);
    } else {
        res.status(404).send("File not found");
    }
});

app.get("/handbook/:fileName", (req, res) => {
    // List all the Markdown files in the directory
    const { fileName } = req.params;
    const markdownDir = path.resolve(__dirname, "handbook");
    const filePath = path.join(markdownDir, fileName);

    const isMDRequest = req.url.endsWith(".md");

    if (!isMDRequest) {
        res.sendFile(path.join(__dirname, "dist", "handbook", "handbook.html"));
        return;
    }

    // Serve each Markdown file
    res.sendFile(filePath);
});

// Serve the /dist/handbook/index.html file
app.get("*", (req, res) => {
    res.sendFile(path.join(distHandbookDir, "handbook.html"));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
