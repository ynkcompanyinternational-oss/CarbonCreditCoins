#!/usr/bin/env bash
URL="https://onrender.com/wallet/ethereum/transactions"

echo "Consultando API YNK & Co..."
curl -sS --max-time 45 "$URL" | python3 -c '
import json, sys

try:
    d = json.load(sys.stdin)
    print("-" * 40)
    print("CONEXÃO            :", d.get("connected"))
    print("RECEBIMENTOS       :", d.get("received"))
    print("ENVIOS             :", d.get("sent"))
    print("TRANSAÇÕES         :", d.get("transaction_count"))
    print("PÁGINAS CONSULTADAS:", d.get("pages_scanned", "Versão anterior"))
    print("HISTÓRICO COMPLETO :", d.get("history_complete", "Não informado"))
    print("ERRO               :", d.get("error", "Nenhum"))
    print("-" * 40)
except Exception as e:
    print("Falha ao ler resposta JSON da API:", e)
'
