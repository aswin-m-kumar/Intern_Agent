import urllib.request, json
import time

try:
    req = urllib.request.Request('https://api.github.com/repos/aswin-m-kumar/Intern_Agent/actions/runs', headers={'User-Agent': 'test'})
    resp = urllib.request.urlopen(req)
    data = json.loads(resp.read().decode())
    
    for r in data['workflow_runs'][:3]:
        print(f"{r['name']} - Status: {r['status']} - Conclusion: {r['conclusion']} - Updated: {r['updated_at']}")
except Exception as e:
    print(e)
