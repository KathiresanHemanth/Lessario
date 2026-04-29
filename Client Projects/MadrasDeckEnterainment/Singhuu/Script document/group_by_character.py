import os
import re
from collections import defaultdict

in_dir = 'dialogue extract'
out_dir = os.path.join(in_dir, 'grouped_characters')
os.makedirs(out_dir, exist_ok=True)

episodes = ['E5', 'E6', 'E7', 'E8']
character_dialogues = defaultdict(lambda: defaultdict(list))

# Parse markdown files
for ep in episodes:
    file_path = os.path.join(in_dir, f'{ep}_dialogues.md')
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for line in lines:
        line = line.strip()
        if line.startswith('* **'):
            # Match '* **CharacterName**: "Dialogue"'
            match = re.match(r'\* \*\*([^*:]+)\*\*:?\s*(.*)', line)
            if match:
                char_raw = match.group(1).strip()
                dialogue = match.group(2).strip()
                
                # Clean up character name (remove parentheticals and colons)
                # E.g., "Singu (Softly)" -> "Singu"
                char_clean = char_raw.split('(')[0].strip()
                if char_clean.endswith(':'):
                     char_clean = char_clean[:-1].strip()
                     
                char_clean = char_clean.title()
                
                character_dialogues[char_clean][ep].append(f'* **{char_raw}**: {dialogue}')

# Write to new files
for char, eps_data in character_dialogues.items():
    out_file = os.path.join(out_dir, f'{char}.md')
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(f'# {char} - Dialogues (Epi 5 - 8)\n\n')
        
        for ep in episodes:
            if ep in eps_data:
                f.write(f'## Epi {ep[1]}\n\n')
                for d_line in eps_data[ep]:
                    f.write(f'{d_line}\n')
                f.write('\n')

print(f"Generated character files in {out_dir}")
