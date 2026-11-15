// Conector Oficial Carbon Credit Coins (CCC) - Rede Ethereum (ERC-20)
const CCC_CONFIG = {
  contract: "0x9640Bb4eb644d05Ed5E928504cb69D00823BF7c5",
  treasury: "0xB20718f5b2c16DA77CeFD6C1662BB1a1498948ED",
  decimals: 18,
  rpc: "https://llamarpc.com",
  transfersJson: "./data/ccc-transfers.json"
};

async function carregarDadosCCC() {
  try {
    // 1. Lê o histórico real gerado pelo atualizar_ccc.py
    const resp = await fetch(CCC_CONFIG.transfersJson + "?t=" + Date.now());
    if (resp.ok) {
      const dados = await resp.json();
      window.CCC_TRANSFERS = dados.transfers || [];
      console.log("CCC Histórico carregado:", window.CCC_TRANSFERS.length, "transações");
    }

    // 2. Consulta o Total Supply real direto na Ethereum Mainnet
    const rpcResp = await fetch(CCC_CONFIG.rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_call",
        params: [{ to: CCC_CONFIG.contract, data: "0x18160ddd" }, "latest"],
        id: 1
      })
    });
    const rpcJson = await rpcResp.json();
    if (rpcJson.result) {
      const supply = Number(BigInt(rpcJson.result) / (10n ** 18n));
      window.CCC_SUPPLY = supply;
      console.log("CCC Supply On-Chain:", supply.toLocaleString("pt-BR"));
    }
  } catch (err) {
    console.warn("Aviso ao sincronizar dados CCC:", err);
  }
}

document.addEventListener("DOMContentLoaded", carregarDadosCCC);
