const fs = require('fs');
const path = require('path');
const { parse } = require('json2csv');

async function run() {
    try {
        
        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];

        console.log(currentDate);
        
        // Load JSON file
        const inputFile = process.env.INPUT_FILE;
        const outputFile = process.env.OUTPUT_FILE;

        console.log(inputFile);
        console.log(outputFile);

        const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

        console.log(data);



        const flattenedData = data.deployments.map((deployment) => {
            const pullNumber = deployment.operation && deployment.operation.gitHubPullRequest ? deployment.operation.gitHubPullRequest.pullNumber : '';
    
            console.log(`Deployment: ${deployment.application}, Pull Number: ${pullNumber}`);  // Debug log to check pullNumber

            return {
                ReleaseDate: currentDate, 
                Application: deployment.application,
                ObjectName: "",
                version: deployment.version,
                JiraNumber: deployment.issues.map(issue => issue.key).join('; '),
                SourceCodeSystem: "GitHub",
                ApplicationReleaseID: `${deployment.application}-${pullNumber}`,  // Use the pullNumber here
                Platform: "MuleSoft"
            };
        });

        console.log(flattenedData);

        // Define fields for CSV
        const fields = [
            'ReleaseDate',
            'Application',
            'ObjectName',
            'version',
            'JiraNumber',
            'SourceCodeSystem',
            'ApplicationReleaseID',
            'Platform'          
            
        ];


        // Convert JSON to CSV
        const csv = parse(flattenedData, { fields });

        console.log(csv);

        // Write CSV to file
        fs.writeFileSync(outputFile, csv);
        console.log(`CSV file created at ${outputFile}`);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

run();
