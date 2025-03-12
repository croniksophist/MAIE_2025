import os

root_dir = "D:/MAIE_Framework"
with open("py_file_hierarchy.txt", "w") as f:
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            f.write(os.path.join(dirpath, filename) + '\n')