class ScanResult {
    url;
    element;
    pageName;
    
    constructor(url, element, pageName) {
        this.url = String(url);
        this.element = String(element);
        this.pageName = String(pageName);
    }
}

/**
 * Builds a ScanResult from an received object. Fails when any of the required properties is not present.
 * @param {object} result - result of a found blind xss vulnerability
 * @returns {ScanResult | null} A ScanResult object
 */
function toScanResult(result) {
    if (!result.url || !result.element || !result.pageName) {
        return;
    }
    
    return new ScanResult(result.url, result.element, result.pageName);
}


/**
 * Adds a ScanResult object to the found vulnerabilities table.
 * @param {ScanResult} result - The scan result to append to the found results table.
 * @returns {void}
 */
function appendNewResult(result) {
    if (!(result instanceof ScanResult)) {
        return;
    }
    
    const resultsList = document.getElementById("results-table");
    
    const resultRow = document.createElement('tr');
    const rowUrl = document.createElement('td');
    rowUrl.innerText = result.url;
    
    const rowElement = document.createElement('td');
    rowElement.innerText = result.element;
    
    const rowPageName = document.createElement('td');
    rowPageName.innerText = result.pageName;
    
    
    resultRow.appendChild(rowUrl);
    resultRow.appendChild(rowElement);
    resultRow.appendChild(rowPageName);
    
    resultRow.onclick = function() {
        updatePageView(result.url);
    }
    
    resultsList.appendChild(resultRow);
}


/**
 * Fetches a webpage by url, and displays it in the frontend.
 * @param {String} url - The url of the webpage that should be fetched.
 */
function updatePageView(url) {   
    const pageContainer = document.getElementById('page-container');
    pageContainer.src = url;
}

const testResult = new ScanResult(
    'http://localhost:8080/users/create-account',
    '<input type="text">...',
    'create user',
);

const validUrlResult = new ScanResult(
    'https://example.com/',
    '<input type="text">...',
    'Example Domain',
);

appendNewResult(testResult);
appendNewResult(validUrlResult);
updatePageView('https://example.com/');

