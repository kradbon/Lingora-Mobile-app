from pathlib import Path
import re

text = Path(r"C:\Users\user\Desktop\Lingora python\Lingora\frontend-only\src\data\lessons.ts").read_text(encoding='utf-8')
pattern = re.compile(r"ls\(\n\s*'([^']*)',\n\s*'([^']*)',\n\s*'([^']*)'", re.MULTILINE)
count = 0
samples = 0
for m in pattern.finditer(text):
    tg = m.group(3)
    if '?' in tg:
        count += tg.count('?')
        if samples < 5:
            safe = tg.encode('cp1251', 'backslashreplace').decode('cp1251')
            print(safe)
            samples += 1
print('tg ? count', count)
