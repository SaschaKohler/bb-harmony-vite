import os
import re
import sys

def rename_png_files(directory):
    pattern = r'-300x169-1-400x250\.png$'
    
    for filename in os.listdir(directory):
        if filename.endswith('.png'):
            if re.search(pattern, filename):
                new_filename = re.sub(pattern, '.png', filename)
                old_file = os.path.join(directory, filename)
                new_file = os.path.join(directory, new_filename)
                os.rename(old_file, new_file)
                print(f'Umbenannt: {filename} -> {new_filename}')

if __name__ == "__main__":
    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = os.getcwd()
    
    print(f"Verarbeite Dateien in: {directory}")
    rename_png_files(directory)
