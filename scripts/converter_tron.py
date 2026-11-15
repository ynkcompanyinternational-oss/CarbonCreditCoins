import hashlib

ALFABETO_BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

def hex_para_base58(hex_str: str) -> str:
    dados = bytes.fromhex(hex_str.strip())
    checksum = hashlib.sha256(hashlib.sha256(dados).digest()).digest()[:4]
    numero = int.from_bytes(dados + checksum, "big")
    
    resultado = ""
    while numero > 0:
        numero, resto = divmod(numero, 58)
        resultado = ALFABETO_BASE58[resto] + resultado
    return resultado

if __name__ == "__main__":
    enderecos = {
        "ORIGEM": "41994a0597f4f2a445e80dcd560fdaac68d87b0d51",
        "DESTINO": "41a614f803b6fd780986a42c78ec9c7f77e6ded13c"
    }
    print("=== CONVERSÃO HEX -> BASE58 (TRON) ===")
    for nome, endereco in enderecos.items():
        print(f"{nome}: {hex_para_base58(endereco)}")
