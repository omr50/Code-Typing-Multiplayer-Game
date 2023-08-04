import re
import os


def remove_comments(c_code):
    pattern = r"(\".*?\"|\'.*?\')|(/\*.*?\*/|//[^\r\n]*$)"
    multiline_comment_re = re.compile(pattern, re.MULTILINE | re.DOTALL)

    def replacer(match):
        if match.group(2) is not None:
            return ""
        else:
            return match.group(1)
    return multiline_comment_re.sub(replacer, c_code)


def process_file(filename):
    with open(filename, 'r') as file:
        c_code = file.read()

    c_code_no_comments = remove_comments(c_code)

    with open(filename, 'w') as file:
        file.write(c_code_no_comments)


extensions = ['c', 'cpp', 'csharp', 'java', 'javascript', 'typescript', 'go']

for extension in extensions:
    files = os.listdir(
        "D:\\Code_Typing_Game\\scraper\\Files\\" + extension)

    for filename in files:
        print(filename)
        process_file("D:\\Code_Typing_Game\\scraper\\Files\\" +
                     extension + "\\" + filename)
