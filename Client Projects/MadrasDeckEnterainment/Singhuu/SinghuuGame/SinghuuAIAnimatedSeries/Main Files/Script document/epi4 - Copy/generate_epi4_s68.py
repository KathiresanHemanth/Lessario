import re

def generate_epi4_scenes(text_path, out_video, out_storyboard):
    with open(text_path, 'r', encoding='utf-8') as f:
        text = f.read()

    # Extract everything from Scene 6 to the end
    scene6_start = text.find('SCENE  6')
    if scene6_start == -1:
        scene6_start = text.find('SCENE 6')
        
    extracted_text = text[scene6_start:]
    lines = extracted_text.split('\n')

    actions = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        if line.startswith('SCENE ') or line.startswith('FINAL GAG SCENE'):
            actions.append(('SCENE', line.replace('–', '-').strip()))
            continue
            
        if line.isupper() and len(line) < 20 and not line.startswith('SCENE'):
            continue
            
        if line.startswith('“') or line.startswith('"') or line.endswith('”') or line.endswith('"') or ':' in line[:15]:
            continue
            
        # We consider any sentence an action if it's > 8 characters
        if len(line) > 8 and not line.startswith('“'):
            # Split very long sentences into two actions
            if len(line) > 60 and '.' in line[:-1]:
                parts = line.split('.', 1)
                actions.append(('ACTION', parts[0] + '.'))
                actions.append(('ACTION', parts[1]))
            else:
                actions.append(('ACTION', line))

    target_total_shots = 70 # Targeting roughly 70 shots for these ~8 minutes of content to match the 20 shots/gag ratio
    
    total_actions = sum(1 for type, content in actions if type == 'ACTION')
    expanded_actions = []
    
    for type, content in actions:
        if type == 'SCENE':
            expanded_actions.append((type, content))
        else:
            expanded_actions.append((type, content))
            if total_actions < target_total_shots:
                # Insert a small reaction or atmospheric shot to boost count
                expanded_actions.append(('ACTION', 'A cinematic, highly detailed emphasis shot focusing on the current scene\'s action.'))
                total_actions += 1

    character_tags = {
        "Singu": "Singu (The Raja, Majestic Lion)",
        "Muttagose": "Muttagose (Energetic Rabbit)",
        "Moothavar": "Moothavar (Old Wise Tortoise)",
        "Thanthiraa": "Thanthiraa (Cunning Fox)",
        "Sssaarapaambu": "Sssaarapaambu (Green Snake)",
        "Suttapazham": "Suttapazham (Playful Monkey)",
        "Meenukutti": "Meenukutti (Swift Kingfisher Bird)",
        "Kongini": "Kongini (Powerful Bear)",
        "Balarani": "Balarani (Swift Leopard/Lioness)"
    }

    # Generate Video Prompts
    out_lines_video = []
    out_lines_video.append('# Episode 4: Scene 6 to Scene 8 & Final Gag - Grok AI Video Prompts\n')
    out_lines_video.append('This file contains the breakdown for the final scenes of Episode 4. Pacing is adjusted to roughly match the desired shot count ratio (~20 shots for 3 minutes of runtime).\n')
    
    shot_counter = 1
    for type, content in expanded_actions:
        if type == 'SCENE':
            out_lines_video.append(f'\n## {content}\n')
        elif type == 'ACTION':
            chars_in_shot = [val for key, val in character_tags.items() if key.lower() in content.lower()]
            if not chars_in_shot:
                chars_in_shot.append("Animals/Extras or Environment Focus")
            prompt = f'`High-quality 3D Pixar-style animated video sequence. {content.strip(" .")}. Fluid dynamic motion, panning camera, highly detailed cinematic lighting.`'
            out_lines_video.append(f'**Shot {shot_counter}: Action/Reaction Video Sequence**')
            out_lines_video.append(f'**Characters in Shot:** {", ".join(chars_in_shot)}')
            out_lines_video.append(f'**Prompt:** {prompt}\n')
            shot_counter += 1

    with open(out_video, 'w', encoding='utf-8') as f:
        f.writelines([l + '\n' for l in out_lines_video])

    # Generate Storyboard Prompts
    out_lines_story = []
    out_lines_story.append('# Episode 4: Scene 6 to Scene 8 & Final Gag - Storyboard Image Prompts\n')
    out_lines_story.append('This file contains the breakdown for the final scenes of Episode 4 formatted for Midjourney/Image generation.\n')
    
    shot_counter = 1
    for type, content in expanded_actions:
        if type == 'SCENE':
            out_lines_story.append(f'\n## {content}\n')
        elif type == 'ACTION':
            chars_in_shot = [val for key, val in character_tags.items() if key.lower() in content.lower()]
            if not chars_in_shot:
                chars_in_shot.append("Animals/Extras or Environment Focus")
            prompt = f'`3D animated movie style frame. Cinematic shot. {content.strip(" .")}. Cinematic lighting, vibrant colors. Pixar style. --ar 16:9 --v 6.0`'
            out_lines_story.append(f'**Shot {shot_counter}: Cinematic Frame**')
            out_lines_story.append(f'**Characters in Shot:** {", ".join(chars_in_shot)}')
            out_lines_story.append(f'**Prompt:** {prompt}\n')
            shot_counter += 1

    with open(out_storyboard, 'w', encoding='utf-8') as f:
        f.writelines([l + '\n' for l in out_lines_story])

generate_epi4_scenes(
    r'C:\Users\khkum\.gemini\antigravity\brain\7cf67104-37a4-422d-b8b9-bde6d5453a65\scratch\epi4_script.txt',
    r'c:\Users\khkum\Documents\Lessario\Client Projects\MadrasDeckEnterainment\Singhuu\SinghuuGame\SinghuuAIAnimatedSeries\Main Files\Script document\epi4\Episode4_Scene6to8_Grok_Video_Prompts.md',
    r'c:\Users\khkum\Documents\Lessario\Client Projects\MadrasDeckEnterainment\Singhuu\SinghuuGame\SinghuuAIAnimatedSeries\Main Files\Script document\epi4\Episode4_Scene6to8_Storyboard_Prompts.md'
)
print("Done extracting Episode 4 Scene 6 to 8")
