
// import { defineConfig } from "vitest/config";


// import path from "path";
// export default defineConfig({
//     test: {
//         environment: 'jsdom',
//         globals: true, // it,describe.expect remove cheyadaniki 
//         setupFiles: ["tests/setup.ts",'allure-vitest/setup'],
//     },
//     resolve: {
//         alias: {
//             '@': path.resolve(__dirname, './src'),
//         },
//     },
// })


// import AllureReporter from "allure-vitest/reporter";
// import path from "path";
// import { defineConfig } from "vitest/config";

// export default defineConfig({
//   test: {
//     environment:"jsdom",
//     globals:true,
//     setupFiles: ["allure-vitest/setup,tests/setup.ts"],
//     reporters: [
//       "verbose",
//       [
//         "allure-vitest/reporter",
//         {
//           resultsDir: "allure-results",
//         },
//       ],
//     ],
//   },
//    resolve: {
//         alias: {
//             '@': path.resolve(__dirname, './src'),
//         }}
// });


// vitest.config.ts

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true, // it, describe, expect global scope lo use cheyadaniki
        
        // Ensure 'allure-vitest/setup' is present here
        setupFiles: [
            "tests/setup.ts",
            'allure-vitest/setup'
        ],
        
        // 👇 ADDED: The Allure Reporter Configuration
        reporters: [
            'default', // Displays the standard Vitest output
            [ 
                'allure-vitest/reporter', 
                {
                    // Optional: You can specify a custom directory for results
                    // If omitted, it defaults to 'allure-results'
                    resultsDir: './allure-results',
                } 
            ],
        ],
    },
    resolve: {
        alias: {
            // Your existing shadcn/ui path alias
            '@': path.resolve(__dirname, './src'),
        },
    },
});