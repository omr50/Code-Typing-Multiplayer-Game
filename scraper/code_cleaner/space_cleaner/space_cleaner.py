import os


def remove_empty_lines(text):
    lines = text.split('\n')
    non_empty_lines = [line for line in lines if line.strip() != '']
    return '\n'.join(non_empty_lines)


def process_file(filename):
    with open(filename, 'r') as file:
        c_code = file.read()

    c_code_no_comments_or_empty_lines = remove_empty_lines(c_code)

    with open(filename, 'w') as file:
        file.write(c_code_no_comments_or_empty_lines)


extensions = ['c', 'cpp', 'csharp', 'java', 'javascript', 'typescript', 'go']

for extension in extensions:
    files = os.listdir(
        "D:\\Code_Typing_Game\\scraper\\Files\\" + extension)

    for filename in files:
        print(filename)
        process_file("D:\\Code_Typing_Game\\scraper\\Files\\" +
                     extension + "\\" + filename)
