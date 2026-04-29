import os
import re

files = ['E5.txt', 'E6.txt', 'E7.txt', 'E8.txt']
out_dir = 'dialogue extract'
os.makedirs(out_dir, exist_ok=True)

for file in files:
    if not os.path.exists(file):
        print(f"Skipping {file}, does not exist.")
        continue
        
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    out_lines = []
    out_lines.append(f"# Dialogues from {file.replace('.txt', '')}\n")
    
    lines = content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        # Clean zero-width space
        line = line.replace('\u200b', '').strip()
        
        # Check if line looks like a character name
        # Conditions: not empty, not starting with SCENE
        if line and not line.startswith("SCENE") and not line.startswith("FLASHBACK"):
            # Check if name part is uppercase
            name_part = line.split('(')[0].strip()
            # If it's all caps, or if it ends with a colon
            is_char = False
            if name_part.isupper() and len(name_part) > 1:
                is_char = True
            elif line.endswith(':'):
                is_char = True
                line = line[:-1].strip() # remove colon
                
            if is_char:
                # Look ahead for dialogue starting with quote
                # Or sometimes dialogue is on the same line if it had a colon
                if i + 1 < len(lines):
                    next_line = lines[i+1].strip().replace('\u200b', '')
                    if next_line.startswith('“') or next_line.startswith('"'):
                        char_name = line.title()
                        
                        dialogue_lines = []
                        j = i + 1
                        while j < len(lines):
                            d_line = lines[j].strip()
                            if not d_line:
                                # if blank line, might be end of dialogue or just paragraph break
                                # let's check if we've found closing quote
                                if dialogue_lines and (dialogue_lines[-1].endswith('”') or dialogue_lines[-1].endswith('"')):
                                    break
                            else:
                                dialogue_lines.append(d_line)
                                if d_line.endswith('”') or d_line.endswith('"'):
                                    break
                            j += 1
                            
                        if dialogue_lines:
                            dialogue_text = " ".join(dialogue_lines)
                            out_lines.append(f"* **{char_name}**: {dialogue_text}")
                            i = j # skip processed lines
                    elif line.endswith(':') and not next_line.startswith('“'):
                         # sometimes THANTHIRAA: Hehehe... 
                         pass
                         
        # Check if dialogue is inline like THANTHIRAA: Hehehe...
        if line and ':' in line and not line.startswith("SCENE"):
            parts = line.split(':', 1)
            char_part = parts[0].strip()
            if char_part.isupper():
                char_name = char_part.title()
                dialogue_text = parts[1].strip()
                if dialogue_text:
                     out_lines.append(f"* **{char_name}**: {dialogue_text}")

        i += 1
        
    out_file = os.path.join(out_dir, file.replace('.txt', '_dialogues.md'))
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out_lines))

print("Extraction complete.")
