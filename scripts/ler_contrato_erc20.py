import json
import urllib.request

RPC_URL = "https://publicnode.com"
CONTRATO = "0x9640Bb4eb644d05Ed5E928504cb69D00823BF7c5"
CARTEIRA = "0xB20718f5b2c16DA77CeFD6C1662BB1a1498948ED"

def chamar_rpc(metodo, params):
    payload = json.dumps({"jsonrpc": "2.0", "method": metodo, "params": params, "id": 1}).encode()
    req = urllib.request.Request(RPC_URL, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())["result"]

# Assinatura padrão ERC-20: totalSupply() -> 0x18160ddd
supply_hex = chamar_rpc("eth_call", [{"to": CONTRATO, "data": "0x18160ddd"}, "latest"])
supply_ccc = int(supply_hex, 16) / (10 ** 18)

# Assinatura padrão ERC-20: balanceOf(address) -> 0x70a08231 + endereço preenchido com zeros
data_saldo = "0x70a08231" + CARTEIRA.lower().replace("0x", "").zfill(64)
saldo_hex = chamar_rpc("eth_call", [{"to": CONTRATO, "data": data_saldo}, "latest"])
saldo_ccc = int(saldo_hex, 16) / (10 ** 18)

print("=== CONSULTA ON-CHAIN (ETHEREUM ERC-20) ===")
print(f"Contrato      : {CONTRATO}")
print(f"Oferta Total  : {supply_ccc:,.2f} CCC")
print(f"Saldo Carteira: {saldo_ccc:,.2f} CCC")
