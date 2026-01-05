
import sys

def search_in_file(filepath, keyword, context_chars=100):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        start_index = 0
        while True:
            index = content.find(keyword, start_index)
            if index == -1:
                break
                
            start = max(0, index - context_chars)
            end = min(len(content), index + len(keyword) + context_chars)
            print(f"Match at {index}: ...{content[start:end]}...")
            
            start_index = index + len(keyword)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python find_ctx.py <filepath>")
    else:
        search_in_file(sys.argv[1], "localStorage")
        print("\n--- Searching for 'setItem' ---")
        search_in_file(sys.argv[1], "setItem")
