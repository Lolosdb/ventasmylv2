
path = r"C:\Users\lolos\Desktop\App Ventas\index-NVVWiGcP.js"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Search for initialization
# const [t, setT] = useState(() => { ... localStorage.getItem("orders") ... })
# Minified: const[t,n]=r.useState((()=>{const e=localStorage.getItem("orders");return e?JSON.parse(e):[]}))

kw = 'getItem("orders")'
idx = content.find(kw)

if idx != -1:
    print(f"Found '{kw}' at {idx}")
    # Context around initialization
    print(content[idx-100:idx+200])
else:
    print("Not found")
