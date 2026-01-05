
import sys

def search_context(filepath, keyword, context=2000):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        start = 0
        while True:
            idx = content.find(keyword, start)
            if idx == -1:
                break
            
            snippet = content[max(0, idx - context):min(len(content), idx + len(keyword) + context)]
            print(f"MATCH at {idx}:")
            print("--------------------------------------------------")
            print(snippet)
            print("--------------------------------------------------")
            start = idx + 1
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    search_context(sys.argv[1], "Nuevo Pedido")
