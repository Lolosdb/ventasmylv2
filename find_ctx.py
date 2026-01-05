import sys
import os

def find_context(file_path, search_str, context_size=100):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    start = 0
    while True:
        idx = content.find(search_str, start)
        if idx == -1:
            break
        
        ctx_start = max(0, idx - context_size)
        ctx_end = min(len(content), idx + len(search_str) + context_size)
        
        print(f"Found occurrence at index {idx}:")
        print("---")
        print(content[ctx_start:ctx_end])
        print("---\n")
        
        start = idx + 1

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python find_ctx.py <file> <string>")
    else:
        find_context(sys.argv[1], sys.argv[2])
