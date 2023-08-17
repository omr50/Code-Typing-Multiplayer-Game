import os
import pyperclip
import time


def save_snippet(counter, folder_path):
    file_name = "index" + str(counter) + ".txt"

    # Get the current content of the clipboard
    snippet = pyperclip.paste().replace('\r\n', '\n')

    # Remove empty lines
    lines = snippet.split('\n')
    non_empty_lines = [line for line in lines if line.strip() != '']

    with open(os.path.join(folder_path, file_name), 'w') as file:
        file.write('\n'.join(non_empty_lines))
    print(f'Snippet saved in {os.path.join(folder_path, file_name)}')


folder_path = input("Enter the folder path (or 'q' to quit): ")

if folder_path.lower() != "q":
    os.makedirs(folder_path, exist_ok=True)

    counter = 20
    last_snippet = pyperclip.paste()

    while True:
        # Wait for a moment before checking the clipboard again
        time.sleep(0.2)

        # If the clipboard content has changed, save it
        current_snippet = pyperclip.paste()
        if current_snippet != last_snippet:
            save_snippet(counter, folder_path)
            counter += 1
            last_snippet = current_snippet


# import os


# def save_snippet(counter):
#     folder_path = input("Enter the folder path (or 'q' to quit): ")

#     if folder_path.lower() == "q":
#         return False

#     os.makedirs(folder_path, exist_ok=True)

#     file_name = "index" + str(counter) + ".txt"

#     print("Enter the code snippet (finish with 'END_SNIPPET' on a new line): ")
#     lines = []
#     while True:
#         line = input()
#         if line == '':
#             break
#         lines.append(line)

#     snippet = '\n'.join(lines)

#     with open(os.path.join(folder_path, file_name), 'w') as file:
#         file.write(snippet)
#     print(f'Snippet saved in {os.path.join(folder_path, file_name)}')

#     return True


# counter = 1
# while True:
#     if not save_snippet(counter):
#         break
#     counter += 1
