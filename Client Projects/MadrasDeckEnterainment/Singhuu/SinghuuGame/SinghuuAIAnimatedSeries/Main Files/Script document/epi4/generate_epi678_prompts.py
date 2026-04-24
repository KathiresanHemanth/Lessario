import pypdf
import os
import re

def parse_and_generate(pdf_name, out_name):
    pdf_path = os.path.join(r'c:\Users\khkum\Documents\Lessario\Client Projects\MadrasDeckEnterainment\Singhuu\SinghuuGame\SinghuuAIAnimatedSeries\Main Files\Script document', pdf_name)
    with open(pdf_path, 'rb') as f:
        reader = pypdf.PdfReader(f)
        text = ''
        for i in range(len(reader.pages)):
            text += reader.pages[i].extract_text() + '\n'
    
    # Simple cleanup
    text = text.replace('\r\n', '\n')
    lines = text.split('\n')
    
    out_lines = []
    out_lines.append(f'# {pdf_name.replace(".pdf","")} - Grok AI Video Generation Prompts\n')
    out_lines.append('This file contains the complete breakdown of every video sequence needed to fill the ~22m runtime, focusing on dynamic motion and camera action tailored specifically for Grok Video/Sora/Runway generation.\n')
    out_lines.append('*Style Note:* These prompts are specifically optimized for AI *Video* Generation models (like Grok Video). They focus heavily on movement, time, camera physics, and continuity. All prompts use a base style of "High-quality 3D animated movie sequence, Pixar style, cinematic lighting and camera physics".\n\n---\n')
    
    shot_counter = 1
    current_scene = ''
    
    character_tags = {
        "Singu": "Singu (The Raja, Majestic Lion)",
        "Muttagose": "Muttagose (Energetic Rabbit)",
        "Moothavar": "Moothavar (Old Wise Tortoise)",
        "Thanthiraa": "Thanthiraa (Cunning Fox)",
        "Sssaarapaambu": "Sssaarapaambu (Green Snake)",
        "Suttapazham": "Suttapazham (Playful Monkey)",
        "Meenukutti": "Meenukutti (Swift Kingfisher Bird)",
        "Kongini": "Kongini (Powerful Bear)",
        "Balarani": "Balarani (Swift Leopard/Lioness)",
        "Sigmundi": "Sigmundi (Calm Hippopotamus)"
    }
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.startswith('SCENE ') or line.startswith('FINAL GAG SCENE'):
            current_scene = line.replace('–', '-').strip()
            out_lines.append(f'\n## {current_scene}\n')
            shot_counter = 1
            continue
            
        if line.isupper() and len(line) < 20 and not line.startswith('SCENE'):
            # Probably character name before dialogue
            continue
            
        if line.startswith('“') or line.startswith('"') or line.endswith('”') or line.endswith('"') or ':' in line[:15]:
            # Dialogue or Character declaration
            continue
            
        if 'Written by' in line or 'Runtime:' in line or 'Episode ' in line:
            continue
        
        # We consider any sentence an action if it's longer than 20 chars
        if len(line) > 20 and not line.startswith('“'):
            # Find Characters
            chars_in_shot = []
            for key, val in character_tags.items():
                if key.lower() in line.lower():
                    chars_in_shot.append(val)
            if not chars_in_shot:
                chars_in_shot.append("Animals/Extras or Environment")
                
            prompt = f'`High-quality 3D Pixar-style animated video sequence. {line}. Fluid dynamic motion, panning camera, highly detailed cinematic lighting.`'
            out_lines.append(f'**Shot {shot_counter}: Action Sequence**')
            out_lines.append(f'**Characters in Shot:** {", ".join(chars_in_shot)}')
            out_lines.append(f'**Prompt:** {prompt}\n')
            shot_counter += 1
            
    out_path = os.path.join(r'c:\Users\khkum\Documents\Lessario\Client Projects\MadrasDeckEnterainment\Singhuu\SinghuuGame\SinghuuAIAnimatedSeries\Main Files\Script document\epi4', out_name)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.writelines([l + '\n' for l in out_lines])

try:
    parse_and_generate('Singu - The Raja_E6_A Panic Wave.pdf', 'Episode6_Grok_Video_Prompts.md')
    print('Episode 6 done')
    parse_and_generate('Singu - The Raja_E7_The Unstoppable Force.pdf', 'Episode7_Grok_Video_Prompts.md')
    print('Episode 7 done')
    parse_and_generate('Singu - The Raja_E8_A Territory War.pdf', 'Episode8_Grok_Video_Prompts.md')
    print('Episode 8 done')
except Exception as e:
    import traceback
    traceback.print_exc()
