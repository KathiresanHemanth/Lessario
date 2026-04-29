While there are no open-source tools that provide a massive, ready-to-use database of millions of contacts like Apollo or ZoomInfo (because hosting and verifying that much data costs millions of dollars), there are excellent **open-source tools for scraping and gathering this data yourself**.

If you are willing to do a bit of setup, you can use these open-source tools to build a list of 1,000+ legitimate contacts for free.

Here are the best open-source tools for gathering business contact details, categorized by how they work:

### 1. OSINT (Open-Source Intelligence) Tools for finding Emails
These tools are widely used by cybersecurity professionals and researchers to gather public information (like emails, employee names, and social profiles) associated with a specific company domain.

* **theHarvester**
    * **What it does:** You feed it a domain (e.g., `nike.com`), and it searches search engines (Google, Bing, Yahoo), LinkedIn, and other public data sources to find all email addresses and employee names associated with that domain.
    * **Best for:** Finding emails of decision-makers when you already have a list of target companies.
    * **Technical level:** Requires basic command-line knowledge (Python).
* **SpiderFoot**
    * **What it does:** A massive OSINT automation tool. You give it a target (like a company name or domain), and it queries over 100 public data sources to map out emails, phone numbers, and associated web pages.
    * **Best for:** Deep research on specific companies.
    * **Technical level:** Medium (has a web interface once installed).

### 2. Open-Source Web Scrapers (No-Code / Low-Code)
If you want to extract lists of companies and contacts from directories (like Yellow Pages, JustDial, LinkedIn, or industry-specific websites), these tools let you build scrapers without writing heavy code.

* **Portia (by Zyte)**
    * **What it does:** It is a visual web scraper. You open a webpage within Portia, click on the elements you want to extract (e.g., Company Name, Phone Number, Email), and it automatically generates a scraper to go through the rest of the pages and download the data to a CSV.
    * **Best for:** Scraping online business directories without knowing how to code.
* **Huginn**
    * **What it does:** Often described as an "open-source Zapier." You can create "agents" that monitor websites for changes, scrape data, and format it. 
    * **Best for:** Continuously monitoring industry websites and extracting new companies/contacts as they are added.

### 3. Open-Source Developer Frameworks (Requires Coding)
If you know a little bit of Python or JavaScript, these are the absolute best tools to gather exactly the data you want at scale.

* **Scrapy (Python)**
    * **What it does:** The most powerful open-source web crawling framework. You can write a script to navigate through thousands of pages on an industry directory and extract contact details in minutes.
    * **Best for:** Scraping tens of thousands of records fast and exporting directly to CSV/JSON.
* **Puppeteer (Node.js) / Playwright (Python/Node.js)**
    * **What it does:** These automate a real web browser (like Chrome). They are perfect for scraping websites that require you to log in first, click buttons, or scroll down (like LinkedIn or Google Maps).
    * **Best for:** Scraping dynamic websites or social media platforms.

### 4. Workflow Automation
* **n8n (Fair-code / Open-source version available)**
    * **What it does:** A free, self-hosted alternative to Make or Zapier. You can build workflows that automatically search Google Maps for "Sportswear companies in India," extract the websites, scan the websites for emails, and add them directly to a Google Sheet.

---

### The Reality Check: Trade-offs of Open Source
If you choose the open-source route to build a list of 1,000+ contacts, keep in mind:
1.  **You are gathering, not searching:** You will have to target specific directories or domains to scrape, rather than just using a simple search filter like "Show me 1,000 CEOs in Sports."
2.  **Email Verification:** Once you scrape emails using open-source tools, you still need to verify them so your emails don't bounce. You can do this using open-source SMTP ping scripts on GitHub (search for "Python email verifier").
3.  **Anti-Bot Protections:** Sites like LinkedIn aggressively block automated scraping. Open-source tools often get blocked unless you also use rotating proxy servers.

**Recommendation:** If you have zero technical background, trying to use open-source tools will take you much longer than it's worth. Using the free tiers of **Apollo.io** or **Hunter.io**, or buying a basic one-month subscription to a scraper like **PhantomBuster**, is usually much more cost-effective for a one-time project of 1,000 contacts.