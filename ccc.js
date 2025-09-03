// ccc.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

class Ccc {
    constructor(port = 3000) {
        this.app = express();
        this.port = port;

        this.modulesPath = path.join(__dirname, "modules");

        this.configure();
        this.load();
    }

    configure() {
        // Middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true })); // for form submissions

        // Session setup
        this.app.use(session({
            secret: process.env.SESSION_SECRET || 'supersecretkey',
            resave: false,
            saveUninitialized: true,
            cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
        }));

        // EJS setup
        this.app.set('view engine', 'ejs');
        // this.app.set('views', path.join(__dirname, 'modules/admin/views'));
        this.app.set("views", [
            path.join(__dirname, "modules/core/views"),
            // path.join(__dirname, "modules/admin/views"),
            path.join(__dirname, "modules/apiuser/views"),
        ]);

        // Static assets (css/js/images)
        this.app.use(express.static(path.join(__dirname, 'public')));
    }

    load() {
        if (!fs.existsSync(this.modulesPath)) {
            console.warn("⚠️ No modules folder found at:", this.modulesPath);
            return;
        }

        // Loop through each module (e.g. catalog, checkout, customer)
        const modules = fs.readdirSync(this.modulesPath, { withFileTypes: true });
        for (const module of modules) {
            if (module.isDirectory()) {
                const routesDir = path.join(
                    this.modulesPath,
                    module.name,
                    "routes"
                );
                if (fs.existsSync(routesDir)) {
                    this.#loadRoutesRecursively(routesDir, `/${module.name}`);
                }
            }
        }
    }

    /**
     * Recursive function to load routes (subfolders supported)
     */
    #loadRoutesRecursively(dir, baseRoute) {
        const files = fs.readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dir, file.name);

            if (file.isDirectory()) {
                // Recurse into subdirectory
                this.#loadRoutesRecursively(fullPath, `${baseRoute}/${file.name}`);
            } else if (file.isFile() && file.name.endsWith(".js")) {
                const routeBaseName = path.basename(file.name, ".js");

                // if file is "index.js" → mount at baseRoute
                const routePath =
                    routeBaseName === "index"
                        ? baseRoute
                        : path.join(baseRoute, routeBaseName);

                try {
                    const router = require(fullPath);

                    // Mount router
                    this.app.use(routePath, router);

                    console.log(`✅ Loaded route: ${routePath}`);
                } catch (err) {
                    console.error(`❌ Failed to load route ${fullPath}:`, err);
                }
            }
        }
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`🚀 Ccc server running at http://localhost:${this.port}`);
        });
    }
}

module.exports = Ccc;
