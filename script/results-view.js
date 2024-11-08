class ScanResult {
    url;
    elementSelector;
    pageName;
    
    constructor(url, elementSelector, pageName) {
        this.url = String(url);
        this.elementSelector = String(elementSelector);
        this.pageName = String(pageName);
    }
}

/**
 * Builds a ScanResult from a received object. Fails when any of the required properties is not present.
 * @param {object} result - result of a found blind xss vulnerability
 * @returns {ScanResult | null} A ScanResult object
 */
function toScanResult(result) {
    if (!result.url || !result.elementSelector || !result.pageName) {
        return;
    }
    
    return new ScanResult(result.url, result.elementSelector, result.pageName);
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
    rowElement.innerText = result.elementSelector;
    
    const rowPageName = document.createElement('td');
    rowPageName.innerText = result.pageName;
    
    
    resultRow.appendChild(rowUrl);
    resultRow.appendChild(rowElement);
    resultRow.appendChild(rowPageName);
    
    resultRow.onclick = function() {
        updatePageView(result);
    }
    
    resultsList.appendChild(resultRow);
}


/**
 * Fetches a webpage based on a ScanResult, and highlights the vulnerable component.
 * @param {ScanResult} result - The ScanResult that should be used to display a vulnerable webpage.
 */
function updatePageView(result) {   
    const pageContainer = document.getElementById('page-container');
    pageContainer.src = result.url;
    
    pageContainer.onload = () => {
        highlightElementBySelector(result.elementSelector);
    }
}

/**
 * Highlight the first element found by the given query selector.
 * @param {String} querySelector - The query selector to get the element that should be highlighted.
 */
function highlightElementBySelector(querySelector) {
    const pageContainer = document.getElementById('page-container');
    const iframedocument = pageContainer.contentDocument || pageContainer.contentWindow.document;
    
    if (!iframedocument) {
        console.error('Failed to access iframe document');
        return;
    }
    
    const foundElement = iframedocument.querySelector(querySelector);
    if (!foundElement) {
        console.error('Failed to find vulnerable element based on the provided query selector.');
        return;
    }
    
    foundElement.style.outline = "5px solid red";
}

const testResult = new ScanResult(
    'http://localhost:8080/users/create-account',
    '#username-input',
    'create user',
);

const validUrlResult = new ScanResult(
    'https://example.com/',
    'h1',
    'Example Domain',
);

const testAppResult = new ScanResult(
    'http://localhost:5173/',
    '#counter',
    'test app',
);

appendNewResult(testResult);
appendNewResult(validUrlResult);
appendNewResult(testAppResult);
