// Copy this entire file - save as gov-vault.js
class GovInfoTest {
  constructor() {
    this.apiKey = 'kQZZJ61PPt1MuLokMJmekCAoberGOSCS6Sx9Hy3Zp';
    this.baseUrl = 'https://api.govinfo.gov/';
  }

  async testBillSearch(query = '', congress = '') {
    try {
      let url = `${this.baseUrl}collections/BILLS/search?api_key=${this.apiKey}&pageSize=5`;
      if (query) url += `&query=${encodeURIComponent(query)}`;
      if (congress) url += `&congress=${congress}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return { success: true, results: data.results || [] };
      }
      return { success: false, error: `HTTP ${response.status}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

class GovDataParser {
  formatUnifiedResults(data) {
    let output = `GOVERNMENT DATA SEARCH - ${data.query}\n`;
    output += `Results: ${data.metadata.totalResults} | Time: ${data.metadata.searchTime}\n\n`;
    
    if (data.results.legislative?.data?.length > 0) {
      output += `📜 LEGISLATIVE (${data.results.legislative.total})\n`;
      data.results.legislative.data.forEach(item => {
        output += `[${item.id}] ${item.title.substring(0,50)}...\n`;
        output += `    Congress: ${item.congress} | Date: ${item.date}\n\n`;
      });
    }
    
    return output;
  }
}

// Export for use in your terminal
window.GovInfoTest = GovInfoTest;
window.GovDataParser = GovDataParser;

