import psycopg2
import os
import glob
import datetime

# Setup PostgreSQL connection
conn = psycopg2.connect(
    dbname="users",
    user="postgres",
    password="postgres",
    host="localhost",  # or your docker machine's IP
    port="5432"
)

# Create a cursor object
cur = conn.cursor()

# Directory where your code snippets are stored
snippet_dir = "D:/Code_Typing_Game/scraper/snippet_savers"

extensions = ['c', 'cpp', 'csharp', 'go', 'html', 'java',
              'javascript', 'kotlin', 'python', 'typescript']


# Get a list of all files in directory
for extension in extensions:
    # loop through all files in each subdirectory
    currentLanguageDir = snippet_dir + '/' + extension
    filenames = os.listdir(currentLanguageDir)
    for filename in filenames:
        file_path = currentLanguageDir + '/' + filename
        with open(file_path, 'r') as file:
            code_snippet = file.read()
            # gets the folder name which represents the language
            language = os.path.basename(extension)

            # Create insert SQL statement

            insert_sql = """INSERT INTO snippets (language, code) VALUES (%s, %s)"""
            cur.execute(insert_sql, (language, code_snippet))

# Commit changes
conn.commit()

# Close cursor and connection
cur.close()
conn.close()
