import json
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen
from datetime import datetime, timezone
from decimal import Decimal

key = ""
for line in Path(".env.local").read_text().splitlines():
    if line.startswith("ETHERSCAN_API_KEY="):
        key = line.split("=", 1)[1].strip()

if not key:
    raise SystemExit("ERRO: API Key nao encontrada")

contract = "0x9640Bb4eb644d05Ed5E928504cb69D00823BF7c5"

params = {
    "chainid": "1",
    "module": "account",
    "action": "tokentx",
    "contractaddress": contract,
    "page": "1",
    "offset": "100",
    "sort": "desc",
    "apikey": key
}

url = "https://api.etherscan.io/v2/api?" + urlencode(params)

with urlopen(url, timeout=30) as response:
    data = json.load(response)

if data.get("status") != "1":
    raise SystemExit("API: " + str(data.get("message")))

records = []

for tx in data["result"]:
    decimals = int(tx["tokenDecimal"])
    amount = Decimal(tx["value"]) / Decimal(10) ** decimals

    records.append({
        "hash": tx["hash"],
        "from": tx["from"],
        "to": tx["to"],
        "amount_ccc": format(amount, "f"),
        "timestamp": int(tx["timeStamp"])
    })

output = {
    "token": "CCC",
    "network": "Ethereum",
    "contract": contract,
    "updated_at": datetime.now(timezone.utc).isoformat(),
    "transfers": records
}

Path("data/ccc-transfers.json").write_text(
    json.dumps(output, indent=2),
    encoding="utf-8"
)

print("DADOS CCC: OK")
print("TRANSFERENCIAS RECEBIDAS:", len(records))
print("ARQUIVO: data/ccc-transfers.json")
