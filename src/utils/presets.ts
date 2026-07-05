/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CodePreset {
  name: string;
  language: string;
  domain: string;
  label: string;
  code: string;
}

export const CODE_PRESETS: CodePreset[] = [
  {
    name: "vulnerable-js",
    language: "javascript",
    domain: "security",
    label: "🚨 Vulnerable JS Express Server (Security Flaws)",
    code: `const express = require('express');
const mysql = require('mysql');
const app = express();

// SECURITY RISK: Hardcoded API Keys and credentials
const JWT_SECRET = "super_secret_key_123_dont_share_this_string_it_is_leaked";
const db_config = {
  host: 'localhost',
  user: 'root',
  password: 'AdminPassword!2026',
  database: 'customer_portal'
};
const connection = mysql.createConnection(db_config);

app.use(express.json());

// SECURITY RISK: SQL Injection vulnerability (direct string interpolation)
app.get('/api/users/search', (req, res) => {
  const queryParam = req.query.username;
  const sql = "SELECT id, username, email FROM users WHERE username = '" + queryParam + "'";
  
  connection.query(sql, (err, results) => {
    if (err) {
      // SECURITY RISK: Verbose error handling leaks system internals
      return res.status(500).json({ error: err.message, query: sql });
    }
    res.json(results);
  });
});

// SECURITY RISK: Cross-Site Scripting (XSS) via reflected input
app.get('/api/greet', (req, res) => {
  const name = req.query.name || 'Guest';
  res.send(\`<h1>Welcome Back, \${name}!</h1>\`);
});

app.listen(3000, () => {
  console.log("Server active on port 3000");
});`
  },
  {
    name: "unoptimized-python",
    language: "python",
    domain: "performance",
    label: "⏳ Slow Python Data Processor (Performance Flaws)",
    code: `import time

# PERFORMANCE RISK: O(N^2) complexity list lookup and slow reading
def find_matching_transactions(user_records, external_ledger):
    matching_pairs = []
    
    # Nested loops with no hashing can cause severe latency on large datasets
    for record in user_records:
        for ledger_entry in external_ledger:
            if record['id'] == ledger_entry['ref_id']:
                # PERFORMANCE RISK: Inefficient string concatenation in a hot loop
                record_summary = "User " + str(record['user_id']) + " matching " + ledger_entry['hash']
                matching_pairs.append({
                    "summary": record_summary,
                    "value": ledger_entry['amount']
                })
                
    return matching_pairs

# PERFORMANCE RISK: Redundant file opening in a loop
def process_logs_batch(log_filenames):
    total_entries = 0
    for filename in log_filenames:
        # Re-opening files instead of batching or caching reads
        with open(filename, 'r') as f:
            data = f.read()
            # Inefficient substring search
            for line in data.split('\\n'):
                if "ERROR" in line:
                    total_entries += 1
    return total_entries

# Simulate data
users = [{'id': i, 'user_id': i*10} for i in range(1000)]
ledger = [{'ref_id': i, 'hash': f"abc{i}", 'amount': i * 1.5} for i in range(1000)]

start = time.time()
pairs = find_matching_transactions(users, ledger)
print(f"Matched {len(pairs)} records in {time.time() - start:.4f}s")`
  },
  {
    name: "coupled-java",
    language: "java",
    domain: "architecture",
    label: "🧱 Coupled Java OOP (SOLID Violations)",
    code: `package com.app.order;

import java.util.ArrayList;

// ARCHITECTURE RISK: Violates Single Responsibility Principle (SRP)
// This class manages Order data, computes taxes, sends Emails, AND writes to database.
public class OrderProcessor {
    private ArrayList<String> items = new ArrayList<>();
    
    public void addItem(String item) {
        items.add(item);
    }

    public double calculateTotal() {
        double subtotal = items.size() * 12.99;
        // Hardcoded tax calculation (Violates Open-Closed Principle)
        return subtotal * 1.15;
    }

    public void processOrder(String customerEmail) {
        double total = calculateTotal();
        System.out.println("Processing order of total: $" + total);
        
        // ARCHITECTURE RISK: Tight coupling to MySQL DB helper (No dependency injection/abstraction)
        MySQLDatabase db = new MySQLDatabase();
        db.saveOrder(items, total);
        
        // ARCHITECTURE RISK: Tight coupling to SMTP service
        SMTPSender emailer = new SMTPSender();
        emailer.sendEmail(customerEmail, "Order Processed", "Your total is: $" + total);
    }
}

class MySQLDatabase {
    public void saveOrder(ArrayList<String> items, double total) {
        // Concrete database save code
        System.out.println("Saving order directly to MySQL...");
    }
}

class SMTPSender {
    public void sendEmail(String to, String subject, String body) {
        // Concrete SMTP logic
        System.out.println("Sending SMTP email directly to " + to);
    }
}`
  }
];
